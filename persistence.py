import csv, collections

STATUSES_FILE = './data/statuses.csv'
BOARDS_FILE = './data/boards.csv'
CARDS_FILE = './data/cards.csv'

_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _remove_row_from_csv(file_name, row_id, header):
    data = _read_csv(file_name)

    i = 0
    while i < len(data) and data[i]['id'] != row_id:
        i += 1
    if i < len(data):
        del data[i]

    _write_csv(file_name, data, header)


def _change_row_from_csv(file_name, row_id, header, new_data):
    data = _read_csv(file_name)

    i = 0
    while i < len(data) and data[i]['id'] != row_id:
        i += 1
    if i < len(data):
        data[i]['title'] = new_data['title']

    _write_csv(file_name, data, header)


def _append_csv(file_name, data):
    with open(file_name, 'a') as csvfile:

        csvfile.write((",".join([v for v in data.values()]))+"\n")


def _read_csv(file_name):
    """
    Reads content of a .csv file
    :param file_name: relative path to data file
    :return: OrderedDict
    """
    with open(file_name) as boards:
        rows = csv.DictReader(boards, delimiter=',', quotechar='"')
        formatted_data = []
        for row in rows:
            formatted_data.append(dict(row))
        return formatted_data


def _write_csv(file_name, data, header):
    with open(file_name, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=header)
        writer.writeheader()

        for row in data:
            writer.writerow(row)


def _get_data(data_type, file, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param file: relative path to data file
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or data_type not in _cache:
        _cache[data_type] = _read_csv(file)
    return _cache[data_type]


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data('statuses', STATUSES_FILE, force)


def get_boards(force=False):
    return _get_data('boards', BOARDS_FILE, force)


def get_cards(force=False):
    return _get_data('cards', CARDS_FILE, force)


def add_card(card_data):

    new_data = collections.OrderedDict()
    new_data['id'] = card_data['id']
    new_data['board_id'] = card_data['board_id']
    new_data['title'] = f'"new card {card_data["id"]}"'
    new_data['status_id'] = '0'
    new_data['order'] = '0'

    _append_csv(CARDS_FILE, new_data)


def add_board(board_data):
    new_data = collections.OrderedDict()
    new_data['id'] = board_data['id']
    new_data['title'] = f'"{board_data["title"]}"'

    _append_csv(BOARDS_FILE, new_data)


def remove_card(card_id):
    header = ['id', 'board_id', 'title', 'status_id', 'order']

    _remove_row_from_csv(CARDS_FILE, card_id, header)


def rename_board(board_data):
    _change_row_from_csv(BOARDS_FILE, board_data['board_id'], ["id", "title"], board_data)
