const inputArea = document.getElementById('input-area');
const submitButton = document.getElementById('submit-button');
const outputDiv = document.getElementById('output-div');

submitButton.addEventListener('click', onSubmitClick);

async function onSubmitClick() {
    const tokens = inputArea.value.split(/([\p{P}\p{Z}\s])/ug);
    const words = tokens.filter(token => token.match(/^\p{L}+$/u))
    const wordSet = new Set(words);

    const mappings = await analyzeWordsRegex([...wordSet]);
    const content = outputWords(tokens, mappings)
    const nodes = generateSpanNodes(content);

    setOutputDivChildren(nodes);
}

function outputWords(tokens, mappings, targetCategory = 'lietv') {
    let content = [{ text: '', type: null }];
    const wordMap = filterWordMapCategory(mappings, targetCategory);

    for (let token of tokens) {
        let type = (wordMap[token] && wordMap[token].length !== 0) ? targetCategory : null;

        const last = content.pop();
        const thingToAdd = { text: token, type };

        if (last.type == thingToAdd.type) {
            content.push({ ...last, text: last.text + thingToAdd.text });
        } else {
            content.push(last);
            content.push(thingToAdd);
        }
    }

    return content;
}

function generateSpanNodes(content) {
    return content.map(({ text, type }) => {
        const span = document.createElement('span');
        span.innerHTML = text;
        span.setAttribute("style", `color: ${type === null ? 'initial' : 'blue'};`);
        return span;
    });
}


function setOutputDivChildren(nodes) {
    outputDiv.innerHTML = '';
    nodes.forEach(node => outputDiv.append(node));
}


function filterWordMapCategory(wordMap, category) {
    //console.log(wordMap);
    const keyValuePairs = Object.entries(wordMap).map(([key, value]) => ([
        key,
        value.reduce((prev, curr) => curr.po && curr.po.match(category) ? prev + 1 : prev, 0)
    ]));

    // maybe add original length to "weigh" things in case there are multiple definitions
    return Object.fromEntries(keyValuePairs);
}

async function analyzeWordsRegex(body) {
    return await fetch('/analyzeWords', {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
}
