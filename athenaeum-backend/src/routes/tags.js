const express = require('express');
const Tag = require('../models/tags');
const router = express.Router();

//GET -- Get all tags
router.get('/', async (req, res, next) => {
    try {
            const result = await Tag.all();
            if (result.length === 0) {
                return res.status(404).json({ message: 'No tags found.' });
            }
            return res.status(200).json({ count: result.length, data: result });
    } catch (err) {
        next(err);
   }
});

//GET -- Get tag by id
router.get('/:id', async (req, res, next) => {
    try {
            const result = await Tag.get(req.params.id);
            return res.status(200).json({data: result });
    } catch (err) {
        next(err);
   }
});


//POST -- Create tag
router.post('/', async (req, res, next) => {
    try {
            const result = await Tag.create(req.body.name);
            return res.status(201).json({data: result });
    } catch (err) {
        next(err);
   }
});

//PATCH -- Update tag by id
router.patch('/:id', async (req, res, next) => {
    try {
            const result = await Tag.update(req.params.id, req.body.name);
        return res.status(200).json({ message: 'Tag updated.', data: result });
    } catch (err) {
        next(err);
   }
});

//POST -- Add book to tag
router.post('/:id', async (req, res, next) => {
    try {
            const result = await Tag.addBook(req.params.id, req.body);
            return res.status(201).json({message: 'Tag added to book.', data: result });
    } catch (err) {
        next(err);
   }
});

//PATCH -- Remove tag from book
router.patch('/:id', async (req, res, next) => {
    try {
            const result = await Tag.removeBook(req.params.id, req.body);
            return res.status(200).json({message: 'Tag removed from book.', data: result });
    } catch (err) {
        next(err);
   }
});


//DELETE -- Remove tag by id
router.delete('/:id', async (req, res, next) => {
    try {
            const result = await Tag.delete(req.params.id);
            return res.status(200).json({ message: 'Tag deleted.', data: result });
    } catch (err) {
        next(err);
   }
});

module.exports = router;