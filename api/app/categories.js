const express = require('express');
const router = express.Router();
const routerCategories =  (connection) => {

    router.get('/', async (req, res) => {

        const items = await connection.query('SELECT * FROM `categories`');
        res.send(items)
    });

    router.get('/:id', async (req, res) => {

        const item = await connection.query('SELECT * FROM `categories` WHERE `id` = ?', req.params.id);
        const itemElement = item[0];
        if (!itemElement){
          return   res.status(404).send({message:'not a found'})
        }
        res.send(item)
    });


    router.post('/', async (req, res) => {

        const category = req.body;
        if (!category.name) {
            return res.status(404).send({message: 'Error'})
        } else {
            const item = await connection.query('INSERT INTO `categories` (`name`) VALUES (?)',[category.name]);
            res.send({id:item.insertId})
        }


    });
    router.delete('/:id', async (req, res) => {

        try {
            await connection.query('DELETE FROM `categories` WHERE `id` = ?', req.params.id);
            res.send({message:'delete'})
        }catch (e) {
            res.send({message: e})
        }


    });
    return router
};
module.exports = routerCategories;