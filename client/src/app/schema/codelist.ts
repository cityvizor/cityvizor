export class Codelist {

  public codelist: CodelistEntry[];

  private codelistIndex: any = {};

  constructor(public id: string, data: CodelistEntry[]) {
    this.codelist = data.map(item => {
      return {
        id: item.id,
        name: item.name,
        validFrom: item.validFrom ? new Date(item.validFrom) : null,
        validTill: item.validTill ? new Date(item.validTill) : null
      };
    });
  }

  checkDate(entry: CodelistEntry, date: Date) {
    date.setHours(0, 0, 0, 0);
    return (!entry.validFrom || entry.validFrom.getTime() <= date.getTime()) && (!entry.validTill || entry.validTill.getTime() >= date.getTime());
  }

  getName(id: string, date: Date) {
    return this.codelistIndex[id] ? this.codelistIndex[id].filter(entry => this.checkDate(entry, date))[0] : id;
  }

  getNames(date: Date) {
    return this.codelist.filter(entry => this.checkDate(entry, date)) || [];
  }

  getIndex(date: Date) {

    var index = {};

    this.getNames(date).forEach(entry => index[entry.id] = entry.name);

    return index;
  }
}

export interface CodelistEntry {
  id: string;
  name: string;
  validFrom: Date;
  validTill: Date;
}