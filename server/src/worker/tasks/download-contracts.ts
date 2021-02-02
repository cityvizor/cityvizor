/* tslint:disable:no-console */
import axios from 'axios';

import cheerio from 'cheerio';
import {db} from '../../db';
import {ProfileRecord, ContractRecord} from '../../schema';

import {DateTime} from 'luxon';
import {CronTask} from '../../schema/cron';

// how many contracts per profile should be downloaded
const limit = 20;

export const TaskDownloadContracts: CronTask = {
  id: 'download-contracts',
  name: 'Download contracts from https://smlouvy.gov.cz/',
  exec: async () => {
    // get all the profiles
    const profiles = await db<ProfileRecord>('profiles');

    console.log(
      'Found ' + profiles.length + ' profiles to download contracts for.'
    );

    for (const profile of profiles) {
      try {
        await downloadContracts(profile);
      } catch (err) {
        console.error(
          "Couldn't download contracts for " + profile.name + ': ' + err.message
        );
      }
    }
  },
};

async function downloadContracts(profile) {
  console.log('---');
  console.log(profile.name);

  if (!profile.ico) {
    console.log('ICO not available, aborting.');
    return;
  }

  const url =
    'https://smlouvy.gov.cz/vyhledavani?searchResultList-limit=' +
    limit +
    '&do=searchResultList-setLimit&subject_idnum=' +
    profile.ico +
    '&all_versions=0';

  // request data from YQL by HTTPS
  const html = (await axios.get(url)).data;

  const $ = cheerio.load(html);

  // variable to prepare contracts for writing to DB
  const contracts: ContractRecord[] = [];

  // assign values, create contracts' data
  $('tr', '#snippet-searchResultList-list').each((i, row) => {
    if (i === 0) return;

    const items = $(row).children();

    const amount = parseAmount(items.eq(4).text().trim());

    const contract: ContractRecord = {
      profileId: profile.id,
      title: items.eq(1).text().trim(),
      date: parseDate(items.eq(3).text().trim()),
      amount: amount[0],
      currency: amount[1],
      counterparty: items.eq(5).text().trim(),
      url: 'https://smlouvy.gov.cz' + items.eq(6).find('a').attr('href'),
    } as ContractRecord;

    contracts.push(contract);
  });

  await db('data.contracts').where({profileId: profile.id}).delete();

  // insert all the contracts to DB
  await db('data.contracts').insert(contracts);

  console.log('Updated ' + contracts.length + ' contracts');
}

function parseAmount(original: string): [number | null, string | null] {
  if (original.trim() === 'Neuvedeno') return [null, null];
  const matches = original.match(/([\d ]+) ([A-Z]+)/);
  if (!matches || matches.length < 3) return [null, null];
  return [Number(matches[1].replace(/[^\d]/g, '')), matches[2]];
}

function parseDate(dateString: string): string {
  const matches = dateString.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (matches && matches.length > 2)
    return DateTime.local(
      Number(matches[3]),
      Number(matches[2]),
      Number(matches[1])
    ).toISODate();
  return DateTime.local().toISODate();
}
