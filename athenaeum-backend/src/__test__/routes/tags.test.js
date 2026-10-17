const request = require('supertest');
const tagRouter = require('../../routes/tags');
const db = require('../../db');

const app = require('../../app');
app.use('/tags', tagRouter);

describe('Tag Router Integration Tests', () => {
    beforeEach(async () => {
        await db.query('DELETE FROM book_tags');
        await db.query('DELETE FROM tags');
    });

    afterAll(async () => {
        await db.end();
    });

    it('should create a new tag (POST /tags) and fetch it (GET /tags/:id)', async () => {
        const result = await request(app).post('/tags').send({ name: 'Enemies to Lovers' });
        expect(result.statusCode).toBe(201);
        expect(result.body.data.name).toBe('Enemies to Lovers');
        const tagId = result.body.data.id;

        const getRes = await request(app).get(`/tags/${tagId}`);
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.data.name).toBe('Enemies to Lovers');
    });

    it('should fetch all tags (GET /tags)', async () => {
        await db.query(`INSERT INTO tags (name) VALUES ('Slow Burn'), ('Found Family')`);
        const res = await request(app).get('/tags');
        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(2);
        expect(res.body.data.length).toBe(2);
    });

    it('should update a tag (PATCH /tags/:id)', async () => {
        const seed = await db.query(`INSERT INTO tags (name) VALUES ('Old Tag Name') RETURNING id`);
        const tagId = seed.rows[0].id;
        const result = await request(app).patch(`/tags/${tagId}`).send({ name: 'New Tag Name' });
        expect(result.statusCode).toBe(200);
        expect(result.body.data.name).toBe('New Tag Name');
    });

    it('should delete a tag (DELETE /tags/:id)', async () => {
        const seed = await db.query(`INSERT INTO tags (name) VALUES ('To Delete') RETURNING id`);
        const tagId = seed.rows[0].id;

        const result = await request(app).delete(`/tags/${tagId}`);
        expect(result.statusCode).toBe(200);
        expect(result.body.message).toBe('Tag deleted.');

        const getRes = await request(app).get(`/tags/${tagId}`);
        expect(getRes.statusCode).toBe(404);
    });
});