import express from "express";
import path from "path";

const router = express.Router();

router.post("/titles", (req, res) => {
    res.send(req.titles);
})

router.post("/movies-short", (req, res) => {
    res.send(req.movieShortData);
})

router.post("/series-short", (req, res) => {
    res.send(req.seriesShortData);
})

export default router;