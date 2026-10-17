const request = require('supertest');
const seriesRouter = require('../../routes/series');
const db = require('../../db');

const app = require('../../app');
app.use('/series', seriesRouter);

describe('Series Router Integration Tests', () => {
    beforeEach(async () => {
        await db.query('DELETE FROM book_series');
        await db.query('DELETE FROM series');
    });

    afterAll(async () => {
        await db.end();
    });

    it('should create a new series (POST /series) and fetch it (GET /series/:id)', async () => {
        const result = await request(app).post('/series').send({ name: 'The Empyrean' });
        expect(result.statusCode).toBe(201);
        expect(result.body.data.name).toBe('The Empyrean');
        const seriesId = result.body.data.id;

        const getRes = await request(app).get(`/series/${seriesId}`);
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.data.name).toBe('The Empyrean');
    });

    it('should fetch all series (GET /series)', async () => {
        await db.query(`INSERT INTO series (name) VALUES ('Mistborn'), ('Cosmere')`);
        const res = await request(app).get('/series');
        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(2);
        expect(res.body.data.length).toBe(2);
    });

    it('should update a series (PATCH /series/:id)', async () => {
        const seed = await db.query(`INSERT INTO series (name) VALUES ('Old Series Name') RETURNING id`);
        const seriesId = seed.rows[0].id;
        const result = await request(app).patch(`/series/${seriesId}`).send({ name: 'New Series Name' });
        expect(result.statusCode).toBe(200);
        expect(result.body.data.name).toBe('New Series Name');
    });

    it('should delete a series (DELETE /series/:id)', async () => {
        const seed = await db.query(`INSERT INTO series (name) VALUES ('To Delete') RETURNING id`);
        const seriesId = seed.rows[0].id;

        const result = await request(app).delete(`/series/${seriesId}`);
        expect(result.statusCode).toBe(200);
        expect(result.body.message).toBe('Series deleted.');

        const getRes = await request(app).get(`/series/${seriesId}`);
        expect(getRes.statusCode).toBe(404);
    });
});