const https = require('https')

function getAllMoviesData(substr) {
  const titles = [];
  const pageIdx = 1;
  return new Promise((resolveOuter, rejectOuter) => {

    const _getAllMoviesData = function (substr, pageIdx) {
      return new Promise((resolveInner, rejectOuter) => {
        const url = `https://jsonmock.hackerrank.com/api/movies/search/?Title=${substr}&page=${pageIdx}`;
        let rawData = '';
        
        const getCallback = function(response) {
          response.on('data', data => rawData += data);
          
          response.on('end', () => {
            const parsedData = JSON.parse(rawData);
            const movies = parsedData.data;
            movies.forEach(movie => titles.push(movie.Title))
            
            if (pageIdx < parsedData.total_pages) {
              return _getAllMoviesData(substr, pageIdx + 1)
                .then(() => resolveInner(titles));
            } else {
              return resolveInner(titles);
            }

          });
        }
        
        https.get(url, getCallback);
      })
    }

    _getAllMoviesData(substr, pageIdx).then(result => resolveOuter(result));

  });
};
getAllMoviesData('spiderman').then((result)=> console.log("Movie Titles: ", result.length));