INSERT INTO authors (name) VALUES
        ('Rebecca Yarros'),
        ('Matt Dinniman'),
        ('Alexandra St. Pierre');

INSERT INTO books(title, status, sprayed_edges, signed, is_wishlist) VALUES 
        ('Fourth Wing', 'Read', true, true, false),
        ('Iron Flame', 'Reading', true, false, false),
        ('Dungeon Crawler Carl', 'Reading', false, false, true),
        ('Neurovance', 'Unread', false, true, false);

INSERT INTO series (name) VALUES
    ('The Empyrean'),
    ('Dungeon Crawler Carl');

INSERT INTO genres (name) VALUES
    ('Fantasy'),
    ('Romantasy'),
    ('Science Fiction'),
    ('LitRPG');

INSERT INTO tags (name) VALUES
    ('Enemies to Lovers'),
    ('Dragons'),
    ('Military Academy'),
    ('Progression Fantasy'),
    ('Cyberpunk');

INSERT INTO book_authors(book_id, author_id) VALUES
        (1,1),
        (2,2),
        (3,3);

INSERT INTO book_series (series_id, book_id, series_index) VALUES
    (1, 1, 1), -- The Empyrean #1: Fourth Wing
    (1, 2, 2), -- The Empyrean #2: Iron Flame
    (2, 3, 1); -- Dungeon Crawler Carl #1: Dungeon Crawler Carl

INSERT INTO book_genres (book_id, genre_id) VALUES
    (1, 1), -- Fourth Wing -> Fantasy
    (1, 2), -- Fourth Wing -> Romantasy
    (2, 1), -- Iron Flame -> Fantasy
    (2, 2), -- Iron Flame -> Romantasy
    (3, 3), -- Dungeon Crawler Carl -> Science Fiction
    (3, 4), -- Dungeon Crawler Carl -> LitRPG
    (4, 3); -- Neurovance -> Science Fiction

INSERT INTO book_tags (book_id, tag_id) VALUES
    (1, 1), -- Fourth Wing -> Enemies to Lovers
    (1, 2), -- Fourth Wing -> Dragons
    (1, 3), -- Fourth Wing -> Military Academy
    (2, 1), -- Iron Flame -> Enemies to Lovers
    (2, 2), -- Iron Flame -> Dragons
    (3, 4), -- Dungeon Crawler Carl -> Progression Fantasy
    (4, 5); -- Neurovance -> Cyberpunk


