"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrcidGeneralScraper = void 0;
const axios_1 = __importDefault(require("axios"));
const orcidWorkScraperApi_1 = require("./orcidWorkScraperApi");
const lodash_1 = require("lodash");
class OrcidGeneralScraper {
    constructor() {
        this.url = "https://orcid.org/0000-0002-3687-1938/worksPage.json?offset=0&sort=date&sortAsc=false&pageSize=50";
        this.orcidWorkScraper = new orcidWorkScraperApi_1.OrcidWorkScraper();
        this.scrap = () => __awaiter(this, void 0, void 0, function* () {
            let papers = [];
            const result = yield axios_1.default.get(this.url);
            const groups = result.data.groups;
            for (const group of groups) {
                try {
                    for (const paper of group.works) {
                        const title = this.extractTitle(paper);
                        const journal = this.extractJournal(paper);
                        const doi = this.extractUrls(paper);
                        const workType = this.extractWorkType(paper);
                        const date = this.extractDate(paper);
                        const workId = this.extractWorkId(paper);
                        const workDetails = yield this.orcidWorkScraper.scrap(workId);
                        const extractedPaper = {
                            title,
                            authors: workDetails.authors,
                            journal,
                            doi,
                            date,
                            journalType: workType,
                            workType
                        };
                        papers.push(extractedPaper);
                    }
                }
                catch (e) {
                }
            }
            papers = this.removeRepetitions(papers);
            return papers;
        });
        this.extractJournal = (paperCont) => {
            try {
                return paperCont.journalTitle.value;
            }
            catch (e) {
            }
        };
        this.extractWorkId = (paperCont) => {
            try {
                return lodash_1.get(paperCont, "putCode.value");
            }
            catch (e) {
            }
        };
        this.extractUrls = (paperCont) => {
            try {
                return paperCont.workExternalIdentifiers[0].url.value;
            }
            catch (e) {
                return "";
            }
        };
        this.extractTitle = (paperCont) => {
            try {
                return paperCont.title.value;
            }
            catch (e) {
            }
        };
        this.extractWorkType = (paperCont) => {
            try {
                return paperCont.workType.value;
            }
            catch (e) {
            }
        };
        this.extractDate = (paperCont) => {
            try {
                return paperCont.publicationDate.year;
            }
            catch (e) {
                //console.log(e)
            }
        };
        this.extractJournalType = (paperCont) => {
            try {
                return paperCont.publicationDate.value;
            }
            catch (e) {
                //console.log(e)
            }
        };
        //_ngcontent-xsk-c0
    }
    removeRepetitions(extractedPapers) {
        const cleanList = [];
        for (const paper of extractedPapers) {
            const doi = paper.doi;
            const title = paper.title.toLowerCase();
            const found = cleanList.find(paper => paper.doi === doi && paper.title.toLowerCase() === title);
            if (!found) {
                cleanList.push(paper);
            }
        }
        return cleanList;
    }
}
exports.OrcidGeneralScraper = OrcidGeneralScraper;
//# sourceMappingURL=orcidGeneralScraperApi.js.map