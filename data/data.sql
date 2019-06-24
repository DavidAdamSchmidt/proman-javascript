ALTER TABLE IF EXISTS ONLY board
    DROP CONSTRAINT IF EXISTS pk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY status
    DROP CONSTRAINT IF EXISTS pk_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY card
    DROP CONSTRAINT IF EXISTS pk_card_id CASCADE;

ALTER TABLE IF EXISTS ONLY card
    DROP CONSTRAINT IF EXISTS fk_board_id;
ALTER TABLE IF EXISTS ONLY card
    DROP CONSTRAINT IF EXISTS fk_status_id;


DROP TABLE IF EXISTS board;
DROP SEQUENCE IF EXISTS board_id_seq;
CREATE TABLE board (
    id serial NOT NULL,
    title varchar
);

DROP TABLE IF EXISTS status;
DROP SEQUENCE IF EXISTS status_id_seq;
CREATE TABLE status (
    id serial NOT NULL,
    title varchar
);

DROP TABLE IF EXISTS card;
DROP SEQUENCE IF EXISTS card_id_seq;
CREATE TABLE card (
    id serial NOT NULL,
    board_id integer,
    title varchar,
    status_id integer,
    order_by integer
);


ALTER TABLE ONLY board
    ADD CONSTRAINT pk_board_id PRIMARY KEY(id);
ALTER TABLE ONLY status
    ADD CONSTRAINT pk_status_id PRIMARY KEY(id);
ALTER TABLE ONLY card
    ADD CONSTRAINT pk_card_id PRIMARY KEY(id);

ALTER TABLE ONLY card
    ADD CONSTRAINT fk_board_id FOREIGN KEY(board_id)
        REFERENCES board(id) ON DELETE CASCADE;
ALTER TABLE ONLY card
    ADD CONSTRAINT fk_status_id FOREIGN KEY(status_id)
        REFERENCES status(id) ON DELETE CASCADE;


INSERT INTO board VALUES(1, 'Board 1');
INSERT INTO board VALUES(2, 'Board 2');
SELECT pg_catalog.setval('board_id_seq', 2, true);

INSERT INTO status VALUES(0, 'new');
INSERT INTO status VALUES(1, 'in-progress');
INSERT INTO status VALUES(2, 'testing');
INSERT INTO status VALUES(3, 'done');
SELECT pg_catalog.setval('status_id_seq', 3, true);

INSERT INTO card VALUES(1, 1, 'new card 1', 0, 0);
INSERT INTO card VALUES(2, 1, 'new card 2', 0, 1);
INSERT INTO card VALUES(3, 1, 'in progress card 1', 1, 0);
INSERT INTO card VALUES(4, 1, 'planning 1', 2, 0);
INSERT INTO card VALUES(5, 1, 'done card 1', 3, 0);
INSERT INTO card VALUES(6, 1, 'done card 2', 3, 1);
INSERT INTO card VALUES(7, 2, 'new card 1', 0, 0);
INSERT INTO card VALUES(8, 2, 'new card 2', 0, 2);
INSERT INTO card VALUES(9, 2, 'in progress card 1', 1, 0);
INSERT INTO card VALUES(10, 2, 'planning 1', 1, 0);
INSERT INTO card VALUES(11, 2, 'done card 1', 3, 0);
INSERT INTO card VALUES(12, 2, 'done card 2', 3, 1);
SELECT pg_catalog.setval('card_id_seq', 12, true);