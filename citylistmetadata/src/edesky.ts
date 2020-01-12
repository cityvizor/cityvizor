import axios from 'axios'

const ENDPOINT = 'https://edesky.cz/desky?'

export async function getEDeskyID(cityName: string): Promise<string | null> {

    const response = await axios.get(ENDPOINT, {
        params: {
            hledat: cityName
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
