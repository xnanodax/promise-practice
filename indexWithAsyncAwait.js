const https = require('https');

async function getAllMoviesData(substr) {
  const titles = [];
  const pageIdx = 1;
  const ajaxCall = async () => new Promise(resolveOuter => {

    const _getAllMoviesData = async (substr, pageIdx) => {
      return new Promise(resolveInner => {
        const url = `https://jsonmock.hackerrank.com/api/movies/search/?Title=${substr}&page=${pageIdx}`;
        let rawData = '';

        const getCallback = async function(response) {
          response.on('data', data => rawData += data);
          response.on('end', async () => {
            const parsedData = JSON.parse(rawData);
            const movies = parsedData.data;
            movies.forEach(movie => titles.push(movie.Title))
            
            if (pageIdx < parsedData.total_pages) {
              await _getAllMoviesData(substr, pageIdx + 1)
            }
            resolveInner(titles);
          });
        }
        
        https.get(url, getCallback);
      });
    };

    const result = _getAllMoviesData(substr, pageIdx);
    resolveOuter(result);
  });

  await ajaxCall();
  console.log(titles);
};

getAllMoviesData('spiderman');
