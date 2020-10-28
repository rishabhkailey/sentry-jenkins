const express = require('express');
var bodyParser = require("body-parser");
// const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://9e94fae3064e4c5c9d217a4cc47ed3ae@o409436.ingest.sentry.io/5281897' });

app.get('/', (req, res)=> {
    res.status(200).send("hello")
})

app.get('/getError', (req, res)=> {
    try {
        abc123.def();
    }
    catch(err) {
        Sentry.captureException(err);
        console.log('send to sentry', err);
    }
})

app.listen(port, () => {
    console.log('server is running on port' + port);
})
