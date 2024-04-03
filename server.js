const fs = require('fs')
const express = require('express')
const app = express()

let currentUserName = "Guest"

app.listen(4000)
app.use(express.urlencoded({ extended: true }))
app.set('view-engine','ejs')

app.use(express.static('public'))

app.get('/' , (req,res) =>{
    res.render('home.ejs', {user : currentUserName})
})

app.get('/id=:id', (req,res) =>{
    const id = req.params.id;
    res.render('moviepage.ejs',{name : id , user : currentUserName})
})


function userExists(userArray , name){
    const usernameExists = userArray.some(usrObj => usrObj.name === name)   
    return usernameExists;
}

function correctPasscode(userArray, name, password){
    const passwordMatch = userArray.some(user => user.name === name && user.password === password);
    return passwordMatch;
}

app.get('/register' , (req,res) =>{
    res.render("register.ejs", { msg : ""})
})

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

app.get("/login", (req,res) =>{
    res.render('login.ejs', {nameErrorMsg : "" , passwordErrorMsg : ""})
})

app.post("/login", (req,res) =>{
    const data = fs.readFileSync('user.json')
    let usersRegistered = JSON.parse(data)
    console.log(usersRegistered)

    console.log(req)
    console.log(req.body.name)

    if( ! userExists(usersRegistered, req.body.name)){
        res.render('login.ejs', {nameErrorMsg : "no username found" , passwordErrorMsg : ""})
        return;
    }

    if( ! correctPasscode(usersRegistered, req.body.name , req.body.password)){
        res.render('login.ejs', {nameErrorMsg : "" , passwordErrorMsg : "incorrect passcode"} )
        return;
    }

    currentUserName = req.body.name
    res.redirect('/');

})

app.post("/logout", (req,res) =>{
    currentUserName = "Guest"
    res.render('home.ejs', {user : currentUserName})
})