const request = require('supertest');
const fs = require('fs');
const app = require('../../app');
const db = require('../../db');
const path = require("path");
const List = require('../../models/lists');
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

describe("List Model Test", () => {

    test("List.all() returns all seeded lists", async () => {
        const lists = await List.all();
        expect(Array.isArray(lists)).toBe(true);
    });

    test("List.get(id) returns a list and its associated books array when ID exists", async () => {
        const list = await List.create({ name: "Favorites", description: "Top tier reads" });
        
        const fetchedList = await List.get(list.id);
        expect(fetchedList).toBeDefined();
        expect(fetchedList.id).toBe(list.id);
        expect(fetchedList.name).toBe("Favorites");
        expect(fetchedList).toHaveProperty("books");
        expect(Array.isArray(fetchedList.books)).toBe(true);
    });

    test("List.get(id) throws a 404 ExpressError when list ID does not exist", async () => {
        await expect(List.get(99999)).rejects.toThrow("No such list: 99999");
    });

    test("List.create() successfully creates and returns a new list", async () => {
        const newList = await List.create({ name: "TBR Fall 2026", description: "Read soon" });
        expect(newList.id).toBeDefined();
        expect(newList.name).toBe("TBR Fall 2026");
        expect(newList.description).toBe("Read soon");
    });

    test("List.create() throws a 400 ExpressError if name is missing", async () => {
        await expect(List.create({})).rejects.toThrow("List name is required");
    });

    test("List.addBook() successfully links a book to a list via junction table", async () => {
        const list = await List.create({ name: "Read List" });
        const book = await Book.create({ title: "Test Book", author_name: "Test Author" });

        const link = await List.addBook(list.id, book.id);
        expect(link.list_id).toBe(list.id);
        expect(link.book_id).toBe(book.id);
    });

    test("List.removeBook() successfully unlinks a book from a list", async () => {
        const list = await List.create({ name: "Unlink List" });
        const book = await Book.create({ title: "Unlink Book", author_name: "Test Author" });

        await List.addBook(list.id, book.id);
        const result = await List.removeBook(list.id, book.id);
        expect(result.message).toBe("Book removed from list");
    });

    test("List.removeBook() throws 404 if association does not exist", async () => {
        await expect(List.removeBook(9999, 9999)).rejects.toThrow();
    });

    test("List.delete(id) deletes a list successfully", async () => {
        const list = await List.create({ name: "List To Delete" });
        
        const res = await List.delete(list.id);
        expect(res).toEqual({ message: "List deleted" });

        // Verify it's gone
        await expect(List.get(list.id)).rejects.toThrow(`No such list: ${list.id}`);
    });

    test("List.delete(id) throws 404 if list ID does not exist", async () => {
        await expect(List.delete(99999)).rejects.toThrow("No such list: 99999");
    });

});
