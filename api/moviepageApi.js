import express from "express";

const router = express.Router();

router.post("/getUserReviews", (req,res) =>{
    const id = req.body.id
    req.userReviews[id] = req.userReviews[id] || {}
    res.json(req.userReviews[id])
})

router.post("/getExternalReviews", (req,res) =>{
    console.log("getExternalReviews")
    const id = req.body.id
    req.externalReviews[id] = req.externalReviews[id] || {}
    res.json(req.externalReviews[id])
})

router.post("/getSimilarMovies", (req,res) =>{
    function getGenreDist(movie1, movie2){
        if(movie1 === null || movie2 === null) return 0
        const commonGenres = movie1.Genre.filter(element => movie2.Genre.includes(element))
        return commonGenres.length
    }

    const recommendationCount = req.body.recommendationCount   
    let sortedData;
    if(req.body.type == "movie"){
        sortedData = Object.values(req.movieData)
    } else if (req.body.type == "series"){
        sortedData = req.seriesData.filter(movie => movie !== null)
    }

    console.log(req.body.id)
    const currentMovie = sortedData.find(movie => movie.imdbID === req.body.id)    
    
    sortedData.sort((a,b) => b.imdbRating - a.imdbRating)
    sortedData.sort((a,b) => getGenreDist(b,currentMovie) - getGenreDist(a,currentMovie))
    sortedData = sortedData.slice(0, recommendationCount + 1) // +1 for compensating the current movie itself
    sortedData = sortedData.filter(movie => movie.imdbID !== req.body.id)
    res.json(sortedData)
})

export default router;