import {ArxivScraper} from "../arxivScraper";

describe('arxiv', function () {

    it('scraps arxiv correctly', async () => {

        const scraper = new ArxivScraper()
        const papers = await scraper.scrap()
        console.log(papers)

        expect(papers.length).toBeGreaterThan(0)

    })
})
