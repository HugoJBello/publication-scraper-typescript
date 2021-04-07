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
exports.OrcidScraper = void 0;
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
puppeteer_extra_1.default.use(AdblockerPlugin({ blockTrackers: true }));
puppeteer_extra_1.default.use(StealthPlugin());
class OrcidScraper {
    constructor() {
        this.url = "https://orcid.org/0000-0002-3687-1938";
        this.scrap = () => __awaiter(this, void 0, void 0, function* () {
            const papers = [];
            const browser = yield puppeteer_extra_1.default.launch({ headless: true });
            const page = yield browser.newPage();
            yield page.goto(this.url, {
                waitUntil: 'networkidle2',
            });
            const div = yield page.$(".workspace-right");
            const papersCont = yield div.$$(".sources-edit-list");
            for (const paperCont of papersCont) {
                try {
                    const title = yield this.extractTitle(paperCont, page);
                    const journal = yield this.extractJournal(paperCont, page);
                    const doi = yield this.extractUrls(paperCont, page);
                    const { date, journalType } = yield this.extractDate(paperCont, page);
                    console.log("\n");
                    const paper = { title, journal, doi, date, journalType };
                    console.log(paper);
                    papers.push(paper);
                }
                catch (e) {
                }
            }
            yield browser.close();
            return papers;
        });
        this.extractJournal = (paperCont, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const journal = yield paperCont.$(".journaltitle");
                const textJournal = yield page.evaluate((element) => element.textContent, journal);
                return textJournal;
            }
            catch (e) {
            }
        });
        this.extractUrls = (paperCont, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const links = yield paperCont.$$("a");
                for (const link of links) {
                    const textJournal = yield page.evaluate((a) => a.href, link);
                    if (textJournal.includes("doi")) {
                        return textJournal;
                    }
                }
                return undefined;
            }
            catch (e) {
                console.log("urls");
            }
        });
        this.extractTitle = (paperCont, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spans = yield paperCont.$$("span");
                const titleSpan = spans[0];
                const title = yield page.evaluate((element) => element.textContent, titleSpan);
                return title;
            }
            catch (e) {
            }
        });
        this.extractDate = (paperCont, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const infoDetail = yield paperCont.$(".info-detail");
                const infoDetailStr = yield page.evaluate((element) => element.textContent, infoDetail);
                //console.log(infoDetailStr)
                let date = undefined;
                let journalType = undefined;
                if (infoDetailStr) {
                    if (infoDetailStr.includes("|")) {
                        try {
                            date = infoDetailStr.split("|")[0].trim();
                            journalType = infoDetailStr.split("|")[1].trim();
                        }
                        catch (_a) {
                        }
                    }
                    else {
                        date = infoDetailStr;
                    }
                }
                return { date, journalType };
            }
            catch (e) {
                //console.log(e)
            }
        });
        //_ngcontent-xsk-c0
    }
}
exports.OrcidScraper = OrcidScraper;
//# sourceMappingURL=orcidScraper.js.map