const request = require('supertest');
const authorRouter = require('../../routes/authors');
const db = require('../../db');

const app = require('../../app');
app.use('/authors', authorRouter);

describe('Author Router Integration Tests', () => {
    beforeEach(async () => {
        await db.query('DELETE FROM authors');
    });

    afterAll(async () => {
        await db.end();
    });

    it('should create a new author (POST /authors) and fetch it (GET /authors)', async () => {
        const result = await request(app).post('/authors').send({ name: 'Brandon Sanderson' });
        expect(result.statusCode).toBe(201);
        expect(result.body.data.name).toBe('Brandon Sanderson');
        const authorId = result.body.data.id;

        const getAllRes = await request(app).get('/authors');
        expect(getAllRes.statusCode).toBe(200);
        expect(getAllRes.body.data.length).toBe(1);

        const getOneRes = await request(app).get(`/authors/${authorId}`);
        expect(getOneRes.statusCode).toBe(200);
        expect(getOneRes.body.data.name).toBe('Brandon Sanderson');
    });

    it('should update an author (PATCH /authors/:id)', async () => {
        const newAuth = await request(app).post('/authors').send({ name: 'Old Name' });
        const authorId = newAuth.body.data.id;
        
        const result = await request(app).patch(`/authors/${authorId}`).send({ name: 'New Name' });
        expect(result.statusCode).toBe(200);
        expect(result.body.data.name).toBe('New Name');
    });

    it('should delete an author (DELETE /authors/:id)', async () => {
        const seed = await db.query('INSERT INTO authors (name) VALUES ($1) RETURNING *', ['To Delete']);
        const authorId = seed.rows[0].id;

        const result = await request(app).delete(`/authors/${authorId}`);
        expect(result.statusCode).toBe(200);
        expect(result.body.data.message).toBe('Author deleted successfully.');

        const getRes = await request(app).get(`/authors/${authorId}`);
        expect(getRes.statusCode).toBe(404);
    });
});