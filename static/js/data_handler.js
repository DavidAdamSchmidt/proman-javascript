// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function

        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        })
        .then(response => response.json()
        .then(data => ({status: response.status, body: data})))
        .then(statusAndData => callback(statusAndData));
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards
        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data = response;
            callback(response);
        });
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (callback) {
        // creates new board, saves it and calls the callback function with its data
        let data = JSON.stringify({});

        this._api_post('/create-board', data, callback);
    },
    createNewCard: function (boardId, callback) {
        // creates new card, saves it and calls the callback function with its data
        let data = JSON.stringify({
            board_id: boardId,
        });

        this._api_post('/create-card', data, callback);
    },
    removeCard: function (cardId, callback) {
        let data = JSON.stringify({
            id: cardId,
        });

        this._api_post('/remove-card', data, (response) => {
            const dataObject = JSON.parse(data);

            callback(dataObject.id, response)
        });
    },
    updateCardPosition: function (cardId, boardId, statusId, callback) {
        const data = JSON.stringify( {
            cardId: cardId,
            boardId: boardId,
            statusId: statusId
        });

        this._api_post('/update-card-position', data, callback)
    },
    renameBoard: function (newName, boardId, callback) {
        let data = JSON.stringify({
            title: newName,
            id: boardId,
        });

        this._api_post('/rename-board', data, callback);
    },
    registerUser: function (callback) {
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;

        const data = JSON.stringify({
            username: username,
            password: password
        });

        this._api_post('/register', data, callback)
    }
    // here comes more features
};
