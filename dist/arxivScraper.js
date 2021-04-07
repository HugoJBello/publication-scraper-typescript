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
exports.ArxivScraper = void 0;
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
puppeteer_extra_1.default.use(AdblockerPlugin({ blockTrackers: true }));
puppeteer_extra_1.default.use(StealthPlugin());
class ArxivScraper {
    constructor() {
        this.url = "https://arxiv.org/search/?searchtype=author&query=Bello%2C+H+J&order=-announced_date_first&size=50&abstracts=show";
        this.scrap = () => __awaiter(this, void 0, void 0, function* () {
            const papers = [];
            const browser = yield puppeteer_extra_1.default.launch({ headless: true });
            const page = yield browser.newPage();
            yield page.goto(this.url, {});
            const div = yield page.$(".content");
            const papersCont = yield div.$$(".arxiv-result");
            for (const paperCont of papersCont) {
                try {
                    const title = yield this.extractTitle(paperCont, page);
                    const urls = yield this.extractUrls(paperCont, page);
                    const date = yield this.extractDate(paperCont, page);
                    console.log("--------------------------\n");
                    const paper = { title, date: date, pdfPreprint: urls.pdf, url: urls.pdf };
                    console.log(paper);
                    papers.push(paper);
                }
                catch (e) {
                }
            }
            yield browser.close();
            return papers;
        });
        this.extractUrls = (paperCont, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const links = yield paperCont.$$("a");
                const urls = { pdf: undefined, arxiv: undefined };
                for (const link of links) {
                    const url = yield page.evaluate((a) => a.href, link);
                    if (url.includes("pdf"))
                        urls.pdf = url;
                    if (url.includes("abs"))
                        urls.arxiv = url;
                }
                return urls;
            }
            catch (e) {
                console.log("urls");
            }
        });
        this.extractTitle = (paperCont, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const infoDetail = yield paperCont.$$("p");
                const title = yield page.evaluate((element) => element.textContent, infoDetail[1]);
                return title.replace(/\n/g, "").trim();
            }
            catch (e) {
            }
        });
        this.extractDate = (paperCont, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const infoDetail = yield paperCont.$$("p");
                const infoDetailStr = yield page.evaluate((element) => element.textContent, infoDetail[4]);
                return infoDetailStr.replace(/\n/g, "").trim();
            }
            catch (e) {
                //console.log(e)
            }
        });
        //_ngcontent-xsk-c0
        this.extractAuthors = (paperCont, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const infoDetail = yield paperCont.$$("p");
                const infoDetailStr = yield page.evaluate((element) => element.textContent, infoDetail[1]);
                console.log(infoDetailStr);
                return infoDetailStr;
            }
            catch (e) {
                //console.log(e)
            }
        });
        //_ngcontent-xsk-c0
    }
}
exports.ArxivScraper = ArxivScraper;
//# sourceMappingURL=arxivScraper.js.map