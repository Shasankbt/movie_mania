import express from "express";

const router = express.Router();

router.get('/movie/:id', (req,res) =>{
    const currentUserName = req.session.userName || 'Guest';
    const id = req.params.id;

    if( req.userReviews[id] === undefined) req.userReviews[id] = {}    
    if( req.externalReviews[id] === undefined) req.externalReviews[id] = {}

    res.render('moviepage.ejs',{
        movieID : encodeURIComponent(id),
        movieData : encodeURIComponent(JSON.stringify(req.movieData[id])),
        user : encodeURIComponent(currentUserName),
        userReviewJson : encodeURIComponent(JSON.stringify(req.userReviews[id])),
        externalReviews : encodeURIComponent(JSON.stringify(req.externalReviews[id]))
     })
})

router.get('/series/:id', (req,res) =>{
    const currentUserName = req.session.userName || 'Guest';
    const id = req.params.id;

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

router.get('/series/:parent_id/episode/:episode_id', (req,res) =>{
    const currentUserName = req.session.userName || 'Guest';
    const id = req.params.episode_id;
    const parent_imdbID = req.params.parent_id

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


export default router;