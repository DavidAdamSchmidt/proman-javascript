from flask import Flask, render_template, url_for, request, session, redirect
from util import json_response, ok_200, error_403
from os import environ
import data_handler


app = Flask(__name__)
app.secret_key = environ.get('SECRET_KEY')


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    if 'id' in session:
        return data_handler.get_boards(session['id'])
    return data_handler.get_boards()


@app.route("/create-board", methods=["POST"])
@json_response
def add_board():
    if 'id' in session:
        data_handler.add_board(session['id'])
    else:
        data_handler.add_board()
    board_id = data_handler.get_highest_board_id()
    return {'board_id': board_id}


@app.route("/remove-board", methods=["POST"])
@json_response
def remove_board():
    data = request.get_json()
    if 'boardId' not in data:
        return error_403('no board id received')
    board_id = data['boardId']
    data_handler.remove_board(board_id)
    return ok_200(f'board {board_id} was successfully removed')


@app.route("/rename-board", methods=["POST"])
@json_response
def rename_board():
    data = request.get_json()
    if 'title' not in data:
        return error_403('no title received')
    if 'id' not in data:
        return error_403('no id received')
    board_id = data['id']
    title = data['title']
    data_handler.rename_board(board_id, title)
    return ok_200(f'title of board #{board_id} was successfully updated')


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/create-card", methods=["POST"])
@json_response
def add_card():
    data = request.get_json()
    if 'board_id' not in data:
        return error_403('no id received')
    data_handler.add_card(data['board_id'])
    card_id = data_handler.get_highest_card_id()
    return {'card_id': card_id}


@app.route("/remove-card", methods=["POST"])
@json_response
def remove_card():
    data = request.get_json()
    if 'id' not in data:
        return error_403('no card id received')
    card_id = data['id']
    data_handler.remove_card(card_id)
    return ok_200(f'card #{card_id} was successfully removed')


@app.route("/update-card-position", methods=["POST"])
@json_response
def update_card_position():
    data = request.get_json()
    for table in ('card', 'board', 'status'):
        if f'{table}Id' not in data:
            return error_403(f'no {table} id received')
    card_id = data['cardId']
    board_id = data['boardId']
    status_id = data['statusId']
    data_handler.update_card_position(card_id, board_id, status_id)
    return ok_200(f' card {card_id} was successfully updated')


@app.route("/register", methods=["POST"])
def register_user():
    form = request.form
    if 'username' not in form:
        return render_template('index.html')  # TODO
    if 'password' not in form:
        return render_template('index.html')  # TODO
    username = form['username']
    password = form['password']
    user_exists = data_handler.check_if_user_exists(username)
    if user_exists:
        return render_template('index.html')  # TODO
    data_handler.register_user(username, password)
    return redirect(url_for('index'))


@app.route("/login", methods=["POST"])
def login_user():
    form = request.form
    if 'username' not in form:
        return render_template('index.html')  # TODO
    if 'password' not in form:
        return render_template('index.html')  # TODO
    username = form['username']
    password = form['password']
    valid_password = data_handler.is_valid_password(username, password)
    if valid_password:
        user_id = data_handler.login_user(username)
        if user_id:
            session['id'] = user_id
            session['username'] = username
    return redirect(url_for('index'))


@app.route('/logout')
def logout_user():
    session.pop('username', None)
    session.pop('id', None)
    return redirect(url_for('index'))


def main():
    app.run(host='0.0.0.0', debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
