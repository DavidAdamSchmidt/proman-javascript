import csv, collections

STATUSES_FILE = './data/statuses.csv'
BOARDS_FILE = './data/boards.csv'
CARDS_FILE = './data/cards.csv'

CARDS_HEADER = ["id", "board_id", "title", "status_id", "order"]

_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _write_csv(file_name, header, data, append=True):
    with open(file_name, 'a') as csvfile:

        new_data = collections.OrderedDict()
        new_data['id'] = data['id']
        new_data['board_id'] = data['board_id']
        new_data['title'] = data['title']
        new_data['status_id'] = data['status_id']
        new_data['order'] = data['order']

        csvfile.write((",".join([v for v in new_data.values()]))+"\n")

        # writer = csv.DictWriter(csvfile)
        # writer.writeheader()

        # existing_data = _get_data('cards', CARDS_FILE, False)
        # print(existing_data)

        # for row in existing_data:
        #     # On updating an existing User Story, just overwrite the current line with the received data
        #     # if not append:
        #     #     if row['id'] == data['id']:
        #     #         row = data
        #
        #     writer.writerow(row)

        # if append:
        # writer.writerow(data)


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
    _write_csv(CARDS_FILE, CARDS_HEADER, card_data)
