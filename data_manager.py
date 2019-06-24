import connection


@connection.connection_handler
def get_boards(cursor):
    cursor.execute(
        '''
        SELECT
               *
        FROM board
        ''')

    return cursor.fetchall()


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute(
        '''
        SELECT
               c.id,
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
def remove_card(cursor, card_id):
    cursor.execute(
        '''
        DELETE
        FROM card
        WHERE id = %(card_id)s
        ''', {'card_id': card_id})
