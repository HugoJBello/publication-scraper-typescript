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
const orcidScraperApi_1 = require("./orcidScraperApi");
const fs_1 = __importDefault(require("fs"));
const paperMarkdownGenerator_1 = require("./paperMarkdownGenerator");
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----");
    const orcidScraper = new orcidScraperApi_1.OrcidScraper();
    const papers = yield orcidScraper.scrap();
    fs_1.default.writeFileSync("data/papers_orcid.json", JSON.stringify(papers));
    const paperMarkdownGenrator = new paperMarkdownGenerator_1.PaperMarkdownGenerator();
    const { spanishVersion, englishVersion } = paperMarkdownGenrator.generateMarkdown(papers);
    fs_1.default.writeFileSync("data/papers.es.md", spanishVersion);
    fs_1.default.writeFileSync("data/papers.en.md", englishVersion);
}))();
//# sourceMappingURL=index.js.map