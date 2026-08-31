import { PersonalDataCheckRegionalCheck, PersonalDataCheckRegionalDef, PersonalDataCheckWarning } from "./schema";

export * from "./schema";

export class PersonalDataCheck {

  namesReg: RegExp;
  regionalChecks: PersonalDataCheckRegionalCheck[];

  dateReg: RegExp = /\d{1,2}\. ?\d{1,2}\. ?(\d{2}|')?\d{2}|\d{4}\-\d{2}\-\d{2}|\d{1,2}\/\d{1,2}\/\d{2}?\d{2}/g;

  constructor(regional?: PersonalDataCheckRegionalDef) {

    if (regional) {
      this.namesReg = new RegExp("(^|[ \\.,])(" + regional.names.join("|") + ")($|[ \\.,])", "iug");
      this.regionalChecks = regional.checks;
    }
  }

  check(data: string): PersonalDataCheckWarning[] {

    const today = new Date();

    const warnings: PersonalDataCheckWarning[] = [];

    /* NAMES */
    if (this.namesReg) {
      let result;
      while (result = this.namesReg.exec(data)) {
        if (result) warnings.push({ type: "name", value: result[2] });
      }
    }

    /* DATES */
    {
      let result;
      while (result = this.dateReg.exec(data)) {
        const date = new Date(result[0]);
        if (date && date.getTime() <= today.getTime()) warnings.push({ type: "birthday", value: result[0] });
        else warnings.push({ type: "date", value: result[0] });
      }
    }

    /* REGIONAL */
    if (this.regionalChecks) {
      this.regionalChecks.forEach(check => {

        if (check.reg) {
            let first = true; // run non global regs only once
            let result;
            while (result = (first || check.reg.global) && check.reg.exec(data)) {
              first = false;
              if (typeof result === "object") warnings.push({ type: check.type, value: result[0] });
            }
        }
        
        if(check.fn){
          warnings.push(...check.fn(data));
        }
      })
    }

    return warnings;
  }
}
