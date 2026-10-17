const express = require('express');
const cors = require('cors');
const booksRouter = require('./routes/books');
const authorsRouter = require('./routes/authors');
const genresRouter = require('./routes/genres');
const listsRouter = require('./routes/lists');
const seriesRouter = require('./routes/series');
const tagsRouter = require('./routes/tags');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Athenaeum API running successfully' });
});

//App routes
app.use('/books', booksRouter);
app.use('/authors', authorsRouter);
app.use('/genres', genresRouter);
app.use('/lists', listsRouter);
app.use('/series', seriesRouter);
app.use('/tags', tagsRouter);

app.use((err, req, res, next) => {  
    const status = err.status || 500;
    return res.status(status).json({ 
        error: err.message 
    });
});


module.exports = app;

