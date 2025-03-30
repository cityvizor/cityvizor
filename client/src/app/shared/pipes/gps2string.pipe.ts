import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "gps2string",
})
export class Gps2stringPipe implements PipeTransform {
  transform(value: [number, number]): string {
    const [gpsX, gpsY] = value;
    if (!gpsX || !gpsY) return "";

    let gps = [gpsX, gpsY];
    let dg = gps.map(n => Math.round(n)); // get degrees
    let mn = gps.map(n => Math.round((n % 1) * 60 * 1000) / 1000); // get minutes
    let st = [0, 1].map(i => dg[i] + "° " + mn[i] + "'"); // get string
    return (
      (gpsX > 0 ? "N" : "S") +
      " " +
      st[1] +
      ", " +
      (gpsY > 0 ? "E" : "W") +
      " " +
      st[0]
    ); // concatenate
  }
}
