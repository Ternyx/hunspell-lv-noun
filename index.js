const express = require('express');
const bodyParser = require('body-parser');
const { analyzeWords } = require('./nodehun');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/analyzeWords', (req, res) => {
    analyzeWords(req.body)
        .then(result => res.json(result));
});

app.listen(process.env['PORT'], () => console.log(`Started on ${process.env['PORT']}`));
