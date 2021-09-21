"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaperMarkdownGenerator = void 0;
class PaperMarkdownGenerator {
    constructor() {
        this.titleEs = "Artículos";
        this.titleEn = "Research Papers";
        this.date = (new Date()).toISOString();
        this.headMarkDownEs = `---
title: "${this.titleEs}"
date: ${this.date}
tags: ["Research", "Papers"]
description: mis artículos publicados y preprints
language: es
---


    `;
        this.headMarkDownEn = `---
title: "${this.titleEn}"
date: ${this.date}
translationKey: Research Papers
tags: ["Research", "Papers"]
description: my published research papers and my preprints
language: en
---


    `;
        this.generateMarkdown = (papers) => {
            const preprints = papers.filter((paper) => paper.workType === "preprint");
            const published = papers.filter((paper) => paper.workType === "journal-article");
            const papersInSpanish = this.generateMarkdownLang(published, preprints, "es");
            const papersInEnglish = this.generateMarkdownLang(published, preprints, "en");
            return { spanishVersion: papersInSpanish, englishVersion: papersInEnglish };
        };
        this.generateMarkdownLang = (publishedPapers, publishedPreprints, language) => {
            let papersList;
            if (language === "es") {
                const publishedPapersSectionHeadEs = "## Artículos publicados";
                papersList = this.headMarkDownEs + "\n" + publishedPapersSectionHeadEs;
            }
            else {
                const publishedPapersSectionHeadEn = "## Published papers";
                papersList = this.headMarkDownEn + "\n" + publishedPapersSectionHeadEn;
            }
            for (const paper of publishedPapers) {
                const mdPaper = this.generatePaperEntry(paper, language);
                papersList = papersList + "\n\n" + mdPaper;
            }
            if (language === "es") {
                const publishedPapersSectionHeadEs = "\n\n## Preprints de Artículos";
                papersList = papersList + "\n" + publishedPapersSectionHeadEs;
            }
            else {
                const publishedPapersSectionHeadEn = "\n\n## Preprints";
                papersList = papersList + "\n" + publishedPapersSectionHeadEn;
            }
            for (const paper of publishedPreprints) {
                const mdPaper = this.generatePaperEntry(paper, language);
                papersList = papersList + "\n\n" + mdPaper;
            }
            return papersList;
        };
        this.generatePaperEntry = (paper, language) => {
            let mdPaper = "1. " + `**${paper.title}**.`;
            if (paper.journalType && paper.journal) {
                mdPaper = mdPaper + ` ${paper.date} - *${paper.journal}*  (${paper.journalType})`;
            }
            else {
                mdPaper = mdPaper + ` ${paper.date} - *${paper.journal}*`;
            }
            if (paper.doi) {
                mdPaper = mdPaper + ` *[${paper.doi}](${paper.doi}).*`;
            }
            if (paper.url) {
                mdPaper = mdPaper + ` *[${paper.url}](${paper.url}).*`;
            }
            if (paper.authors) {
                console.log(paper.authors);
                const authors = paper.authors.replace(/\n/g, '').replace(/"Authors:"/g, '');
                mdPaper = mdPaper + ` <sup>${authors}</sup>`;
            }
            return mdPaper;
        };
    }
}
exports.PaperMarkdownGenerator = PaperMarkdownGenerator;
//# sourceMappingURL=paperMarkdownGenerator.js.map