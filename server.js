const fs = require('fs')
const express = require('express')
const session = require('express-session')
const app = express()

app.listen(4000)
app.use(express.urlencoded({ extended: true }))
app.set('view-engine','ejs')
app.use(session({
    secret: 'your-secret-key', // Secret key for session encryption
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'))

// ------------------------ main pages ----------------------------
app.get('/' , (req,res) =>{
    const currentUserName = req.session.userName || 'Guest';
    res.render('home.ejs', {user : currentUserName})
})

app.get('/test' , (req,res) =>{
    res.send("in the /test part")
})

app.get('/id=:id', (req,res) =>{
    const currentUserName = req.session.userName || 'Guest';
    const id = req.params.id;

    userReviews = JSON.parse(fs.readFileSync("userReviews.json"))
    if( userReviews[id] === undefined) userReviews[id] = {}

    externalReviews = JSON.parse(fs.readFileSync("metacriticReviews.json"))
    if( externalReviews[id] === undefined) externalReviews[id] = {}

    res.render('moviepage.ejs',{
        movieName : encodeURIComponent(id),
        user : encodeURIComponent(currentUserName),
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
    res.redirect("/id=" + movieName) 
    
})