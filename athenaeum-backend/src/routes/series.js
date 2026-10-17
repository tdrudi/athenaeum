const express = require('express');
const Series = require('../models/series');
const router = express.Router();

//GET - Get all series
router.get('/', async (req, res, next) => {
    try {
            const result = await Series.all();
            return res.status(200).json({ count: result.length, data: result });
    } catch (err) {
        next(err);
   }
});

// GET - Get series by id
router.get('/:id', async (req, res, next) => {
    try {
            const result = await Series.get(req.params.id);
            return res.status(200).json({ count: result.length, data: result });
    } catch (err) {
        next(err);
   }
});

//GET - Get series by author
router.get('/:authorId', async (req, res, next) => {
    try {
            const result = await Series.getByAuthor(req.params.authorId);
            return res.status(200).json({ count: result.length, data: result });
    } catch (err) {
        next(err);
   }
});

//GET - Get books in series
router.get('/:id', async (req, res, next) => {
    try {
            const result = await Series.get(req.params.id);
            return res.status(200).json({ count: result.length, data: result });
    } catch (err) {
        next(err);
   }
});

//POST - Create new series
router.post('/', async (req, res, next) => {
    try {
            const result = await Series.create(req.body);
            return res.status(201).json({ data: result });
    } catch (err) {
        next(err);
   }
});


//POST - Add book to series
router.post('/:seriesId/:bookId', async (req, res, next) => {
    try {
            const result = await Series.addBook(req.params.id, req.body);
            return res.status(201).json({ message: 'Book added to series.', data: result });
    } catch (err) {
        next(err);
   }
});

//PATCH - Edit series details
router.patch('/:id', async (req, res, next) => {
    try {
            const result = await Series.update(req.params.id, req.body.name);
            return res.status(200).json({ message: 'Series updated.', data: result });
    } catch (err) {
        next(err);
   }
});

//PATCH - Remove book from series
router.patch('/:seriesId/:bookId', async (req, res, next) => {
    try {
        const result = await Series.removeBook(req.params.seriesId, req.params.bookId, req.body.index);
            return res.status(200).json({ message: 'Book removed from series.', data: result });
    } catch (err) {
        next(err);
   }
});

//DELETE - Remove series
router.delete('/:id', async (req, res, next) => {
    try {
            const result = await Series.delete(req.params.id);
            return res.status(200).json({ message: 'Series deleted.', data: result});
    } catch (err) {
        next(err);
   }
});

module.exports = router;