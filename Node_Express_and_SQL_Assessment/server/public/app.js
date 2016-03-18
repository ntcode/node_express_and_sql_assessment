var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var randomNumber = require('./modules/random_number');

// bring in pg module
var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/zoo_animals';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/random_number', random_number);

// get data route
app.get('/zoo_animals', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM zoo_animals ORDER BY id DESC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // close connection
        query.on('end', function() {
            done();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

app.post('/zoo_animals', function(req, res) {
    var addAnimal = {
        animal: req.body.animal,
        animalCount: req.body.animalCount
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO employee (animal, animal_count) VALUES ($1, $2) RETURNING id",
            [addAnimal.animal, addAnimal.animalCount],
            function (err, result) {
                done();

                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });

});

app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});


app.set('port', process.env.PORT || 7000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});
