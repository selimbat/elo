const https = require('https');
const { JSDOM } = require('jsdom');
var fs = require('fs');
const { resolve } = require('path');
const SOURCE_URL = "https://fr.wikipedia.org/wiki/Candidats_%C3%A0_l'%C3%A9lection_pr%C3%A9sidentielle_fran%C3%A7aise_de_2022";

exports.getCandidates = async () => {
  console.log("Fetching candidates from the internet.");
  return await getPage(SOURCE_URL, formatPage);
};

formatPage = async (data) => {
  let candidates = [];
  let doc = new JSDOM(data);
  let el = doc.window.document.querySelector("#mw-content-text > .mw-parser-output > table.wikitable > tbody");
  for(let i = 1; i < el.children.length; i++){
    let candidate = {};
    let nameNode = el.children[i].children[0].children[0].children[0];
    candidate.name = nameNode.textContent;
    candidate.wikipediaUrl = "https://www.wikipedia.org" + nameNode.href;
    let ageStr = el.children[i].children[0].textContent;
    candidate.age = Number(ageStr.substring(ageStr.indexOf("(") + 1, ageStr.indexOf("ans)")));
    let partyNode = el.children[i].children[0].children[2];
    candidate.party = {
      name: partyNode.firstChild?.textContent ?? partyNode.textContent,
      wikipediaUrl: partyNode.firstChild ? "https://www.wikipedia.org" + partyNode.firstChild.href : '',
    };
    const tempImgUrl = "https://commons.wikimedia.org" + el.children[i].children[1].children[0].href.replace("Fichier",'File');
    candidate.imgUrl = await getPage(tempImgUrl, getImgUrlFromFilePage);

    let occupationsStr = el.children[i].children[3].textContent.replace("\n", "");
    let occupations = [];
    if (occupationsStr !== "Aucune"){
      occupationsStr.split(')').forEach(occ => {
        if (occ === '') return;
        occupations.push({
          label: occ.substring(0, occ.indexOf('(')),
          since: Number(occ.substring(occ.indexOf('(depuis') + 7))
        });
      });
    };
    candidate.occupations = occupations;
    candidate.description = el.children[i].children[4].textContent.replace(/\[\d+\]/g, "").replace(/\s+/g, " ");
    
    candidates.push(candidate);
  }
  await downloadImages(candidates);
  return candidates;
};

getImgUrlFromFilePage = (data) => {
  let doc = new JSDOM(data);
  let el = doc.window.document.querySelector("#file > a");
  return el.href;
};

downloadImages = async (candidates) => {
  console.log("Downloading candidates images from the internet.")
  return new Promise(async (resolve, reject) => {
    try {
      await Promise.all(candidates.map(async c => {
        let filename = `./public/img/${c.name.toLowerCase().replace(/\s+/g, "_")}.jpg`;
        await downloadImage(c.imgUrl, filename);
        c.imgUrl = filename; // change the link to the downloaded file
      }))
      console.log("Successfully downloaded candidates images.");
      resolve();
    } catch (err) {
      console.log(`Failed to download images : ${err}`);
      reject(err);
    }
  })
}

downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0", //necessary to avoid 403 from Wikipedia
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', resolve);
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(new Error(`Request for ${url} Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
}
// https.get promise wrapper
getPage = async (url, callback) => {
  return new Promise((resolve, reject) => {
      https.get(url, res => {
        let data = '';
        res.on('data', chunk => { 
          data += chunk;
        }) 

        res.on('end', () => {
          resolve(callback(data));
        })
      }).on("error", (error) => {
        console.log("Error: " + error.message);
        reject();
      });
  })
};