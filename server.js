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
    movieReviews = JSON.parse(fs.readFileSync("movieReviews.json"))
    if( movieReviews[id] === undefined) movieReviews[id] = {}
    res.render('moviepage.ejs',{movieName : id , user : currentUserName, movieReviewJson : JSON.stringify(movieReviews[id]) })
})

app.get('/register' , (req,res) =>{
    currentUserName = "Guest"
    res.render("register.ejs", { msg : ""})
})

app.get("/login", (req,res) =>{
    currentUserName = "Guest"
    console.log(currentUserName)
    res.render('login.ejs', {nameErrorMsg : "" , passwordErrorMsg : ""})
})

app.get("/logout", (req,res) =>{
    currentUserName = "Guest"
    res.redirect("/")
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

    if(! userExists(usersRegistered , req.body.name)){
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
    

    if( ! userExists(usersRegistered, req.body.name)){
        res.render('login.ejs', {nameErrorMsg : "no username found" , passwordErrorMsg : ""})
        return;
    }

    if( ! correctPasscode(usersRegistered, req.body.name , req.body.password)){
        res.render('login.ejs', {nameErrorMsg : "" , passwordErrorMsg : "incorrect passcode"} )
        return;
    }

    currentUserName = req.body.name
    console.log("user logged in : " , currentUserName)
    res.redirect('/');

})

// ------------------------- managing user ratings and reviews----------------------

app.post("/review", (req,res) => {
    const movieName = req.body.submitReview
    const review = req.body.review
    const rating = req.body.rating

    const movieReviews = JSON.parse(fs.readFileSync("movieReviews.json"))
    
    

    if(movieReviews[movieName] === undefined) movieReviews[movieName] = {}
    movieReviews[movieName][currentUserName] = {
        "review" : review,
        "rating" : rating,
    }

    fs.writeFileSync("movieReviews.json" , JSON.stringify(movieReviews))
    
    res.redirect("/id=" + movieName) 
    
})