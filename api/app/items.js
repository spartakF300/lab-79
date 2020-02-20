const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const config = require('../config');
const nanoid = require("nanoid");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});
const routerItems =  (connection) => {

    router.get('/', async (req, res) => {
        console.log('hhh');
        const items = await connection.query('SELECT * FROM `items`');
        res.send(items)
    });

    router.get('/:id', async (req, res) => {
        console.log('id');
        const item = await connection.query('SELECT * FROM `items` WHERE `id` = ?', req.params.id);
        const itemElement = item[0];
        if (!itemElement){
            return   res.status(404).send({message:'not a found'})
        }
        res.send(item)
    });


    router.post('/', upload.single('image'), async (req, res) => {
        console.log(req.body);
        const items = req.body;
        if (req.file) {
            items.image = req.file.filename
        }

        if (!items.name || !items.categoryId || !items.locationId) {
            return res.status(404).send({message: 'Error'})
        } else {
            const item = await connection.query('INSERT INTO `items` (`categories_id`,`location_id`,`name`,`image`)'+
                'VALUES (?,?,?,?)',
                [items.categoryId ,items.locationId ,items.name,items.image]);
            res.send({id:item.insertId})
        }

    });
    router.delete('/:id', async (req, res) => {
        console.log('id');
       const item = await connection.query('DELETE FROM `items` WHERE `id` = ?', req.params.id);
        const itemElement = item[0];
        if (!itemElement){
            return   res.status(404).send({message:'not a found'})
        }
        res.send({message:'delete'})




    });
    return router
};
module.exports = routerItems;