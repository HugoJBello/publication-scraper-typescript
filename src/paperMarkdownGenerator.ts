import {ExtractedPaper} from "./orcidScraperApi";

export class PaperMarkdownGenerator {
    public titleEs = "Artículos"
    public titleEn = "Research Papers"

    public date = (new Date()).toISOString()

    public headMarkDownEs = `---
title: "${this.titleEs}"
date: ${this.date}
tags: ["Research", "Papers"]
description: mis artículos publicados y preprints
language: es
---


    `

    public headMarkDownEn = `---
title: "${this.titleEn}"
date: ${this.date}
translationKey: Research Papers
tags: ["Research", "Papers"]
description: my published research papers and my preprints
language: en
---


    `
    public generateMarkdown = (papers: ExtractedPaper[]) => {
        const preprints = papers.filter((paper:ExtractedPaper) => paper.workType === "preprint")
        const published = papers.filter((paper:ExtractedPaper) => paper.workType === "journal-article")
        const papersInSpanish = this.generateMarkdownLang(published, preprints, "es")
        const papersInEnglish = this.generateMarkdownLang(published, preprints, "en")

        return {spanishVersion: papersInSpanish, englishVersion:papersInEnglish}

    }

    private generateMarkdownLang = (publishedPapers: ExtractedPaper[], publishedPreprints: ExtractedPaper[], language:string) => {

        let papersList: string

        if (language === "es") {
            const publishedPapersSectionHeadEs = "## Artículos publicados"
            papersList = this.headMarkDownEs + "\n" + publishedPapersSectionHeadEs
        } else {
            const publishedPapersSectionHeadEn = "## Published papers"
            papersList = this.headMarkDownEn + "\n" + publishedPapersSectionHeadEn
        }


        for (const paper of publishedPapers) {
            const mdPaper = this.generatePaperEntry(paper,language)
            papersList = papersList + "\n\n" + mdPaper
        }

        if (language === "es") {
            const publishedPapersSectionHeadEs = "\n\n## Preprints de Artículos"
            papersList = papersList + "\n" + publishedPapersSectionHeadEs
        } else {
            const publishedPapersSectionHeadEn = "\n\n## Preprints"
            papersList = papersList + "\n" + publishedPapersSectionHeadEn
        }

        for (const paper of publishedPreprints) {
            const mdPaper = this.generatePaperEntry(paper,language)
            papersList = papersList + "\n\n" + mdPaper
        }


        return papersList
    }

    private generatePaperEntry = (paper: ExtractedPaper, language:string) => {
        let mdPaper = "1. " + `**${paper.title}**`

        if (paper.journalType && paper.journal) {
            mdPaper = mdPaper + `\n ${paper.date} - *${paper.journal}*  (${paper.journalType})`
        } else {
            mdPaper = mdPaper + `\n ${paper.date} - *${paper.journal}*`
        }

        if (paper.doi) {
            mdPaper = mdPaper + `\n *[${paper.doi}](${paper.doi})*`
        }

        if (paper.url) {
            mdPaper = mdPaper + `\n *[${paper.url}](${paper.url})*`
        }

        return mdPaper

    }

}
