const Request = require('request');
const path = require('path');
const fs = require('fs-extra');
const RandExp = require('randexp');
const mime = require('mime');

let downloadFiles = 0;
let missedFiles = 0;

crawlAndDownload(1000000);

function crawlAndDownload(time) {
    let alreadyChecked = [];
    let toDownload = "";

    let downloader = setInterval(() => {
        do {
            toDownload = `https://dl.reseau-ges.fr/private/1973Lwmzzjna-Sp9W5gzM${new RandExp(/[\w-]{11}/).gen()}x_KvxH9QFt4`;
        } while(alreadyChecked.indexOf(toDownload) > -1);

        alreadyChecked.push(alreadyChecked);
        download(toDownload);
    }, 300);

    setTimeout(() => {
        clearInterval(downloader);
        console.log(`\n__________________MyGES Document Crawler Diagnostic____________________`);
        console.log(`\x1b[32mFichiers téléchargés\x1b[0m: ${downloadFiles}`);
        console.log(`\x1b[31mFichiers non trouvés\x1b[0m: ${missedFiles}`);
        console.log(`_______________________________________________________________________\n`);
    }, time + 100);
}

function download(url) {
    let req = Request({
        method: 'GET',
        url: url,
        headers: {
            'Cookie': 'JSESSIONID=1708BF5F4A519D66BEBC7687967E56B2'
        }
    });

    let filepath = path.resolve(`./files/${new RegExp(/^.*\/(.*(\.?.*?)?)$/i).exec(url)[1]}`);

    req.on('response', function (data) {
        let total = parseInt(data.headers['content-length']);
        let received = 0;

        if (data.statusCode == 404 || data.statusCode == 500) {
            console.log(`\x1b[31mFichier non trouvé : ${url}!\x1b[0m`);
            missedFiles++;
            return req.abort();
        } else if (total == "6266") {
            console.log(`\x1b[31mChangement de JSESSIONID nécéssaire!\x1b[0m`);
            missedFiles++;
            return req.abort();
        } else {
            let out = fs.createWriteStream(`${filepath}.${mime.getExtension(data.headers['content-type'])}`);
            req.pipe(out);

            req.on('data', function (chunk) {
                received += chunk.length;
            });

            req.on('end', function () {
                console.log(`\x1b[32mFichier téléchargé : ${url}!\x1b[0m`);
                downloadFiles++;
            });
        }
    });
}
