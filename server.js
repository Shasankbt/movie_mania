// const fs = require('fs');
import fs from 'fs';
import express from "express";
import session from "express-session"
import { fileURLToPath } from 'url';
import path from 'path';

// const express = require('express')
// const session = require('express-session')
// ------------------------ data ---------------------------------
import dbConfig from './config/db.js';
const titles = JSON.parse(fs.readFileSync(dbConfig.titlesFile, 'utf8'));
const movieData = JSON.parse(fs.readFileSync(dbConfig.movieDataFile, 'utf8'));
const movieShortData = JSON.parse(fs.readFileSync(dbConfig.movieShortDataFile, 'utf8'));
const episodeData = JSON.parse(fs.readFileSync(dbConfig.episodeDataFile, 'utf8'));
const seriesData = JSON.parse(fs.readFileSync(dbConfig.seriesDataFile, 'utf8'));
const seriesShortData = JSON.parse(fs.readFileSync(dbConfig.seriesShortDataFile, 'utf8'));
const oscarLib = JSON.parse(fs.readFileSync(dbConfig.oscarLibFile, 'utf8'));

const userData = JSON.parse(fs.readFileSync(dbConfig.userDataFile, 'utf8'));
const userReviews = JSON.parse(fs.readFileSync(dbConfig.userReviewFile, 'utf8'));
const externalReviews = JSON.parse(fs.readFileSync(dbConfig.externalReviewFile, 'utf8'));

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.listen(4000)
console.log("Server started at port 4000")
app.use(express.urlencoded({ extended: true }))
app.set('view-engine','ejs')
app.use(session({
    secret: 'your-secret-key', // Secret key for session encryption
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'));
app.use(express.json());  //  This enables JSON body parsing
app.use('/images-highres', express.static(path.join(__dirname, dbConfig.highresImagesDir)));
app.use('/images-lowres', express.static(path.join(__dirname, dbConfig.lowresImagesDir)));
app.use('/snippets', express.static('snippets'));

app.use((req,res,next) => {
    req.dbConfig = dbConfig;
    req.titles = titles;
    req.movieData = movieData;
    req.movieShortData = movieShortData;
    req.seriesData = seriesData;
    req.seriesShortData = seriesShortData;
    req.episodeData = episodeData;
    req.oscarLib = oscarLib;
    req.userData = userData;
    req.userReviews = userReviews;
    req.externalReviews = externalReviews;
    req.snippetsDirectory = dbConfig.snippetsDirectory;
    req.__dirname = __dirname;
    req.highresImagesDir = dbConfig.highresImagesDir;
    req.lowresImagesDir = dbConfig.lowresImagesDir;
    next();
})
// ------------------------ main page routes ----------------------------
import homepageRoutes from './routes/homepageRoutes.js';
app.use('/', homepageRoutes);

import shortDataRoutes from './routes/shortDataRoutes.js';
app.use('/shortData/', shortDataRoutes);

import moviepageRoutes from './routes/moviepageRoutes.js';
app.use('/', moviepageRoutes);

import imageRoutes from './routes/imageRoutes.js';
app.use('/', imageRoutes);
// ------------------------ main page api ----------------------------
import moviePageApi from './api/moviepageApi.js';
app.use('/', moviePageApi);

import imagesApi from './api/imagesApi.js';
app.use('/images/', imagesApi);



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
    
    if( userData[req.body.name] === undefined){
        res.render('login.ejs', {nameErrorMsg : "no username found" , passwordErrorMsg : ""})
        return;
    }
    if( userData[req.body.name]["password"] != req.body.password){
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