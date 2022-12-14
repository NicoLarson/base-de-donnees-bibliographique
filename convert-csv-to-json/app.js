/* Reading the file and storing it in a variable. */
const dataCsvInput = require("fs").readFileSync("./input/Ma bibliothèque.csv", "utf8")
/* Splitting the dataCsvInput variable into an array of lines. */
const lineBreak = dataCsvInput.split("\n")

// Extraction des titres
let header = lineBreak[0].split("\"")

/* A function that returns a string that is not a comma. */
const haveCommas = (str) => {
    return str != ','
}
header = header.filter(haveCommas)
header.shift()
header.pop()

/* Replacing spaces with underscores. */
for (let i = 0; i < header.length; i++) {
    header[i] = header[i].toLocaleLowerCase()
    for (let j = 0; j < header[i].length; j++) {
        if (header[i][j] == ' ') {
            header[i] = header[i].replace(' ', '_')
        }
    }
}
// Traitement des données
let data = []

/* Creating an object for each line of the CSV file. */
for (let i = 1; i < lineBreak.length; i++) {
    let ligne = lineBreak[i].split("\"")
    ligne = ligne.filter(haveCommas)
    ligne.shift()
    ligne.pop()
    let document = new Object()
    /* A loop that iterates over the array of lines. */
    for (let j = 0; j < ligne.length; j++) {
        if (header[j] == 'key' || header[j] == 'item_type' || header[j] == 'publication_year' || header[j] == 'author' || header[j] == 'title' || header[j] == 'publication_title' || header[j] == 'issn' || header[j] == 'doi' || header[j] == 'url' || header[j] == 'abstract_note' || header[j] == 'date_added' || header[j] == 'date_modified' || header[j] == 'pages' || header[j] == 'language' || header[j] == 'automatic_tags') {
            // Traitement auteurs
            if (header[j] == 'author') {
                let arrayOfAuthors = []
                ligne[j] = ligne[j].split(";")
                /* It removes spaces from the array. */
                for (let k = 0; k < ligne[j].length; k++) {
                    if (ligne[j][k].includes(' ')) {
                        ligne[j][k] = ligne[j][k].replace(' ', '')
                    }
                }
                // Array of authors in string clean
                /* A loop that iterates over the array of lines. */
                for (let k = 0; k < ligne[j].length; k++) {
                    let author = new Object()
                    ligne[j][k] = ligne[j][k].split(',')
                    author.firstName = ligne[j][k][0]
                    author.lastName = ligne[j][k][1]
                    arrayOfAuthors.push(author)
                }
                ligne[j] = arrayOfAuthors
            }
            // Traitement des tags
            if (header[j] == 'automatic_tags') {
                ligne[j] = ligne[j].split(';')
                /* It removes spaces from the array. */
                for (let k = 0; k < ligne[j].length; k++) {
                    if (ligne[j][k].includes(' ')) {
                        ligne[j][k] = ligne[j][k].replace(' ', '')
                    }
                }
            }
            document[header[j]] = ligne[j]
            data.push(document)
        }
    }
}

// Clean duplicate items by title
/* It removes duplicate items by title. */
const uniqueDocument = Array.from(new Set(data.map(document => document.title)))
    .map(title => {
        return data.find(document => document.title === title)
    })

// Create JSON file

const date = new Date();
let month = date.getMonth() + 1
let fileName = 'db' + date.getFullYear() + month + date.getDate() + date.getHours() + date.getMinutes() + '.json'
const documents = { documents: uniqueDocument }
let datas = JSON.stringify(documents)
require("fs").writeFileSync(`./output/${fileName}`, datas)