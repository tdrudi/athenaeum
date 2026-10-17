const express = require('express');
const Genre = require('../models/genres');
const router = express.Router();

//GET = get all genres
router.get('/', async (req, res, next) => {
    try {
        const result = await Genre.all();
        return res.status(200).json({ count: result.length, data: result });
    } catch (err) {
        next(err);
   }
});

//GET - Single genre by ID
router.get('/:id', async (req, res, next) => {
    try {
        const result = await Genre.get(req.params.id);
        return res.status(200).json({ count: result.length, data: result });
    } catch (err) {
        next(err);
   }
});


//POST - Create a new genre
router.post('/', async (req, res, next) => {
    try {
        const result = await Genre.create(req.body);
        return res.status(201).json({ data: result });
        
    } catch (err) {
        next(err);
   }
});

//PATCH - Update a genre
router.patch('/:id', async (req, res, next) => {
    try {
        const result = await Genre.update(req.params.id, req.body);
        return res.status(200).json({data: result});
    } catch (err) {
        next(err);
   }
});

//DELETE - Delete a genre
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await Genre.delete(req.params.id);
        return res.status(200).json({message: 'Genre deleted.', data: result });
    } catch (err) {
        next(err);
   }
});


module.exports = router;