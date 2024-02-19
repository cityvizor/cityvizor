import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "address" })
export class AddressPipe implements PipeTransform {
  transform(value: any, locale?: string): string {
    if (!value) return "";

    switch (locale) {
      case "cs":
      default:
        value.postalCode = value.postalCode.replace(" ", "");
        value.postalCode =
          value.postalCode.substr(0, 3) + " " + value.postalCode.substr(3);

        return (
          value.street +
          " " +
          value.streetNo +
          ",\n" +
          value.city +
          ",\n" +
          value.postalCode
        );
    }
  }
}

@Pipe({ name: "postalCode" })
export class PostalCodePipe implements PipeTransform {
  transform(value: string | number, locale?: string): string {
    if (!value) return "";

    if (typeof value === "number") value = String(value);

    switch (locale) {
      case "cs":
      default:
        value = value.replace(" ", "");
        value = value.substr(0, 3) + " " + value.substr(3);
    }

    return value;
  }
}
