export enum Rule {
  required,
  maxLength,
  minLength,
}

export const getInputTextErrorMessage = (ruleList: any, value: string) => {
  if (ruleList != undefined) {
    const errorKeys = Object.keys(ruleList).map((item) => Number(item));
  
    if (errorKeys.includes(Rule.required) && (!value || !value.length)) {
      return ruleList[Rule.required];
    } else if (errorKeys.includes(Rule.maxLength) && value.length > ruleList[Rule.maxLength].value) {
      return ruleList[Rule.maxLength].message;
    } else if (errorKeys.includes(Rule.minLength) && value.length < ruleList[Rule.minLength].value) {
      return ruleList[Rule.minLength].message;
    }
  }
  return undefined;
};
