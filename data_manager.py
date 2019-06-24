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
               c.order_by
        FROM card c
            JOIN status s
                ON c.status_id = s.id
        WHERE board_id = %(board_id)s
        ''', {'board_id': board_id})

    return cursor.fetchall()
