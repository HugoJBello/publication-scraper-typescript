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
exports.OrcidWorkScraper = void 0;
const axios_1 = __importDefault(require("axios"));
const lodash_1 = require("lodash");
class OrcidWorkScraper {
    constructor() {
        this.url = "https://orcid.org/0000-0002-3687-1938/getWorkInfo.json?workId=";
        this.scrap = (workID) => __awaiter(this, void 0, void 0, function* () {
            const url = this.url + workID;
            const result = yield axios_1.default.get(url);
            const data = result.data;
            const details = {};
            try {
                console.log(data);
                details.authors = this.extractAuthors(data);
            }
            catch (e) {
            }
            return details;
        });
        this.extractAuthors = (data) => {
            try {
                return lodash_1.get(data, "shortDescription.value");
            }
            catch (e) {
                console.log(e);
            }
        };
        //_ngcontent-xsk-c0
    }
}
exports.OrcidWorkScraper = OrcidWorkScraper;
//# sourceMappingURL=orcidWorkScraperApi.js.map