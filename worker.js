onmessage = function(e) {
    
    fetch("./inappropriateWords.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (words) {

    let result = false;
    for(word of words) {
      if (e.data.toLowerCase().includes(word.toLowerCase())) {
        result = true;
        break;
      }
    };
    postMessage(result);
  })
};

