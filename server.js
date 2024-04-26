const fs = require('fs')
const express = require('express')
const app = express()

let currentUserName = "Guest"

app.listen(4000)
app.use(express.urlencoded({ extended: true }))
app.set('view-engine','ejs')

app.use(express.static('public'))

// ------------------------ main pages ----------------------------
app.get('/' , (req,res) =>{
    res.render('home.ejs', {user : currentUserName})
})

app.get('/id=:id', (req,res) =>{
    const id = req.params.id;

    userReviews = JSON.parse(fs.readFileSync("userReviews.json"))
    if( userReviews[id] === undefined) userReviews[id] = {}

    externalReviews = JSON.parse(fs.readFileSync("extReviews.json"))
    if( externalReviews[id] === undefined) externalReviews[id] = {}
    res.render('moviepage.ejs',{
        movieName : id,
        user : currentUserName,
        userReviewJson : JSON.stringify(userReviews[id]),
        externalReviews : encodeURIComponent(JSON.stringify(externalReviews[id]))
     })
})

app.get('/register' , (req,res) =>{
    currentUserName = "Guest"
    res.render("register.ejs", { msg : ""})
})

app.get("/login", (req,res) =>{
    currentUserName = "Guest"
    console.log(currentUserName)
    res.render('login.ejs', {nameErrorMsg : "" , passwordErrorMsg : ""})
    //res.redirect("/recommendations")
})

app.get("/logout", (req,res) =>{
    currentUserName = "Guest"
    res.redirect("/")
})

app.get("/recommendations", (req, res) => {
    
    parsedUserData = JSON.parse(fs.readFileSync('user.json'))
    if(parsedUserData[currentUserName] === undefined) reviewedMovieNames = {}
    else reviewedMovieNames = parsedUserData[currentUserName]["moviesReviewed"]
    console.log(reviewedMovieNames["moviesReviewed"])
    res.render('recommendations.ejs', {user : currentUserName, reviewedMovieNames : JSON.stringify(reviewedMovieNames)})
})

// -------------------------------- verifying user details and valid login ----------------------

function userExists(userArray , name){
    const usernameExists = userArray.some(usrObj => usrObj.name === name)   
    return usernameExists;
}

function correctPasscode(userArray, name, password){
    const passwordMatch = userArray.some(user => user.name === name && user.password === password);
    return passwordMatch;
}

app.post('/register', (req,res)=>{
    const data = fs.readFileSync('user.json')
    let usersRegistered = JSON.parse(data)
    console.log(usersRegistered)

    if( usersRegistered[req.body.name] === undefined){
    //if(! userExists(usersRegistered , req.body.name)){
        const newUser = { "name" : req.body.name , "password" : req.body.password }
        usersRegistered.push(newUser)
        fs.writeFileSync('user.json' , JSON.stringify(usersRegistered))

        currentUserName = req.body.name
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

    currentUserName = req.body.name
    console.log("user logged in : " , currentUserName)
    //res.redirect('/');
    res.redirect("/recommendations")
})

// ------------------------- managing user ratings and reviews----------------------

app.post("/review", (req,res) => {
    const movieName = req.body.submitReview
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