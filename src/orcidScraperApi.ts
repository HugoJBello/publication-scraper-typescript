import axios from "axios";

export interface ExtractedPaper {
    title?: string,
    journal?: string,
    doi?: string,
    journalType?: string,
    workType?: string,
    date?: string
    preprintDate?: string
    url?: string
    pdfPreprint?: string
}

export class OrcidScraper {
    public url = "https://orcid.org/0000-0002-3687-1938/worksPage.json?offset=0&sort=date&sortAsc=false&pageSize=50"


    public scrap = async (): Promise<ExtractedPaper[]> => {

        let papers = [] as ExtractedPaper[]

        const result = await axios.get(this.url)

        const groups = result.data.groups

        for (const group of groups) {
            try {
                for (const paper of group.works) {
                    console.log(paper)
                    const title =  this.extractTitle(paper)
                    const journal =  this.extractJournal(paper)
                    const doi =  this.extractUrls(paper)
                    const workType =  this.extractWorkType(paper)
                    const date =  this.extractDate(paper)
                    console.log("\n")

                    const extractedPaper: ExtractedPaper = {title, journal, doi, date, journalType:workType, workType} as ExtractedPaper
                    papers.push(extractedPaper)
                }
            } catch (e) {

            }
        }
        papers = this.removeRepetitions(papers)
        console.log(papers)
        return papers

    }


    public extractJournal =  (paperCont: any) => {
        try {
            return paperCont.journalTitle.value
        } catch (e) {

        }

    }

    public extractUrls =  (paperCont: any) => {
        try {
            return paperCont.workExternalIdentifiers[0].url.value

        } catch (e) {
            return ""
        }

    }

    public extractTitle =  (paperCont: any) => {
        try {
            return paperCont.title.value

        } catch (e) {

        }

    }

    public extractWorkType =  (paperCont: any) => {
        try {
            return paperCont.workType.value
        } catch (e) {

        }

    }

    public extractDate =  (paperCont: any) => {
        try {
            return paperCont.publicationDate.year
        } catch (e) {
            //console.log(e)
        }

    }

    public extractJournalType =  (paperCont: any) => {
        try {
            return paperCont.publicationDate.value
        } catch (e) {
            //console.log(e)
        }

    }

    public removeRepetitions(extractedPapers: ExtractedPaper[]): ExtractedPaper[]{
        const cleanList = []
        for (const paper of extractedPapers) {
            const doi = paper.doi
            const title = paper.title.toLowerCase()
            const found = cleanList.find(paper => paper.doi === doi && paper.title.toLowerCase() === title)
            if (!found) {
                cleanList.push(paper)
            }
        }
        return cleanList

    }


    //_ngcontent-xsk-c0
}
