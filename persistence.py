import csv, collections

STATUSES_FILE = './data/statuses.csv'
BOARDS_FILE = './data/boards.csv'
CARDS_FILE = './data/cards.csv'

_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _append_csv(file_name, new_data):
    with open(file_name, 'a') as csvfile:

        csvfile.write((",".join([v for v in new_data.values()]))+"\n")


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
    new_data['title'] = '"new card"'
    new_data['status_id'] = '0'
    new_data['order'] = '0'

    _append_csv(CARDS_FILE, new_data)


def add_board(board_data):
    new_data = collections.OrderedDict()
    new_data['id'] = board_data['id']
    new_data['title'] = f'"{board_data["title"]}"'

    _append_csv(BOARDS_FILE, new_data)


def rename_board(board_data):
    print(board_data)
