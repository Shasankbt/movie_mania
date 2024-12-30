import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();
router.get('/', (req, res)=>{
    const parseDate = (dateStr) => {
        // Remove the country part and trim the string
        const cleanedDateStr = dateStr.split(' (')[0];
        return new Date(cleanedDateStr);
    };

    // console.time('recent Releases');
    const recentReleases = Object.values(req.movieData)
        .filter(movie => movie !== null)
        .sort((a, b) => parseDate(b.Released) - parseDate(a.Released))
        .slice(0, 10);
    // console.timeEnd('recent Releases');

    const currentUserName = req.session.userName || 'Guest';
    res.render("homepage.ejs", {
        user: currentUserName,
        recentReleases : encodeURIComponent(JSON.stringify(recentReleases)),
    })
})

router.post("/snippet_address", (req, res) => {
    const snippetAddress = fs.readFileSync(req.dbConfig.snippetsDirectory + "snippet_address.json", 'utf8');
    res.send(JSON.parse(snippetAddress));
})

router.post("/snippets/:snippetFileName", (req, res) => {
    console.log("snippet requested: ", req.params.snippetFileName);
    const snippetFilePath = path.resolve(req.__dirname, req.dbConfig.snippetsDirectory, req.params.snippetFileName);
    console.log("snippetFilePath: ", snippetFilePath);
    res.sendFile(snippetFilePath, (err) => {
        if (err) {
            console.log("error sending the video: ", err);
            res.status(404).send(req.params.snippetFileName + " : Snippet not found");
        } else {
            console.log("Snippet sent successfully");
        }
    });
})

export default router;