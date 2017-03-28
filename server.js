var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// returns all entries
app.get('/calorie-entries', function (req, res) {
    fs.readFile(__dirname + "/" + "calorie_entries.json", 'utf8', function (err, data) {
        res.end(data ? data : '[]');
    });
})

// returns one entry
app.get('/calorie-entries/:id', function (req, res) {
    fs.readFile(__dirname + "/" + "calorie_entries.json", 'utf8', function (err, data) {
        var idToGet = parseInt(req.params.id);
        var entries = JSON.parse(data);
        for (var i = 0; i < entries.length; i++) {
            var currentEntry = entries[i];
            
            if (parseInt(currentEntry.id) === idToGet) {
                res.end(JSON.stringify(currentEntry));
            }
        }
        return res.end('element does not exist');
    });
})

// creates new entry
app.put('/calorie-entries', function (req, res, next) {
    fs.readFile(__dirname + "/" + "calorie_entries.json", 'utf8', function (err, data) {
        // creates new entry
        var newEntry = {
            date: req.body.date,
            time: req.body.time,
            text: req.body.text,
            calories: req.body.calories,
        };
        
        var entries = JSON.parse(data ? data : '[]');
        var maxId = -1;
        for (var i = 0; i < entries.length; i++) {
            var currentId = parseInt(entries[i].id);
            maxId = currentId > maxId ? currentId : maxId;
        }
        
        newEntry.id = maxId + 1;
        entries.push(newEntry);
        app.writeEntriesAndReturn(entries, res, 'entry has been edited', 'error during saving entries');
    });
});

// edits existing entry
app.post('/calorie-entries/:id', function (req, res, next) {
    fs.readFile(__dirname + "/" + "calorie_entries.json", 'utf8', function (err, data) {
        var idToGet = parseInt(req.params.id);
        var entries = JSON.parse(data);
        
        for (var i = 0; i < entries.length; i++) {
            var currentEntry = entries[i];
            
            if (parseInt(currentEntry.id) === idToGet) {
                entries[i].date = req.body.date;
                entries[i].time = req.body.time;
                entries[i].text = req.body.text;
                entries[i].calories = req.body.calories;
                
                app.writeEntriesAndReturn(entries, res, 'entry has been edited', 'error during saving entries');
            }
        }
        return res.end('element does not exist');
    });
});

// deletes an entry
app.delete('/calorie-entries/:id', function (req, res) {
    fs.readFile(__dirname + "/" + "calorie_entries.json", 'utf8', function (err, data) {
        var idToRemove = parseInt(req.params.id);
        var entries = JSON.parse(data);
        for (var i = 0; i < entries.length; i++) {
            var currentEntry = entries[i];
            
            if (parseInt(currentEntry.id) === idToRemove) {
                entries.splice(i, 1);
                break;
            }
        }
        app.writeEntriesAndReturn(entries, res, 'entry has been deleted', 'error during saving entries');
    });
})

// gets user options
app.get('/options', function (req, res) {
    fs.readFile(__dirname + "/" + "options.json", 'utf8', function (err, data) {
        res.end(data);
    });
})

// sets a user option
app.post('/options/:name/:value', function (req, res, next) {
    fs.readFile(__dirname + "/" + "options.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        data[req.params.name] = req.params.value;
        data = JSON.stringify(data);
        fs.writeFile(__dirname + "/" + "options.json", data, function (err) {
            if (err) {
                return res.end('error during saving option:' + err);
            }
            res.end('option has been changed successfully');
        });
    });
});

// helper function to save calorie entries into the corresponding json file
app.writeEntriesAndReturn = function(entries, res, successMessage, errorMessage) {
    dataToWrite = JSON.stringify(entries);
    fs.writeFile(__dirname + "/" + "calorie_entries.json", dataToWrite, function (err) {
        if (err) {
            return res.end(errorMessage);
        } else if (successMessage) {
            return res.end(successMessage);
        }
    });
}

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server has been started');
})