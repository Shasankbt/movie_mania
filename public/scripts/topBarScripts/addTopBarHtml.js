/*
    this adds the top bar to anypage with this
    Paste this in the html ~
        <script src="scripts/topBarScripts/addTopBarHtml.js"></script>
        <script>setUser("<%=user %>")</script>
        (   
            the functionalities are adding the following in the HTML:
            <script src="scripts/topBarScripts/topBar.js" type="module"></script>
        )
    ** make sure you have a div ~
        <div class = "top-bar" ></div>
        add a function in the HTML to define the username 
*/

topBarString = `
    <script src="https://kit.fontawesome.com/663c835d81.js" crossorigin="anonymous"></script>

    
    <div class="page-navigation-div">
        <p class="logo" data-href="/">FilmCritic</p>
        <button data-href="/">Top 100</button>
        <button data-href="/suggestions">For You</button>
    </div>


    <div class="search-div">
        <label for="search-input-id" class="search-label">
            <span class="material-symbols-outlined"><i class="fa-solid fa-magnifying-glass"></i></span>
        </label>
        <div class="search-bar-div">
            <input id="search-input-id" class="search-input" type="text" autocomplete="off">
            <div id="search-output-id" class="search-output"></div>
        </div>
        <button id="search-submit-button-id" class="search-submit-button">&#10148;</button>
    </div>

    <div class="user-div">
        <button class="user-button"><%=user%></button>
    </div>

    <div class="user-details">
        <p></p>
        <button id="logout-button-id"><span class="fa-solid fa-right-from-bracket"></span> <span style="opacity: 0.5;">&#x2022;</span> </button>
    </div>
`

// adding this to top bar 
document.querySelector(".top-bar").innerHTML = topBarString

function setUser(username){
    document.querySelector(".user-button").innerHTML = username
    document.querySelector(".user-details").children[0].innerHTML = '<span class="fa-solid fa-user"></span> <span style="opacity: 0.5;">&#x2022;</span>  ' + username
}