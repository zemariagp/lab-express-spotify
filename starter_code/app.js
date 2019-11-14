require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });


// the routes go here:
app.get('/', (req, res, next) => {
  //res.send("hi");
  res.render(__dirname + '/views/');
})

app.get('/artists', (req, res) => {
  const searchQuery = req.query.search_query;
  //console.log(searchQuery);

  spotifyApi
    .searchArtists(searchQuery)
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('search-results.hbs', {
        artists: data.body.artists.items
      });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });


});
//----------------- search albums

app.get('/album', (req, res) => {
  const searchQuery = req.query.abc;
  console.log("hello :", searchQuery);

  spotifyApi
    .getArtistAlbums(searchQuery)
    .then(data => {
      // console.log('The received data from the API: ', data.body.items[0]);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('album-search-results.hbs', {
        albums: data.body.items
      });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });




});

app.get('/tracks', (req, res) => {
  const searchQuery = req.query.abc;
  console.log("hello :", searchQuery);

  spotifyApi
    .getAlbumTracks(searchQuery)
    .then(data => {
      console.log('The received data from the API: ', data.body.items[0]);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('album-search-results.hbs', {
        albums: data.body.items
      });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });




});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);