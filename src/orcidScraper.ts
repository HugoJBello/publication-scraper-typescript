const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
import puppeteer from 'puppeteer-extra'

puppeteer.use(AdblockerPlugin({blockTrackers: true}))
puppeteer.use(StealthPlugin())

export interface ExtractedPaper {
    title?: string,
    journal?: string,
    doi?: string,
    journalType?: string,
    date?: string
    preprintDate?: string
    url?: string
    pdfPreprint?: string
}

export class OrcidScraper {
    public url = "https://orcid.org/0000-0002-3687-1938"
    //https://orcid.org/0000-0002-3687-1938/worksPage.json?offset=0&sort=date&sortAsc=false&pageSize=50
    public scrap = async (): Promise<ExtractedPaper[]> => {

        const papers = [] as ExtractedPaper[]

        const browser = await puppeteer.launch({headless: true} as any);
        const page = await browser.newPage();
        await page.goto(this.url, {
            waitUntil: 'networkidle2',
        });

        const div = await page.$(".workspace-right")
        const papersCont = await div.$$(".sources-edit-list")



        for (const paperCont of papersCont) {
            try {
                const title = await this.extractTitle(paperCont,page)
                const journal = await this.extractJournal(paperCont,page)
                const doi = await this.extractUrls(paperCont,page)
                const {date, journalType} = await this.extractDate(paperCont,page)
                console.log("\n")

                const paper: ExtractedPaper = {title, journal, doi, date, journalType}
                console.log(paper)
                papers.push(paper)
            } catch (e) {

            }
        }


        await browser.close();

        return papers

    }


    public extractJournal = async (paperCont: any, page:any) => {
        try {
            const journal = await paperCont.$(".journaltitle")
            const textJournal = await page.evaluate((element:any) => element.textContent, journal);
            return textJournal
        } catch (e) {

        }

    }

    public extractUrls = async (paperCont: any, page:any) => {
        try {
            const links = await paperCont.$$("a")
            for (const link of links) {
                const textJournal = await page.evaluate((a:any) => a.href, link);
                if (textJournal.includes("doi")) {
                    return textJournal
                }
            }
            return undefined
        } catch (e) {
            console.log("urls")
        }

    }

    public extractTitle = async (paperCont: any, page:any) => {
        try {
            const spans = await paperCont.$$("span")
            const titleSpan = spans[0]
            const title = await page.evaluate((element:any) => element.textContent, titleSpan);
            return title
        } catch (e) {

        }

    }

    public extractDate = async (paperCont: any,page:any) => {
        try {
            const infoDetail = await paperCont.$(".info-detail")
            const infoDetailStr = await page.evaluate((element:any) => element.textContent, infoDetail);
            //console.log(infoDetailStr)
            let date = undefined
            let journalType = undefined

            if (infoDetailStr){
                if (infoDetailStr.includes("|")) {
                    try {
                        date = infoDetailStr.split("|")[0].trim()
                        journalType = infoDetailStr.split("|")[1].trim()
                    } catch {

                    }
                } else {
                    date = infoDetailStr
                }
            }
            return {date, journalType}
        } catch (e) {
            //console.log(e)
        }

    }


    //_ngcontent-xsk-c0
}
