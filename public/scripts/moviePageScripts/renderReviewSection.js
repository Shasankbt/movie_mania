let sum = 0
let count = 0

let userReviewed = false

function displayNewReviewForm(userName, movieName){
    
    const newReviewButton = document.querySelector(".new-review-button")
    const newReviewForm = document.querySelector(".new-review-form")

    newReviewButton.addEventListener("click", ()=>{
        if(userName === "Guest"){
            window.alert("login to write a review")
            return
        }
        if(newReviewForm.style.display === "none"){
            newReviewForm.style.display = "block"
            newReviewButton.innerHTML = "cancel"
        }
        else{
            newReviewForm.style.display = "none"
            if(userReviewed) newReviewButton.innerHTML = "rewrite"   
            else    newReviewButton.innerHTML = "write a review"
            
        }
    })
}

function createReviewCard(reviewer , rating , review){
    const reviewCardTemplate = document.querySelector("[review-card-template]")
    const card  =reviewCardTemplate.content.cloneNode(true).children[0]
    card.querySelector("[reviewer-name]").innerHTML = reviewer
    card.querySelector("[rating]").innerHTML = rating
    card.querySelector("[review]").innerHTML = review
    return card
}

function getMaxWordLength(sentence) {
    let words = sentence.split(" ");
    let maxLength = 0;

    for (let word of words) {
        if (word.length > maxLength) {
            maxLength = word.length;
        }
    }

    // Return the maximum length
    return maxLength;
}



function showReviews(userName , reviewObject){
    const reviewsDiv = document.querySelector(".reviews").querySelector(".contents")
    const reviewsGrid = document.querySelector(".review-grid")
    const newReviewButton = document.querySelector(".new-review-button")
    const userReviewStat = document.getElementById("user-review-stat")
    
    if(userName in reviewObject){
        userReviewStat.innerHTML = "You have already Reviewed to this movie"
        newReviewButton.innerHTML = "Rewrite"
        userReviewed = true
        reviewsDiv.insertBefore(createReviewCard(
            userName , reviewObject[userName]["rating"] + "/5" , reviewObject[userName]["review"]
        ), userReviewStat)
    }
    else{
        newReviewButton.innerHTML = "Give your thoughts on the movie"
        // userReviewStat.style.display= "inline-block"
        // userReviewStat.innerHTML = "You havent reviewed this movie yet, write yours here"
    }

    
    for(reviewer in reviewObject){
        sum += parseInt(reviewObject[reviewer]["rating"])
        count += 1
        if(reviewer != userName)
            reviewsGrid.appendChild(createReviewCard(
                "~ " + reviewer , reviewObject[reviewer]["rating"] + "/5" , reviewObject[reviewer]["review"]
            ))
    }
    if(Object.keys(reviewObject).length === +(userName in reviewObject))
        document.getElementById("otherusers-review-stat").style.display = "block"

}

function addExternalReviews(externalReviews){
    const featuredReviewPlaceholder = document.querySelector(".featured-review")
    const featuredReview = externalReviews["featured-review"]
    const reviewCardTemplate = document.querySelector("[review-card-template]")

    const card  =reviewCardTemplate.content.cloneNode(true).children[0]
    card.querySelector("[reviewer-name]").innerHTML = "~ " + featuredReview["reviewer"]
    card.querySelector("[rating]").innerHTML = featuredReview["tagline"]
    card.querySelector("[review]").innerHTML = featuredReview["review"]

    featuredReviewPlaceholder.appendChild(card)


    const externalCriticReviewGrid = document.querySelector(".external-critic-review-grid")
    
    const criticReviews = externalReviews["critic-reviews"]
    document.getElementById("critic-metascore-placeholder").innerHTML = criticReviews["score"]
    criticReviews["positive"].concat(criticReviews["mixed"]).concat(criticReviews["negative"]).forEach(review =>{
        const card  =reviewCardTemplate.content.cloneNode(true).children[0]
        card.querySelector("[reviewer-name]").innerHTML = "~ " + review["reviewer"]
        card.querySelector("[rating]").innerHTML = review["score"]
        card.querySelector("[review]").innerHTML = review["review"]
        if(getMaxWordLength(review["review"]) <= 25) externalCriticReviewGrid.appendChild(card)
    })

    const externalUserReviewGrid = document.querySelector(".external-user-review-grid")
    
    const userReviews = externalReviews["user-reviews"]
    document.getElementById("user-metascore-placeholder").innerHTML = userReviews["score"]
    userReviews["positive"].concat(userReviews["mixed"]).concat(userReviews["negative"]).forEach(review =>{
        const card  =reviewCardTemplate.content.cloneNode(true).children[0]
        card.querySelector("[reviewer-name]").innerHTML = "~ " + review["reviewer"]
        card.querySelector("[rating]").innerHTML = review["score"]
        card.querySelector("[review]").innerHTML = review["review"]
        if(getMaxWordLength(review["review"]) <= 25) externalUserReviewGrid.appendChild(card)
    })


}

// ---------------------------------------- FILTER OPTIONS -------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // setting up the internal reviews 
    if(document.getElementById("internal-rating"))
    document.getElementById("internal-rating").innerHTML = (count == 0) ? "<span style = 'opacity : 0.6'> no reviews yet</span>" : sum/count+ "/5";

    const toggleButtonff = document.querySelector(".toggle-filter")

    function conditionFunc1(filterValue, review){
        return (filterValue === review.querySelector("[rating]").innerHTML.charAt(0))
    }

    function conditionFunc2(filterValue, review){
        score = review.querySelector("[rating]").innerHTML
        if(filterValue === "positive") return (score > 60)
        else if(filterValue === "mixed") return (score > 30 && score <= 60)
        else return (score <= 30 )
    }

    function conditionFunc3(filterValue, review){
        score = review.querySelector("[rating]").innerHTML
        if(filterValue === "positive") return (score > 6)
        else if(filterValue === "mixed") return (score > 3 && score <= 6)
        else return (score <= 3)
    }

    function addFilterFunction(filterSection , allReviews, condition){
        const toggleButton = filterSection.querySelector(".toggle-filter")
        function manageFilter(){
            found = false
            // allReviews = document.querySelector(".review-grid").children
            

            
            for(const review of allReviews){review.style.display = "none"}

            filterSection.querySelectorAll(".filter-button").forEach(button => {
                if(button.classList.contains("enabled")){
                    const filterValue = button.getAttribute("data-filter-value") // button.getAttribute("data-filter-value")
                    toggleButton.classList.add("enabled") ; found = true
                    for(review of allReviews)
                        // if(button.innerHTML === review.querySelector("[rating]").innerHTML.charAt(0))
                        if(condition(filterValue,review))
                            review.style.display = "block"
                        
                    
                }
            })
            if(! found){
                toggleButton.classList.remove("enabled")
                for(review of allReviews){review.style.display = "block"}
            }
        }
    
        filterSection.querySelectorAll(".filter-button").forEach(button =>{
            button.addEventListener("click" , ()=>{
                button.classList.toggle("enabled")
                manageFilter()
            })    
        })
    
        
        toggleButton.addEventListener("click", (event)=>{
            toggleButton.classList.toggle("enabled")
            if(toggleButton.classList.contains("enabled")){
                filterSection.querySelectorAll(".filter-button").forEach(button => button.classList.add("enabled"))
            }
            else
                filterSection.querySelectorAll(".filter-button").forEach(button => button.classList.remove("enabled"))
    
            manageFilter()
        })
    }

    addFilterFunction(document.querySelectorAll(".filter-section")[0] ,document.querySelector(".review-grid").children, conditionFunc1)
    addFilterFunction(document.querySelectorAll(".filter-section")[1] ,document.querySelector(".external-critic-review-grid").children, conditionFunc2)
    addFilterFunction(document.querySelectorAll(".filter-section")[2] ,document.querySelector(".external-user-review-grid").children, conditionFunc3)

// ------------------------------------- MANAGING COMPACT SECTION -------------------------------------------
    
    function hideReviewContent(section, maxHeight){
        section.querySelector(".filter-mask").style.display = "block"
        const viewMoreButton = section.querySelector(".view-more-button")
        viewMoreButton.style.display = "block"
        viewMoreButton.style.position = "absolute"
        section.style.maxHeight = maxHeight;
        section.style.overflowY = "hidden"; // Set overflow-y to auto
        viewMoreButton.innerHTML = "show more"
    }

    function showReviewContent(reviewCard){
        reviewCard.querySelector(".filter-mask").style.display = "none"
        reviewCard.querySelector(".view-more-button").innerHTML = "show less"
        reviewCard.style.maxHeight = "none";
        reviewCard.style.overflowY = "visible"; // Set overflow-y to auto
    }

    function manageCompactSection(section, maxHeight){
        const viewMoreButton = section.querySelector(".view-more-button")
        const height = section.getBoundingClientRect().height;
        if (height > maxHeight) {
            hideReviewContent(section, maxHeight + "px")
        } else {
            section.querySelector(".filter-mask").style.display = "none"
            viewMoreButton.style.display = "none"
            section.style.maxHeight = "none";
            section.style.overflowY = "visible";
        }
        
    }

    function compactSectionEvents(section, maxHeight){
        const viewMoreButton = section.querySelector(".view-more-button")
        const height = section.getBoundingClientRect().height;
        viewMoreButton.addEventListener("click", () => {
            if(section.style.maxHeight === maxHeight + "px"){
                section.style.paddingBottom = 80 + parseInt(section.style.paddingBottom || 0) + "px";
                showReviewContent(section)
            }
            else{
                hideReviewContent(section, maxHeight + "px")
                section.style.paddingBottom = (parseInt(section.style.paddingBottom || 0) - 80) + "px";
            }
        })
        const filterSection = section.querySelector(".filter-section");
        if (filterSection) {
            filterSection.addEventListener("click", () => manageCompactSection(section, maxHeight));
        }
}

    const compactSections = document.querySelectorAll(".compact-section");
    compactSections.forEach(compactSection => {
        manageCompactSection(compactSection, 500)
        compactSectionEvents(compactSection, 500)
    }); 
    window.addEventListener("resize", () => {
        compactSections.forEach(compactSection => {
            manageCompactSection(compactSection, 500)
            compactSectionEvents(compactSection, 500)
        });
    });

})

