require("dotenv").config();
var fs = require("fs");
var request = require("request");
var Twitter = require('Twitter');
var Spotify = require('node-spotify-api');


//import key.js and store it in a variable
let apiKeys = require("./keys.js");

//Access API information 
var client = new Twitter(apiKeys.twitter);
var spotify = new Spotify(apiKeys.spotify);
let command = process.argv[2];
let songName = '';
let nodeArgs = process.argv;
let movieName = '';


if (!nodeArgs[3]) {
    songName = "The Sign";
    movieName = 'Mr.Nobody';
} else {
    for (i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            songName = songName + "+" + nodeArgs[i];
            movieName = movieName + '+' + nodeArgs[i];

        } else {
            songName += nodeArgs[i];
            movieName += nodeArgs[i];
        }
    }
}

var params = {
    screen_name: 'ATwitBot1',
    count: 20
}

getSomeInfo(command, process.argv[3]);

function getSomeInfo(command, searchItem){
switch (command) {
    case 'my-tweets':
        {
            showMeTwits();
            break;
        }
    case 'spotify-this-song':
        {
            thisSong(searchItem);
            break;
        }
    case 'movie-this':
        {
            movieInfo();
            break;
        }
    case 'do-what-it-says':
        {
            text();
            break;
        }
    default:
        console.log('Invalid request');
        break;
}
}
function showMeTwits() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) throw error;
        console.log('Here are your most recent tweets(A max of 20 tweets visible):');
        for (i = 0; i < tweets.length; i++) {
            console.log([i+1]+'.' + tweets[i].text);
        }
    })
}

function thisSong(songName) {
    if(!nodeArgs[3]){
    songName = "The Sign";
    }

    spotify.search({
        type: 'track',
        query: songName,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log('Artist: ' + data.tracks.items[0].artists[0].name);
        console.log('Song Name: ' + data.tracks.items[0].name);
        console.log('Preview Link: ' + data.tracks.items[0].preview_url);
        console.log('This song is from an album called ' + data.tracks.items[0].album.name);

    });
}

function movieInfo(){
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body){
        if (!error && response.statusCode === 200) {
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("Rated: " + JSON.parse(body).Rated);
            console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Source[1]);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
          }
    })
}

function text(){
    fs.readFile("random.txt", "utf8", function(err, data) {
        var output = data.split(",");
        console.log(output);
        command === output[0];
        songName === output[1];
    });
    getSomeInfo(command,songName);
}

