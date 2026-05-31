const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('India_Tourism_Destination_Database.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('pdf-text.txt', data.text);
    console.log("PDF parsed successfully");
});
