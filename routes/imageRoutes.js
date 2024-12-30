import express from "express";
import path from "path";
import axios from "axios";
import fs from "fs";

const router = express.Router();

router.post("/images_highres/:movieID", async (req, res) => {
    // console.log("Request for highres image for ", req.params.movieID);
    const movieID = req.params.movieID;
    const imageAddress = path.resolve(req.__dirname, req.highresImagesDir, movieID + ".jpg");

    if (!fs.existsSync(imageAddress)) {
        console.log("Highres image not found for ", movieID, ", fetching image from ", req.body.online_poster_url);
        try {
            const response = await axios.get(req.body.online_poster_url, { responseType: 'arraybuffer' });  
            fs.mkdirSync(path.resolve(req.__dirname, req.highresImagesDir), { recursive: true }); 
            fs.writeFileSync(imageAddress, response.data);
        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    }

    res.sendFile(imageAddress, (err) => {
        if (err) {
            console.log("error sending highres image for ", movieID, " : ", err);
            res.status(404).send(movieID + " : Image not found");
        }
    });
})

export default router;