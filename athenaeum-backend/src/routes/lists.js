const express = require('express');
const List = require('../models/lists');
const router = express.Router();

//GET - Get all lists
router.get('/', async (req, res, next) => {
    try {
        const result = await List.all();
        if (result.length === 0) {
            return res.status(404).json({ message: 'No lists found.' });
        }
        return res.status(200).json({ count: result.length, data: result });
    } catch (err) {
        next(err);
    }
});

//GET - Get one list by Id
router.get('/:id', async (req, res, next) => {
    try {
           const result = await List.get(req.params.id);
           return res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
});

//PATCH - Update detials of list by Id
router.patch('/:id', async (req, res, next) => {
    try {
        const { name, description, is_private } = req.body;
        const result = await List.update(req.params.id, {name, description, is_private});
        return res.status(200).json({ message: 'List updated', data: result });    
    } catch (err) {
        next(err);
    }
});

//POST - Create new list
router.post('/', async (req, res, next) => {
    try {
        const { name, description, is_private } = req.body;
        const result = await List.create({ name, description, is_private });
        return res.status(201).json({ data: result });
    } catch (err) {
        next(err);
    }
});

//POST - Add book to list
router.patch('/:listId/:bookId', async (req, res, next) => {
    try {
        const result =await List.addBook(req.params.listId, req.params.bookId);
        return res.status(200).json({ message: 'Book added to list.', data: result });
    } catch (err) {
        next(err);
    }
});

//DELETE - Remove book from list
router.delete('/:listId/:bookId', async (req, res, next) => {
    try {
        const result = await List.removeBook(req.params.listId, req.params.bookId);
        return res.status(200).json({ message: 'Book removed from list.', data: result });
    } catch (err) {
        next(err);
    }
});


//DELETE - Remove list by Id
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await List.delete(req.params.id);
        return res.status(200).json({ message: 'List deleted.', data: result });
    } catch (err) {
        next(err);
    }
});


module.exports = router;