const express = require('express');
const bodyParser = require('body-parser');
const { analyzeWordCategory } = require('./nodehun');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/analyzeWordsRegex', (req, res) => {
    analyzeWordCategory(req.body)
        .then(result => res.send(result));
});

app.listen(process.env['PORT'], () => console.log(`Started on ${process.env['PORT']}`));
