const request = require('supertest');
const bookRouter = require('../../routes/books');
const db = require('../../db');

const app = require('../../app');
app.use('/books', bookRouter);


describe('Book Router Integration Tests', () => {
    beforeEach(async () => {
        await db.query('DELETE FROM books');
    });

    afterAll(async () => {
        await db.end();
    });

    it('should create a new book (POST /books) and fetch it (GET /books/:id)', async () => {
        const newBookData = {
            isbn: '9780765326353',
            title: 'The Way of Kings',
            page_count: 1007,
            cover_image: 'https://example.com/cover.jpg',
            spine_color: '#1a2b3c',
            spine_height_px: 220,
            spine_width_px: 40,
            author_name: 'Brandon Sanderson'
        };
        const result = await request(app).post('/books').send(newBookData);
        expect(result.statusCode).toBe(201);
        expect(result.body.data.title).toBe('The Way of Kings');
        const bookId = result.body.data.id;

        const getRes = await request(app).get(`/books/${bookId}`);
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.data.isbn).toBe('9780765326353');
        expect(getRes.body.data.page_count).toBe(1007);
    });

    it('should return 404 if getting all books when table is empty', async () => {
        const res = await request(app).get('/books');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Books not found.');
    });

    it('should update a book (PATCH /books/:id)', async () => {
        const seed = await db.query(
            `INSERT INTO books (title, page_count) VALUES ($1, $2) RETURNING *`,
            ['Original Title', 500]
        );
        const bookId = seed.rows[0].id;

        const result = await request(app).patch(`/books/${bookId}`).send({ title: 'Updated Title' });
        expect(result.statusCode).toBe(200);
        expect(result.body.message).toBe('Book updated');
        expect(result.body.data.title).toBe('Updated Title');
    });

    it('should delete a book (DELETE /books/:id)', async () => {
        const seed = await db.query(
            `INSERT INTO books (title) VALUES ($1) RETURNING *`,
            ['Book to Delete']
        );
        const bookId = seed.rows[0].id;

        const result = await request(app).delete(`/books/${bookId}`);
        expect(result.statusCode).toBe(200);
        expect(result.body.message).toBe('Book deleted.');

        const getRes = await request(app).get(`/books/${bookId}`);
        expect(getRes.statusCode).toBe(404);
        expect(getRes.body.error).toBe('Book not found.');
    });
});

