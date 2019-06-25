import connection
import bcrypt
from psycopg2 import sql


def hash_password(plain_text_password):
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


@connection.connection_handler
def get_boards(cursor):
    cursor.execute(
        '''
        SELECT *
        FROM board
        ORDER BY id
        ''')

    return cursor.fetchall()


@connection.connection_handler
def add_board(cursor):
    cursor.execute(
        '''
        INSERT INTO board(title)
        VALUES(NULL)
        ''')


@connection.connection_handler
def rename_board(cursor, board_id, new_title):
    cursor.execute(
        '''
        UPDATE board
        SET title = %(new_title)s
        WHERE id = %(board_id)s
        ''', {'board_id': board_id, 'new_title': new_title})


def get_highest_board_id():
    result = get_highest_id('board')
    if result:
        return result['id']


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute(
        '''
        SELECT c.id,
               c.board_id,
               c.title,
               s.title AS status_id,
               c.position
        FROM card c
            JOIN status s
                ON c.status_id = s.id
        WHERE board_id = %(board_id)s
        ''', {'board_id': board_id})

    return cursor.fetchall()


@connection.connection_handler
def add_card(cursor, board_id):
    cursor.execute(
        '''
        INSERT INTO card(board_id, status_id, position)
        VALUES(%(board_id)s, 0, 0)
        ''', {'board_id': board_id})


@connection.connection_handler
def remove_card(cursor, card_id):
    cursor.execute(
        '''
        DELETE
        FROM card
        WHERE id = %(card_id)s
        ''', {'card_id': card_id})


def get_highest_card_id():
    result = get_highest_id('card')
    if result:
        return result['id']


@connection.connection_handler
def get_highest_id(cursor, table):
    # this function should only be used by get_highest_card_id and get_highest_board_id
    if table not in ['board', 'card']:
        raise ValueError('Invalid argument provided for parameter "table"')
    cursor.execute(
        sql.SQL('''
                SELECT MAX(id) AS id
                FROM {table}
                ''').format(table=sql.Identifier(table)))

    return cursor.fetchone()


@connection.connection_handler
def check_if_user_exists(cursor, username):
    cursor.execute(
        '''
        SELECT *
        FROM account
        WHERE username = %(username)s 
        ''', {'username': username})

    return bool(cursor.fetchone())


@connection.connection_handler
def register_user(cursor, username, password):
    hashed_password = hash_password(password)
    cursor.execute(
        '''
        INSERT INTO account(username, password)
        VALUES (%(username)s, %(password)s)
        ''', {'username': username, 'password': hashed_password})
