const { Nodehun } = require('nodehun');
const fs = require('fs');
const affix = fs.readFileSync('./files/lv_LV.aff');
const dictionary = fs.readFileSync('./files/lv_LV.dic');

const nodehun = new Nodehun(affix, dictionary);

async function analyzeWordCategory({ words, categoryRegex }) {
    const promises = words.map(async word => {
        const res = await getParsedWordAnalysis(word);
        const count = res.reduce((prev, { po }) => po.match(categoryRegex) ? prev + 1 : prev, 0);

        return [word, count];
    });

    return Object.fromEntries(await Promise.all(promises));
}

async function getParsedWordAnalysis(word) {
    const analysis = await nodehun.analyze(word);
    return analysis.map(a => parseWordAnalyisis(a));
}

function parseWordAnalyisis(analysis) {
    return Object.fromEntries(analysis.trim()
        .split(' ')
        .map(keyValuePair => keyValuePair.split(':')));
}

module.exports = {
    analyzeWordCategory
}

