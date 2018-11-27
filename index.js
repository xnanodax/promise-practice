const https = require('https')

function getAllMoviesData(substr) {
  const titles = [];
  let pageIdx = 1;
  return new Promise((resolve, reject) => {
    
    const _getAllMoviesData = function (substr, pageIdx) {
      console.log("9", pageIdx)
      const url = `https://jsonmock.hackerrank.com/api/movies/search/?Title=${substr}&page=${pageIdx}`;
      let rawData = '';
      
      const getCallback = function(response) {
        response.on('data', function(data) {
          rawData += data;
        });
        
        response.on('end', function() {
          const parsedData = JSON.parse(rawData);
          const movies = parsedData.data;
          console.log("21", pageIdx)
          movies.forEach(movie => titles.push(movie.Title))
          
          if (pageIdx < parsedData.total_pages) {
            pageIdx += 1;
            _getAllMoviesData(substr, pageIdx);
            resolve(titles);
          }
        });
      }
      https.get(url, getCallback);
    }
    _getAllMoviesData(substr, pageIdx);
    return titles;
  });
};
getAllMoviesData('spiderman').then((result)=> console.log("Movie Titles: ", result));