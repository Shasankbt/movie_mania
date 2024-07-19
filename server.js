// const fs = require('fs');
import fs from 'fs';
import express from "express";
import session from "express-session"

// const express = require('express')
// const session = require('express-session')
const app = express()

app.listen(4000)
app.use(express.urlencoded({ extended: true }))
app.set('view-engine','ejs')
app.use(session({
    secret: 'your-secret-key', // Secret key for session encryption
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'));

app.use('/snippets', express.static('snippets'));
// ------------------------ data ---------------------------------
const movieData = JSON.parse(fs.readFileSync('basic_data/movies.json', 'utf8'));
const episodeData = JSON.parse(fs.readFileSync('basic_data/episodes.json', 'utf8'));
const seriesData = JSON.parse(fs.readFileSync('basic_data/series.json', 'utf8'));
// ------------------------ main pages ----------------------------
app.get('/', (req, res)=>{
    const parseDate = (dateStr) => {
        // Remove the country part and trim the string
        const cleanedDateStr = dateStr.split(' (')[0];
        return new Date(cleanedDateStr);
    };

    console.time('recent Releases');
    const recentReleases = Object.values(movieData)
        .filter(movie => movie !== null)
        .sort((a, b) => parseDate(b.Released) - parseDate(a.Released))
        .slice(0, 10);
    console.timeEnd('recent Releases');

    
    const currentUserName = req.session.userName || 'Guest';
    res.render("homepage.ejs", {
        user: currentUserName,
        recentReleases : encodeURIComponent(JSON.stringify(recentReleases))
    })
})
app.get('/top100movies' , (req,res) =>{
    const top100 =  Object.values(movieData).filter(movie => movie !== null).sort( (movie1, movie2) => {return movie2.imdbRating - movie1.imdbRating})
    const currentUserName = req.session.userName || 'Guest';
    res.render('top100.ejs', {
        user : currentUserName,
        top100movies : encodeURIComponent(JSON.stringify(top100.slice(0,100)))
    })
})
app.get('/top100tvseries' , (req,res) =>{
    const top100 =  Object.values(seriesData).filter(movie => movie !== null).sort( (movie1, movie2) => {return movie2.imdbRating - movie1.imdbRating})
    const currentUserName = req.session.userName || 'Guest';
    res.render('top100.ejs', {
        user : currentUserName,
        top100movies : encodeURIComponent(JSON.stringify(top100.slice(0,100)))
    })
})

app.get('/movie/:id', (req,res) =>{
    const currentUserName = req.session.userName || 'Guest';
    const id = req.params.id;

    const userReviews = JSON.parse(fs.readFileSync("userReviews.json"))
    if( userReviews[id] === undefined) userReviews[id] = {}

    const externalReviews = JSON.parse(fs.readFileSync("metacriticReviews.json"))
    if( externalReviews[id] === undefined) externalReviews[id] = {}

    res.render('moviepage.ejs',{
        movieID : encodeURIComponent(id),
        movieData : encodeURIComponent(JSON.stringify(movieData[id])),
        user : encodeURIComponent(currentUserName),
        userReviewJson : encodeURIComponent(JSON.stringify(userReviews[id])),
        externalReviews : encodeURIComponent(JSON.stringify(externalReviews[id]))
     })
})

app.get('/series/:id', (req,res) =>{
    const currentUserName = req.session.userName || 'Guest';
    const id = req.params.id;

    const userReviews = JSON.parse(fs.readFileSync("userReviews.json"))
    if( userReviews[id] === undefined) userReviews[id] = {}

    const externalReviews = JSON.parse(fs.readFileSync("metacriticReviews.json"))
    if( externalReviews[id] === undefined) externalReviews[id] = {}

    let localEpisodeData = {}
    Object.values(seriesData[id]["Episodes"]).forEach(season_object => {
        Object.values(season_object).forEach(episode_id => {
            localEpisodeData[episode_id] = episodeData[episode_id]
        })
    })

    res.render('seriespage.ejs',{
        movieName : encodeURIComponent(id),
        user : encodeURIComponent(currentUserName),
        seriesData : encodeURIComponent(JSON.stringify(seriesData)),
        episodeData : encodeURIComponent(JSON.stringify(localEpisodeData)), 
        userReviewJson : encodeURIComponent(JSON.stringify(userReviews[id])),
        externalReviews : encodeURIComponent(JSON.stringify(externalReviews[id]))
     })
})

app.get('/series/:parent_id/episode/:episode_id', (req,res) =>{
    const currentUserName = req.session.userName || 'Guest';
    const id = req.params.episode_id;
    const parent_imdbID = req.params.parent_id

    let userReviews = JSON.parse(fs.readFileSync("userReviews.json"))
    if( userReviews[id] === undefined) userReviews[id] = {}

    let externalReviews = JSON.parse(fs.readFileSync("metacriticReviews.json"))
    if( externalReviews[id] === undefined) externalReviews[id] = {}


    let localEpisodeData = {}
    Object.values(seriesData[parent_imdbID]["Episodes"]).forEach(season_object => {
        Object.values(season_object).forEach(episode_id => {
            localEpisodeData[episode_id] = episodeData[episode_id]
        })
    })
    localEpisodeData[id]["Poster"] = seriesData[parent_imdbID]["Poster"]
    res.render('episodePage.ejs',{
        movieName : encodeURIComponent(id),
        user : encodeURIComponent(currentUserName),
        episodeList : encodeURIComponent(JSON.stringify(seriesData[parent_imdbID])),
        episodeData : encodeURIComponent(JSON.stringify(localEpisodeData)),
        userReviewJson : encodeURIComponent(JSON.stringify(userReviews[id])),
        externalReviews : encodeURIComponent(JSON.stringify(externalReviews[id]))
     })
})

app.get('/register' , (req,res) =>{
    req.session.userName = "Guest"
    res.render("register.ejs", { msg : ""})
})

app.get("/login", (req,res) =>{
    req.session.userName = "Guest"
    res.render('login.ejs', {nameErrorMsg : "" , passwordErrorMsg : ""})
    //res.redirect("/recommendations")
})

app.get("/logout", (req,res) =>{
    req.session.userName = "Guest"
    res.redirect("/")
})

app.get("/suggestions", (req, res) => {
    const currentUserName = req.session.userName || 'Guest';
    parsedUserData = JSON.parse(fs.readFileSync('user.json'))
    if(parsedUserData[currentUserName] === undefined) reviewedMovieNames = {}
    else reviewedMovieNames = parsedUserData[currentUserName]["moviesReviewed"]
    res.render('suggestionsPage.ejs', {user : currentUserName, reviewedMovieNames : encodeURIComponent(JSON.stringify(reviewedMovieNames))})
})

app.get("/academy-awards", (req, res) => {
    const oscarLib = JSON.parse(fs.readFileSync("basic_data/oscar_lib.json"))
    let oscarMovieData = {}
    const currentUserName = req.session.userName || 'Guest';
    Object.values(oscarLib).forEach(oscarAward => {
        Object.keys(oscarAward).forEach(imdbID =>{
            oscarMovieData[imdbID] = movieData[imdbID]
        })
    })
    res.render("academyAwards.ejs", {
        user : currentUserName,
        oscarLib : encodeURIComponent(JSON.stringify(oscarLib)),
        oscarData : encodeURIComponent(JSON.stringify(oscarMovieData))
    })
})

// -------------------------------- verifying user details and valid login ----------------------
app.post('/register', (req,res)=>{
    const data = fs.readFileSync('user.json')
    let usersRegistered = JSON.parse(data)

    if( usersRegistered[req.body.name] === undefined){
        usersRegistered[req.body.name] = {
            "password" : req.body.password,
            "moviesReviewed": {}
        }
        fs.writeFileSync('user.json' , JSON.stringify(usersRegistered))
        req.session.userName = req.body.name
        res.redirect('/')
    }
    else{
        const errorMessage = "Username is already taken. Please choose another one."
        res.render('register.ejs', { msg : errorMessage })
    }
})  
app.post("/login", (req,res) =>{
    const data = fs.readFileSync('user.json')
    let usersRegistered = JSON.parse(data)
    
    if( usersRegistered[req.body.name] === undefined){
        res.render('login.ejs', {nameErrorMsg : "no username found" , passwordErrorMsg : ""})
        return;
    }
    if( usersRegistered[req.body.name]["password"] != req.body.password){
        res.render('login.ejs', {nameErrorMsg : "" , passwordErrorMsg : "incorrect passcode"} )
        return;
    }
    req.session.userName = req.body.name
    console.log("user logged in : " , req.session.userName)
    res.redirect('/');
})

// ------------------------- managing user ratings and reviews----------------------

app.post("/review", (req,res) => {
    const currentUserName = req.session.userName;
    const movieName = decodeURIComponent(req.body.submitReview)
    const review = req.body.review
    const rating = req.body.rating

    const userReviews = JSON.parse(fs.readFileSync("userReviews.json"))
    const userData = JSON.parse(fs.readFileSync("user.json"))
    

    if(userReviews[movieName] === undefined) userReviews[movieName] = {}
    userReviews[movieName][currentUserName] = {
        "review" : review,
        "rating" : rating,
    }
    if(userData[currentUserName]["moviesReviewed"] === undefined) userData[currentUserName]["moviesReviewed"] = {}
    userData[currentUserName]["moviesReviewed"][movieName] = rating

    fs.writeFileSync("userReviews.json" , JSON.stringify(userReviews))
    fs.writeFileSync("user.json", JSON.stringify(userData))
    //res.redirect(req.get('referer')) 
    res
    
})