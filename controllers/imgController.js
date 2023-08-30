'use strict';

const firebase = require("../db");
const Img = require("../models/img");
const firestore = firebase.firestore();
import axios from "axios";

async function shortenLink(link) {

    try {
        const response = await axios.get(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(link)}`);
        const { ok, result } = response.data;
        if (ok) {
            return result.full_short_link;
        } else {
            throw new Error('Failed to shorten link');
        }
    } catch (error) {
        throw new Error('Failed to shorten link');
    }
}


const addImg = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('imgs').doc().set(data);
        const shortenedLink = await shortenLink(data.src);
        data.shortenedLink = shortenedLink;
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllImgs = async (req, res, next) => {
    try {
        const imgs = await firestore.collection('imgs');
        const data = await imgs.get();
        const imgsArray = [];
        if (data.empty) {
            res.status(404).send('No imgs record found');
        } else {
            data.forEach(doc => {
                const img = new Img(
                    doc.id,
                    doc.src,
                    doc.alt
                );
                imgsArray.push(img);
            });
            res.send(imgsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getImg = async (req, res, next) => {
    try {
        const id = req.params.id;
        const img = await firestore.collection('imgs').doc(id);
        const data = await img.get();
        if (!data.exists) {
            res.status(404).send('img with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateImg = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const img = await firestore.collection('imgs').doc(id);
        await img.update(data);
        res.send('img record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteImg = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('imgs').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addImg,
    getAllImgs,
    updateImg,
    deleteImg,
    getImg,
}