from flask import Flask, render_template, url_for, request, jsonify
from util import json_response

import data_handler

app = Flask(__name__)


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
    return data_handler.get_boards()


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
def create_card():
    data = request.get_json()
    data_handler.add_card(data)
    return 'todo', 200


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()

# id,board_id,title,status_id,order
# 1,1,new card 1,0,0
# 2,1,new card 2,0,1
# 3,1,in progress card,1,0
# 4,1,planning,2,0
# 5,1,done card 1,3,0
# 6,1,done card 1,3,1
# 7,2,new card 1,0,0
# 8,2,new card 2,0,1
# 9,2,in progress card,1,0
# 10,2,planning,2,0
# 11,2,done card 1,3,0
# 12,2,done card 1,3,1
