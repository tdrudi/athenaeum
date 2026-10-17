const request = require('supertest');
const fs = require('fs');
const path = require("path");
const app = require('../../app');
const db = require('../../db');
const Tag = require('../../models/tags');
const Book = require("../../models/books");

beforeAll(async () => {
    try {
        const schemaPath = path.join(__dirname, "../../schema.sql");
        const seedPath = path.join(__dirname, "../../seed.sql");

        const schema = fs.readFileSync(schemaPath, 'utf8');
        const seed = fs.readFileSync(seedPath, 'utf8');
        await db.query(schema);
        await db.query(seed);
    } catch (err) {
        console.error('Error setting up test database:', err.message);
    }
});

afterAll(async () => {
    await db.end();
});

describe("tag Model Test Suite", () => {

    test("tag.all() returns all seeded tags", async () => {
        const tags = await Tag.all();
        expect(Array.isArray(tags)).toBe(true);
    });

    test("tag.get(id) returns a tag and its associated books array when ID exists", async () => {
        const tag = await Tag.create("Enemies to Lovers");
        const book = await Book.create({ title: "The Cruel Prince", author_name: "Holly Black" });
        await Tag.addBook(tag.id, book.id);

        const fetchedtag = await Tag.get(tag.id);
        expect(fetchedtag).toBeDefined();
        expect(fetchedtag.tagId).toBe(tag.id);
        expect(fetchedtag.name).toBe("Enemies to Lovers");
        expect(fetchedtag).toHaveProperty("books");
        expect(Array.isArray(fetchedtag.books)).toBe(true);
        expect(fetchedtag.books.length).toBe(1);
    });

    test("tag.get(id) throws a 404 ExpressError when tag ID does not exist", async () => {
        await expect(Tag.get(99999)).rejects.toThrow("No such tag: 99999");
    });

    test("tag.create() successfully creates and returns a new tag", async () => {
        const newtag = await Tag.create("Found Family");
        expect(newtag.id).toBeDefined();
        expect(newtag.name).toBe("Found Family");
    });

    test("tag.create() throws a 400 ExpressError if name is missing", async () => {
        await expect(Tag.create()).rejects.toThrow("Tag name is required");    });

    test("tag.addBook() successfully links a book to a tag via junction table", async () => {
        const tag = await Tag.create("One Bed" );
        const book = await Book.create({ title: "Test Book", author_name: "Test Author"});
        const link = await Tag.addBook(tag.id, book.id);
        expect(link.tag_id).toBe(tag.id);
        expect(link.book_id).toBe(book.id);
    });

    test("tag.removeBook() successfully unlinks a book from a tag", async () => {
        const tag = await Tag.create("Unlink tag");
        const book = await Book.create({ title: "Unlink tag Book", author_name: "Test Author"});

        await Tag.addBook(tag.id, book.id);
        const result = await Tag.removeBook(tag.id, book.id);
        expect(result.message).toBe("Tag removed from book.");
    });

    test("tag.removeBook() throws 404 if association does not exist", async () => {
        await expect(Tag.removeBook(9999, 9999)).rejects.toThrow();
    });

    test("tag.delete(id) deletes a tag successfully", async () => {
        const tag = await Tag.create("Tag To Delete");
        
        const res = await Tag.delete(tag.id);
        expect(res).toEqual({ message: "Tag deleted." });

        // Verify it's gone
        await expect(Tag.get(tag.id)).rejects.toThrow(`No such tag: ${tag.id}`);
    });

    test("tag.delete(id) throws 404 if tag ID does not exist", async () => {
        await expect(Tag.delete(99999)).rejects.toThrow("No such tag: 99999");
    });

});
