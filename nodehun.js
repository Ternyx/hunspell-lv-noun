const { Nodehun } = require('nodehun');
const fs = require('fs');
const affix = fs.readFileSync('./files/lv_LV.aff');
const dictionary = fs.readFileSync('./files/lv_LV.dic');

const nodehun = new Nodehun(affix, dictionary);

async function analyzeWords(words) {
    const promises = words.map(async word => ([ word, await getParsedWordAnalysis(word) ]));
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
    analyzeWords
}

