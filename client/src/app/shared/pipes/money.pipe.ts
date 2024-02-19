import { Pipe, PipeTransform } from "@angular/core";

/**
 * Pipe that transforms number to a czech currency format (without currency name)
 * value:number - the number to be formatted
 * decimal:number - how many decimal points should be included
 * autoDivide:boolean - if number should be autmatically divided by thousands (tis.), millions (mil.) and billions (mld.) and appropriate czech abbrevation added (in parenthesis)
 **/

@Pipe({ name: "money" })
export class MoneyPipe implements PipeTransform {
  transform(value: number, decimal: number, autoDivide: boolean): string {
    var add = "";
    if (isNaN(Number(decimal))) decimal = 0;

    if (autoDivide) {
      if (Math.abs(value) > 950) {
        value = value / 1000;
        add = " tis.";
      }
      if (Math.abs(value) > 950) {
        value = value / 1000;
        add = " mil.";
      }
      if (Math.abs(value) > 950) {
        value = value / 1000;
        add = " mld.";
      }
      // low rounded values are misleading
      if (value < 10 && decimal === 0) decimal = 1;
    }

    /* round number to the correct number of decimals if decimal parameter not null */
    value = Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);

    /* splits number to integer and decimal part */
    var parts = value.toString().split(".");

    /* add thousands separator (space in czech format) */
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    /* add trailing zeroes in case number rounds to lower number of decimal numberd */
    if (decimal != null && parts[1] && parts[1].length < decimal)
      parts[1] = String(parts[1] + "0".repeat(decimal)).slice(0, decimal);

    return parts.join(",") + add;
  }
}
