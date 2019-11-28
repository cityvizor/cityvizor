import { readFileSync, writeFileSync } from "fs";
import { xml2json } from "xml-js";
import axios from 'axios'
import { convertCoordinatesJtskToWgs } from "./CoordinatesConversion";

const RUIAN_ENDPOINT = 'https://api.apitalks.store/cuzk.cz/adresni-mista-cr?}'
const RUIAN_APIKEY = 'hE3xVpdow96XqblQaQmQO3TWZe0O96Ay8ALKH0hH'


async function getJTSKCoordinates(addressPoint: string) {
    const response = await axios.get(RUIAN_ENDPOINT, {
        headers: {
            'x-api-key': RUIAN_APIKEY
        },
        params: {
            filter: `{"where":{"KOD_ADM": ${addressPoint}}}`
        }
    })

    return {
        "souradniceX": response.data.data[0].SOURADNICE_X,
        "souradniceY": response.data.data[0].SOURADNICE_Y
    }
}

async function getEDeskyID(municip){
    const response = await axios.get('https://edesky.cz/desky?', {
        params: {
            hledat: municip
        }
    })

    const regex = /href="\/desky\/(\d+)-/gsm
    const match = regex.exec(response.data)
    if (match) {
        return match[1]
    } else {
        return null
    }
}



async function main() {
    const rawdata = readFileSync("czechpoint_seznam_obci.xml");
    var xml = rawdata.toString()

    var jsonstring = xml2json(xml, { compact: true, spaces: 0 });

    const data = JSON.parse(jsonstring);

    const subjekty = data["SeznamOvmIndex"]['Subjekt']

    const result = []

    for (const subjekt of subjekty) {
        try {
            if (subjekt["PravniForma"]["_attributes"]["type"] === "801") {

                const adresaUradu = {}
                for (let [key, value] of Object.entries<any>(subjekt["AdresaUradu"])) {
                    const lowerCaseKey = key.charAt(0).toLowerCase() + key.slice(1)
                    adresaUradu[lowerCaseKey] = value["_text"]
                }

                const emails = []
                if(subjekt["Email"] && subjekt["Email"]["Polozka"]){
                for (let entry of (subjekt["Email"]["Polozka"])) {
                    emails.push({ "email": entry["Email"]["_text"], "typ": entry["Typ"]["_attributes"]["text"] })
                }
                }   

                const nazev = subjekt["Nazev"] && subjekt["Nazev"]["_text"] ? subjekt["Nazev"]["_text"]: null

                const [coordinatesJTSK, eDeskyId] = await Promise.all([getJTSKCoordinates(adresaUradu["adresniBod"]), getEDeskyID(nazev)])

                const coordinatesWGS = convertCoordinatesJtskToWgs(parseFloat(coordinatesJTSK.souradniceX), parseFloat(coordinatesJTSK.souradniceY), 0)
                
                result.push({
                    "nazev": nazev,
                    "ICO": subjekt["ICO"] && subjekt["ICO"]["_text"] ? subjekt["ICO"]["_text"]: null ,
                    "datovaSchranka": subjekt["IdDS"] && subjekt["IdDS"]["_text"] ? subjekt["IdDS"]["_text"]: null,
                    "zkratka": subjekt["Zkratka"] && subjekt["Zkratka"]["_text"] ? subjekt["Zkratka"]["_text"]: null,
                    "eDeskyId": eDeskyId ,
                    "adresaUradu": adresaUradu,
                    "emails": emails,
                    "souradniceJTSK": { ...coordinatesJTSK },
                    "souradniceWGS": { ...coordinatesWGS }

                })

                if(result.length % 10 === 0){
                    console.log(result.length);
                    
                }
            }
            // if (result.length === 100) {
            //     break;
            // }
        }
        catch (e) {
            console.log(e, subjekt);
        }

    }

    writeFileSync("./result.json", JSON.stringify((result)));
}


main().then(() => { console.log("done") })