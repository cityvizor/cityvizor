import axios from 'axios'

export type WGS84 = { _type: "WGS84" }
export type S_JTSK = { _type: "S-JTSK" }
export type CoordinateSystem = WGS84 | S_JTSK
export type Location<T extends CoordinateSystem> = [number, number] & T

const ENDPOINT = 'https://api.apitalks.store/cuzk.cz/adresni-mista-cr?'

export async function getLocation(addressPoint: string, apiKey: string): Promise<Location<WGS84> | null> {

    const response = await axios.get(ENDPOINT, {
        headers: {
            'x-api-key': apiKey
        },
        params: {
            filter: `{"where":{"KOD_ADM": ${addressPoint}}}`
        }
    })

    const items = response.data.data

    if (Array.isArray(items) && items.length > 0) {
        const x = parseFloat(items[0].SOURADNICE_X)
        const y = parseFloat(items[0].SOURADNICE_Y)
        if (x != null && y != null) {
            return convertCoordinatesJtskToWgs(x, y, 0)
        } else {
            return null
        }
    } else {
        return null
    }
}

// TODO: Switch to proj4js instead.
export function convertCoordinatesJtskToWgs(X: number, Y: number, H: number): Location<WGS84> {

    if (X < 0 && Y < 0) { X = -X; Y = -Y; }
    var coord = { wgs84_latitude: "", wgs84_longitude: "", lat: 0, lon: 0, vyska: 0 };

    /* Přepočet vstupích údajů - vychazi z nejakeho skriptu, ktery jsem nasel na Internetu - nejsem autorem prepoctu. */

    /*Vypocet zemepisnych souradnic z rovinnych souradnic*/
    let a = 6377397.15508;
    const e = 0.081696831215303;
    const n = 0.97992470462083;
    const konst_u_ro = 12310230.12797036;
    const sinUQ = 0.863499969506341;
    const cosUQ = 0.504348889819882;
    const sinVQ = 0.420215144586493;
    const cosVQ = 0.907424504992097;
    const alfa = 1.000597498371542;
    const k = 1.003419163966575;
    let ro = Math.sqrt(X * X + Y * Y);
    const epsilon = 2 * Math.atan(Y / (ro + X));
    const D = epsilon / n;
    const S = 2 * Math.atan(Math.exp(1 / n * Math.log(konst_u_ro / ro))) - Math.PI / 2;
    const sinS = Math.sin(S);
    const cosS = Math.cos(S);
    const sinU = sinUQ * sinS - cosUQ * cosS * Math.cos(D);
    const cosU = Math.sqrt(1 - sinU * sinU);
    const sinDV = Math.sin(D) * cosS / cosU;
    const cosDV = Math.sqrt(1 - sinDV * sinDV);
    const sinV = sinVQ * cosDV - cosVQ * sinDV;
    const cosV = cosVQ * cosDV + sinVQ * sinDV;
    const Ljtsk = 2 * Math.atan(sinV / (1 + cosV)) / alfa;
    let t = Math.exp(2 / alfa * Math.log((1 + sinU) / cosU / k));
    let pom = (t - 1) / (t + 1);
    let sinB;
    do {
        sinB = pom;
        pom = t * Math.exp(e * Math.log((1 + e * sinB) / (1 - e * sinB)));
        pom = (pom - 1) / (pom + 1);
    } while (Math.abs(pom - sinB) > 1e-15);

    const Bjtsk = Math.atan(pom / Math.sqrt(1 - pom * pom));


    /* Pravoúhlé souřadnice ve S-JTSK */
    a = 6377397.15508; let f_1 = 299.152812853;
    let e2 = 1 - (1 - 1 / f_1) * (1 - 1 / f_1); ro = a / Math.sqrt(1 - e2 * Math.sin(Bjtsk) * Math.sin(Bjtsk));
    const x = (ro + H) * Math.cos(Bjtsk) * Math.cos(Ljtsk);
    const y = (ro + H) * Math.cos(Bjtsk) * Math.sin(Ljtsk);
    const z = ((1 - e2) * ro + H) * Math.sin(Bjtsk);

    /* Pravoúhlé souřadnice v WGS-84*/
    const dx = 570.69; const dy = 85.69; const dz = 462.84;
    const wz = -5.2611 / 3600 * Math.PI / 180; const wy = -1.58676 / 3600 * Math.PI / 180; const wx = -4.99821 / 3600 * Math.PI / 180; const m = 3.543e-6;
    const xn = dx + (1 + m) * (x + wz * y - wy * z); const yn = dy + (1 + m) * (-wz * x + y + wx * z); const zn = dz + (1 + m) * (wy * x - wx * y + z);

    /* Geodetické souřadnice v systému WGS-84*/
    a = 6378137.0; f_1 = 298.257223563;
    const a_b = f_1 / (f_1 - 1); const p = Math.sqrt(xn * xn + yn * yn); e2 = 1 - (1 - 1 / f_1) * (1 - 1 / f_1);
    const theta = Math.atan(zn * a_b / p); const st = Math.sin(theta); const ct = Math.cos(theta);
    t = (zn + e2 * a_b * a * st * st * st) / (p - e2 * a * ct * ct * ct);
    let B = Math.atan(t); let L = 2 * Math.atan(yn / (p + xn)); H = Math.sqrt(1 + t * t) * (p - a / Math.sqrt(1 + (1 - e2) * t * t));

    /* Formát výstupních hodnot */

    B = B / Math.PI * 180;

    coord.lat = B;
    let latitude = "N"; if (B < 0) { B = -B; latitude = "S"; }

    const st_sirky = Math.floor(B); B = (B - st_sirky) * 60; const min_sirky = Math.floor(B);
    B = (B - min_sirky) * 60;
    const vt_sirky = Math.round(B * 1000) / 1000;
    latitude = st_sirky + "°" + min_sirky + "'" + vt_sirky + latitude;
    coord.wgs84_latitude = latitude;

    L = L / Math.PI * 180;
    coord.lon = L;
    let longitude = "E"; if (L < 0) { L = -L; longitude = "W"; }

    const st_delky = Math.floor(L); L = (L - st_delky) * 60; const min_delky = Math.floor(L);
    L = (L - min_delky) * 60; const vt_delky = Math.round(L * 1000) / 1000;
    longitude = st_delky + "°" + min_delky + "'" + vt_delky + longitude;
    coord.wgs84_longitude = longitude;

    coord.vyska = Math.round((H) * 100) / 100;

    return [coord.lat, coord.lon] as Location<WGS84>
}
