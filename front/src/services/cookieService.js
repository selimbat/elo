let get = (name) => {
  let dc = document.cookie;
  let prefix = name + "=";
  let begin = dc.indexOf("; " + prefix); // matches pattern where the cookies isn't the first one
  if (begin >= 0){
    begin += 2;
  }
  else {
    begin = dc.indexOf(prefix); // matches pattern where the cookies is the first one
    if (begin != 0) return null; // couldn't find the cookie
  }
  let end = document.cookie.indexOf(";", begin);
  if (end == -1) {
    end = dc.length;
  }
  // decodeURI to bring back all the special characters not allowed in cookies
  return JSON.parse(decodeURI(dc.substring(begin + prefix.length, end)));
};

let set = (name, value, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = `expires=${d.toUTCString()}`;
  // encodeURI to change the characters not allowed in cookies to allowed characters
  document.cookie = `${name}=${encodeURI(JSON.stringify(value))};${expires};path=/`;
};

exports.getSeenEncountersCookie = () => {
  return get("SEEN_ENCOUNTERS");
};

exports.setSeenEncountersCookie = (seenEncounterTracker) => {
  set("SEEN_ENCOUNTERS", seenEncounterTracker, 1);
};

exports.updateSeenEncountersCookie = (candidate1Id, candidate2Id, outcome) => {
  let seenEncountersCookie = exports.getSeenEncountersCookie();
  let encounterKey = `${candidate1Id}:${candidate2Id}`;
  if (!seenEncountersCookie) {
    // first time setting cookie
    seenEncountersCookie = {};
    seenEncountersCookie[encounterKey] = outcome;
  } else {
    if (seenEncountersCookie[encounterKey]) {
      seenEncountersCookie[encounterKey] = outcome;
    } else {
      encounterKey = `${candidate2Id}:${candidate1Id}`;
      if (seenEncountersCookie[encounterKey]) {
        seenEncountersCookie[encounterKey] = -outcome;
      } else {
        // never seen this encounter
        seenEncountersCookie[encounterKey] = -outcome;
      }
    }
  }
  exports.setSeenEncountersCookie(seenEncountersCookie);
}