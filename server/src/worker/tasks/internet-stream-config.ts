// TODO move it into JSON which is saved in environment
export class InternetStreamConfig {
  static source = [
    {
      shortcut: 'cernosice',
      url: 'http://rozpocet.mestocernosice.cz/opendata/',
      definitions: [
        {
          year: 2020,
          fileName: 'opendata_2020_CSV.zip',
        },
      ],
    },
    {
      shortcut: 'ub',
      url: 'http://rozpocet.ub.cz/opendata/',
      definitions: [
        {
          year: 2020,
          fileName: 'opendata_2020_CSV.zip',
        },
      ],
    },
    {
      shortcut: 'nmnm',
      url: 'http://rozpocet.nmnm.cz/opendata/',
      definitions: [
        {
          year: 2020,
          fileName: 'opendata_2020_CSV.zip',
        },
      ],
    },
  ];
}
