const https = require('https');
const { JSDOM } = require('jsdom');
const URL = "https://fr.wikipedia.org/wiki/Candidats_%C3%A0_l'%C3%A9lection_pr%C3%A9sidentielle_fran%C3%A7aise_de_2022";

export default class CandidatesScrapperService {
  constructor() { }

  getCandidatesFromWikipedia() {
    return this.#getPage(URL, this.#formatPage);
  }

  #formatPage = (data) => {
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
      candidate.imgUrlTemp = "https://commons.wikimedia.org" + el.children[i].children[1].children[0].href.replace("Fichier",'File');

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
    return candidates;
  }

  #getPage = async (url, callback) => {
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
          reject("Error: " + error.message);
        });
    })
  }
}
