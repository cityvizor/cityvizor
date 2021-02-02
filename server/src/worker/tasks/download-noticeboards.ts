import axios from 'axios';
import cheerio from 'cheerio';

import config from '../../config';

import {ProfileRecord} from '../../schema';
import {db} from '../../db';
import {NoticeboardRecord} from '../../schema/database/noticeboard';
import {CronTask} from '../../schema/cron';

// how many contracts per profile should be downloaded
const limit = 20;

export const TaskDownloadNoticeboards: CronTask = {
  id: 'download-noticeboards',

  name: 'Download notice board documents from https://eDesky.cz/',

  exec: async () => {
    // get all the profiles
    const profiles = await db<ProfileRecord>('app.profiles').select(
      'id',
      'name',
      'edesky'
    );

    console.log(
      'Found ' + profiles.length + ' profiles to download documents for.'
    );

    // starts the loop to download contracts
    for (const profile of profiles) {
      try {
        await downloadNoticeboards(profile);
      } catch (err) {
        console.error(
          "Couldn't download noticeboard for " +
            profile.name +
            ': ' +
            err.message
        );
      }
    }
  },
};

async function downloadNoticeboards(
  profile: Pick<ProfileRecord, 'id' | 'name' | 'edesky'>
) {
  console.log('---');
  console.log('Requesting download for profile ' + profile.name);

  // if no ID we can continue to next one
  if (!profile.edesky) {
    console.log('Variable profile.edesky empty, aborting.');
    return;
  }

  const params = {
    api_key: config.eDesky.api_key,
    dashboard_id: profile.edesky,
    order: 'date',
    search_with: 'sql',
    page: 1,
  };

  const url =
    config.eDesky.url +
    '?' +
    Object.keys(params)
      .map(key => key + '=' + params[key])
      .join('&');

  // request data from by HTTPS
  const xml = (await axios.get(url)).data;

  const $ = cheerio.load(xml);

  // variable to write to DB
  const documents: NoticeboardRecord[] = [];

  // assign values, create contracts' data
  $('document')
    .slice(0, 25)
    .each((i, document) => {
      documents.push({
        profileId: profile.id,

        date: $(document).attr('created_at'),
        title: $(document).attr('name'),
        category: $(document).attr('category'),

        documentUrl: $(document).attr('orig_url'),
        edeskyUrl: $(document).attr('edesky_url'),
        previewUrl: $(document).attr('edesky_text_url'),

        attachments: $(document).find('attachment').length,
      });
    });

  console.log(`Found ${documents.length} noticeboard docs.`);

  console.log('Deleting old noticeboard docs...');
  await db('data.noticeboards').where({profileId: profile.id}).delete();

  console.log('Inserting new noticeboard docs...');
  await db('data.noticeboards').insert(documents);

  console.log('Written ' + documents.length + ' documents');
}
