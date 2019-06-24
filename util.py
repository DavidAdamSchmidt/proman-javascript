from functools import wraps
from flask import jsonify


def json_response(func):
    """
    Converts the returned dictionary into a JSON response
    :param func:
    :return:
    """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        route_response = func(*args, **kwargs)
        if type(route_response) is tuple:
            return jsonify(route_response[0]), route_response[1]
        return jsonify(route_response)

    return decorated_function
