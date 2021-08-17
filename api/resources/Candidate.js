export default class Candidate {
  constructor(id) {
    this.GetById(id);
  }

  GetById(id){
    let candidate = Candidate.placeholders.find(o => o.id == id);
    this.id = candidate.id;
    this.firstname = candidate.firstname;
    this.lastname = candidate.lastname;
    this.party = candidate.party;
    this.score = candidate.score;

    //TODO query db
    //this.score = ...
  }

  GetAll() {
    // TODO query db 
  }

  static placeholders = [
    {
      id: '1',
      firstname: "Michel",
      lastname: "Dupont",
      party: "parti A",
      score: 1200
    },
    {
      id: '2',
      firstname: "Martine",
      lastname: "Dubois",
      party: "parti B",
      score: -2105
    },
    {
      id: '3',
      firstname: "Mohamed",
      lastname: "Ben Barbour",
      party: "parti C",
      score: 230
    },
    {
      id: '4',
      firstname: "Jean",
      lastname: "Bonbeurre",
      party: "parti D",
      score: -1230
    },
    {
      id: '5',
      firstname: "Sami",
      lastname: "Ritte",
      party: "parti E",
      score: 5490
    },
  ];
}