import axios from "axios";
import {get} from "lodash"

export interface WorkDetails {
    authors?: string
}

export class OrcidWorkScraper {
    public url = "https://orcid.org/0000-0002-3687-1938/getWorkInfo.json?workId="


    public scrap = async (workID: string): Promise<WorkDetails> => {

        const url = this.url + workID
        const result = await axios.get(url)

        const data = result.data
        const details: WorkDetails = {} as WorkDetails

        try {
            console.log(data)
            details.authors = this.extractAuthors(data)
        } catch (e) {
        }

        return details

    }


    public extractAuthors = (data: any): string => {
        try {
            return get(data, "shortDescription.value")
        } catch (e) {
            console.log(e)
        }

    }

    //_ngcontent-xsk-c0
}
