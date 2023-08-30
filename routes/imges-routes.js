const express = require('express')
const { addImg,
    getAllImgs,
    updateImg,
    deleteImg,
    getImg } = require('../controllers/imgController')


const router = express.Router();

router.post('/img', addImg);
router.get('/imgs', getAllImgs);
router.get('/img/:id', getImg);
router.put('/img/:id', updateImg);
router.delete('/img/:id', deleteImg);

module.exports = {
    routes: router
}