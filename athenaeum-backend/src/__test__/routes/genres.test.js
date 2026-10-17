const request = require('supertest');
const genreRouter = require('../../routes/genres');
const db = require('../../db');

const app = require('../../app');
app.use('/genres', genreRouter);


describe('Genre Router Integration Tests', () => {
    beforeEach(async () => {
        await db.query('DELETE FROM genres');
    });

    afterAll(async () => {
        await db.end();
    });

    it('should create a new genre (POST /genres) and fetch it (GET /genres/:id)', async () => {
        const result = await request(app).post('/genres').send({ name: 'Fantasy' });
        expect(result.statusCode).toBe(201);
        expect(result.body.data.name).toBe('Fantasy');
        const genreId = result.body.data.id;

        const getRes = await request(app).get(`/genres/${genreId}`);
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.data.name).toBe('Fantasy');
    });

    it('should fetch all genres (GET /genres)', async () => {
        await db.query(`INSERT INTO genres (name) VALUES ('Romantasy'), ('Sci-Fi')`);
        const res = await request(app).get('/genres');
        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(2);
        expect(res.body.data.length).toBe(2);
    });

    it('should update a genre (PATCH /genres/:id)', async () => {
        const seed = await db.query(`INSERT INTO genres (name) VALUES ('Dark Romanc') RETURNING *`);
        const genreId = seed.rows[0].id;

        const result = await request(app).patch(`/genres/${genreId}`).send({ name: 'Dark Romance' });
        expect(result.statusCode).toBe(200);
        expect(result.body.data.name).toBe('Dark Romance');
    });

    it('should delete a genre (DELETE /genres/:id)', async () => {
        const seed = await db.query(`INSERT INTO genres (name) VALUES ('To Delete') RETURNING *`);
        const genreId = seed.rows[0].id;

        const result = await request(app).delete(`/genres/${genreId}`);
        expect(result.statusCode).toBe(200);
        expect(result.body.message).toBe('Genre deleted.');

        const getRes = await request(app).get(`/genres/${genreId}`);
        expect(getRes.statusCode).toBe(404);
        expect(getRes.body.error).toBe('Genre not found');
    });
});