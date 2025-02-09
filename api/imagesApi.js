import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/download", async (req, res) => {
    const onlineUrl = req.body.onlineUrl;
    console.log("downnloading at ", onlineUrl)
    const response = await fetch(onlineUrl);
    if (!response.ok) {
        console.error("Failed to download image from online URL");
        return res.status(response.status).json({ error: `Failed to download image: ${response.statusText}` });
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.promises.writeFile(path.resolve(req.__dirname, req.highresImagesDir, req.body.id + ".jpg"), buffer);
    fs.promises.writeFile(path.resolve(req.__dirname, req.lowresImagesDir, req.body.id + ".jpg"), buffer);
    console.log("downloaded image", req.body.id + ".jpg");
})

router.post("/highres", async (req, res) => {
    const imageAddress = path.resolve(req.__dirname, req.highresImagesDir, req.body.movieID + ".jpg");
    try {
        if (! fs.existsSync(imageAddress)) {
            const onlineUrl = req.body.onlineUrl;
            const response = await fetch(onlineUrl);
            if (!response.ok) {
                throw new Error("Failed to download image from online URL");
            }
            const buffer = await response.buffer();
            fs.writeFileSync(imageAddress, buffer);
        }
            res.sendFile(imageAddress);
        
    } catch (error) {
        res.status(500).json({ error: "An error occurred while retrieving the image" });
    }
})

router.post("/lowres", async (req, res) => {
    const imageAddress = path.resolve(req.__dirname, req.lowresImagesDir, req.body.movieID + ".jpg");
    try {
        if (! fs.existsSync(imageAddress)) {
            const onlineUrl = req.body.onlineUrl;
            const response = await fetch(onlineUrl);
            if (!response.ok) {
                throw new Error("Failed to download image from online URL");
            }
            const buffer = await response.buffer();
            fs.writeFileSync(imageAddress, buffer);
        }
            res.sendFile(imageAddress);
        
    } catch (error) {
        res.status(500).json({ error: "An error occurred while retrieving the image" });
    }
})

export default router;