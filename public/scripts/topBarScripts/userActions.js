const userButton = document.querySelector(".user-button");  // user button on top-bar
const userDetailsDiv = document.querySelector(".user-details")  // one that pops when user button is pressed
const loginAndLogoutButton = document.getElementById("logout-button-id")

console.log('div' , userDetailsDiv)

userDetailsDiv.style.transition = "0.1s"

// initial conditions for userDiv
userDetailsDiv.style.display = "none"
userDetailsDiv.style.opacity = "0"

if(userButton.innerHTML == "Guest") loginAndLogoutButton.innerHTML += " Login"
else                                loginAndLogoutButton.innerHTML += " Logout"

export function openUserDetails(){
    userDetailsDiv.style.display = "block"
    setTimeout(function(){userDetailsDiv.style.opacity = "1"}, 10)
}
export function closeUserDetails(){
    userDetailsDiv.style.opacity = "0"
    setTimeout(function(){userDetailsDiv.style.display = "none"}, 100)
}

userButton.addEventListener("click" , ()=>{
    if(userDetailsDiv.style.display === "none") openUserDetails()
    else                                        closeUserDetails()
})

loginAndLogoutButton.addEventListener("click", () => {
    window.location.href = "/login"
})

