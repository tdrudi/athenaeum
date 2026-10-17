const request = require('supertest');
const listRouter = require('../../routes/lists');
const db = require('../../db');

const app = require('../../app');
app.use('/lists', listRouter);


describe('List Router Integration Tests', () => {
    let testBookId;
    
    beforeEach(async () => {
        await db.query('DELETE FROM book_lists');
        await db.query('DELETE FROM lists');
        await db.query('DELETE FROM books');
        const bookSeed = await db.query(
            `INSERT INTO books (title) VALUES ($1) RETURNING id`,
            ['Fourth Wing']
        );
        testBookId = bookSeed.rows[0].id;
    });

    afterAll(async () => {
        await db.end();
    });


    it('should create a new list (POST /lists) and fetch it (GET /lists/:id)', async () => {
        const result = await request(app).post('/lists').send({
                name: 'Favorite Romantasy',
                description: 'Books with dragons and spice',
                is_private: false
        });
        expect(result.statusCode).toBe(201);
        expect(result.body.data.name).toBe('Favorite Romantasy');
        const listId = result.body.data.id;

        const getRes = await request(app).get(`/lists/${listId}`);
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.data.description).toBe('Books with dragons and spice');
    });

    it('should fetch all lists (GET /lists)', async () => {
        await db.query(
            `INSERT INTO lists (name) VALUES ($1)`,
            ['TBR 2026']
        );

        const res = await request(app).get('/lists');
        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].name).toBe('TBR 2026');
    });

    it('should update a list (PATCH /lists/:id)', async () => {
        const seed = await db.query(
            `INSERT INTO lists (name) VALUES ($1) RETURNING id`,
            ['Old Title']
        );
        const listId = seed.rows[0].id;

        const result = await request(app).patch(`/lists/${listId}`).send({ name: 'New Title' });
        expect(result.statusCode).toBe(200);
        expect(result.body.message).toBe('List updated');
        expect(result.body.data.name).toBe('New Title');
    });

    it('should add a book to a list and remove it', async () => {
        const listSeed = await db.query(
            `INSERT INTO lists (name) VALUES ($1) RETURNING id`,
            ['Current Reads']
        );
        const listId = listSeed.rows[0].id;
        
        const addBook = await request(app).patch(`/lists/${listId}/${testBookId}`);
        expect(addBook.statusCode).toBe(200);
        expect(addBook.body.message).toBe('Book added to list.');

        const removeBook = await request(app).delete(`/lists/${listId}/${testBookId}`);
        expect(removeBook.statusCode).toBe(200);
        expect(removeBook.body.message).toBe('Book removed from list.');
    });

    it('should delete a list (DELETE /lists/:id)', async () => {
        const seed = await db.query(
            `INSERT INTO lists (name) VALUES ($1) RETURNING id`,
            ['To Delete']
        );
        const listId = seed.rows[0].id;
        const result = await request(app).delete(`/lists/${listId}`);
        expect(result.statusCode).toBe(200);
        expect(result.body.message).toBe('List deleted.');

        const getRes = await request(app).get(`/lists/${listId}`);
        expect(getRes.statusCode).toBe(404);
    });
});