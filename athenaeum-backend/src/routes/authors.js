const express = require('express');
const Author = require('../models/authors');
const router = express.Router();

//GET = Get all authors
router.get('/', async (req, res, next) => {
    try {
        const authors = await Author.all();
        return res.status(200).json({ data: authors });
    } catch (err) {
        next(err);
    }
});

//GET = Get author by ID
router.get('/:id', async (req, res, next) => {
    try {
        const author = await Author.get(req.params.id);
        return res.status(200).json({ data: author });
    } catch (err) {
       next(err);
    }
});

//POST - Create new author
router.post('/', async (req, res, next) => {
    try {
        const result = await Author.create(req.body.name);
        return res.status(201).json({ data: result });
    } catch (err) {
        next(err);
    }
});

//PATCH - Update an author
router.patch('/:id', async (req, res, next) => {
    try {
        const author = await Author.update(req.params.id, req.body.name);
        return res.status(200).json({ message: 'Author updated', data: author });
    } catch (err) {
        next(err);
    }
});



//GET - Get books by author
router.get('/:id/books', async (req, res, next) => {
    try {
        const books = await Author.getBooks(req.params.id);
        return res.status(200).json({ count: books.rows.length, data: books.rows });
    } catch (err) {
        next(err);
   }
});


//DELETE - Delete an author
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await Author.delete(req.params.id);
        return res.status(200).json({ data: { message: 'Author deleted successfully.', data: result } });
    } catch (err){
        next(err);
    }
});

module.exports = router;