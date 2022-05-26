
const express = require('express')
const app = express()
const port = 3000

const bodyParser = require("body-parser");

const fs = require('fs');
const { exec } = require("child_process");

const path = './data/'
let hostIP = ''

// Get the local IP
exec("hostname -I", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    hostIP += stdout.trim();
});

app.use(bodyParser.urlencoded({ extended: true }));

// Get '/' -> reponse with public folder
app.use(express.static('public'));

app.post('/data', (req, res) => {
    let new_file = Date.now() + '.json';

    const username = process.env.SECRET_USERNAME;
    const password = process.env.SECRET_PASSWORD;
    const db = process.env.database;
    const db_uri = process.env.database_uri;

    let content = req.body;
    content.hostIP = hostIP;
    content.remoteIP = req.ip;

    console.log(content);
    fs.writeFile(path + new_file, JSON.stringify(content), (error) => {
        if(error)
            console.log('Error creating file');
    });
    res.send(`Muchas gracias por su participación. Username: ${username}, Password: ${password}, Database: ${db}, Datasbase uri: ${db_uri}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})