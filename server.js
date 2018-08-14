var express = require('express');
var path = require('path')
var app = express();
var url = require('./datauser.js');
var MongoClient = require('mongodb').MongoClient;
var dbo;
app.use(express.static(path.join(__dirname, 'music-selector/build')));

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbo = db.db("music-selection");
    console.log('connected');
    let collection = dbo.collection('GradeU').find({}, ).toArray(function (err, result) {
        if (err) throw err;
    })
})
app.get('/api/pieces', (req, res) => { /* Fetching from database */
    var pieces;
    const param = req.query.grade;
    if (!param) {
        res.json({
            error: 'Missing required parameter q'
        });
        return
    }
    let collection = dbo.collection(`Grade${param}`).find({}, ).toArray(function (err, result) {
        pieces = result
        return res.send(pieces)
    })
});

/* Serve the webpack-bundled React app for the home page. */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/music-selector/build/index.html')); 
  });

app.listen(process.env.PORT || 3000, () => console.log('server is running'))