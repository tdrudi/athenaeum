const express = require('express');
const router = express.Router();
const Book = require('../models/books');

//GET = Get all books
router.get('/', async (req, res, next) => {
    try {
        const result = await Book.all();
        return res.status(200).json({ data: result });
        
    } catch (err) {
        next(err);
    }
});

//GET - Get book by id
router.get('/:id', async (req, res, next) => {
    try {
        const result = await Book.get(req.params.id);
        return res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
});

//POST - Create new book
router.post('/', async (req, res, next) => {
    try {
        const result = await Book.create(req.body);
        return res.status(201).json({data: result });
    } catch (err) {
        next(err);
    }
});

//PATCH - Update a book
router.patch('/:id', async (req, res, next) => {
    try {
        const result = await Book.update(req.params.id, req.body);
        return res.status(200).json({message: 'Book updated', data: result});
    } catch (err) {
        next(err);
   }
});

//DELETE - Remove book
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await Book.delete(req.params.id);
        return res.status(200).json({ message: 'Book deleted.', data: result });
    } catch (err) {
        next(err);
    }
});


module.exports = router;