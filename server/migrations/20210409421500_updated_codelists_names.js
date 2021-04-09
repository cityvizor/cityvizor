// Recover the deleted names and properly insert as items.
const items = [
  {id: '1229', name: 'Spotřební daň ze zahřívaných tabákových výrobků'},
  {id: '1235', name: 'Daň z digitálních služeb'},
  {id: '1357', name: 'Poplatek za odebrané množství podzemní vody'},
  {id: '1358', name: 'Poplatek za využívání zdroje přírodní minerální vody'},
  {id: '1362', name: 'Soudní poplatky'},
  {id: '1379', name: 'Ostatní poplatky na činnost správních úřadů'},
  {id: '1385', name: 'Dílčí daň z technických her'},
  {
    id: '4251',
    name:
      'Investiční převody mezi statutárními městy (hl. m. Prahou) a jejich městskými obvody nebo částmi - příjmy',
  },
  {id: '5177', name: 'Nákup archiválií'},
  {
    id: '5216',
    name:
      'Neinvestiční transfery obecním a krajským nemocnicím - obchodním společnostem',
  },
  {id: '5811', name: 'Výdaje na náhrady za nezpůsobenou újmu'},
  {id: '5903', name: 'Rezerva na krizová opatření'},
  {
    id: '5904',
    name: 'Převody domněle neoprávněně použitých dotací zpět poskytovateli',
  },
  {
    id: '6316',
    name:
      'Investiční transfery obecním a krajským nemocnicím - obchodním společnostem',
  },
  {
    id: '6363',
    name:
      'Investiční převody mezi statutárními městy (hl. m. Prahou) a jejich městskými obvody nebo částmi - výdaje',
  },
];

exports.up = async function (knex) {
  for (const item of items) {
    await knex('data.codelists')
      .where('id', item.id)
      .update('codelist', 'items')
      .update('name', item.name);
  }
};

exports.down = async function (knex) {
  return knex('data.codelists').delete();
};
