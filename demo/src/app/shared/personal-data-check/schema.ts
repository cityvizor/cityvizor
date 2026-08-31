export interface PersonalDataCheckWarning {
  type: string;
  value: string;
}

export interface PersonalDataCheckOptions {
  regional: string
}

export interface PersonalDataCheckRegionalCheck {
  type: string;
  fn?: (input: string) => PersonalDataCheckWarning[];
  reg?: RegExp;
}

export interface PersonalDataCheckRegionalDef {
  checks: PersonalDataCheckRegionalCheck[];
  names: string[];
}
