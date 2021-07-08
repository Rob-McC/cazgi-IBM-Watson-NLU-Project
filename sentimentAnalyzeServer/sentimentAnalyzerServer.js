const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
const nlu = getNLUInstance();
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    console.log(req.query.text);
    //const nlu = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
            'emotion': true,
            'limit': 1,
            },
            'keywords': {
            'emotion': true,
            'limit': 1,
            },
        },
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
           return res.send(JSON.stringify(analysisResults.result.entities[0].emotion, null, "\n"));
        })
        .catch(err => {
           return res.send('error:', err);
        });
    return ;
});

app.get("/url/sentiment", (req,res) => {
    console.log(req.query.url);
    //const nlu = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
            'features': {
                'entities': {
                'sentiment': true,
                'limit': 1
                }
        }
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log("sentiment");
           return res.send(JSON.stringify(analysisResults.result.entities[0].sentiment, null, 2));
        })
        .catch(err => {
           return res.send('error:', err);
        });
    //return res.send("url sentiment for "+req.query.url);
    return ;
});

app.get("/text/emotion", (req,res) => {
    console.log(req.query.text);
    //const nlu = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
            'emotion': true,
            'limit': 1,
            },
            'keywords': {
            'emotion': true,
            'limit': 1,
            },
        },
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
           return res.send(JSON.stringify(analysisResults.result.entities[0], null, 2));
        })
        .catch(err => {
           return res.send('error:', err);
        });
    return;//return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    console.log(req.query.text);
    //const nlu = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
            'sentiment': true,
            'limit': 1,
            },
            'keywords': {
            'sentiment': true,
            'limit': 1,
            },
        },
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
           return res.send(JSON.stringify(analysisResults.result.entities[0], null, 2));
        })
        .catch(err => {
           return res.send('error:', err);
        });
    return;//return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})