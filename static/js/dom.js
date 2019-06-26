// It uses data_handler.js to visualize elements
import {dataHandler} from './data_handler.js';

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        const addBoardButton = document.querySelector('.board-add');
        const registrationButton = document.querySelector('#register');

        addBoardButton.addEventListener('click', e => dom.addBoard(e));
        registrationButton.addEventListener('click', () => dom.registerUser())
    },
    clearBoardContainer: function () {
        const boardContainer = document.querySelector('.board-container');

        boardContainer.innerHTML = '';
    },
    renderBoard: function (id, title) {
        return renderElement(id, title, 'board');
    },
    loadBoards: function (callback) {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.clearBoardContainer();
            dom.showBoards(boards);
            callback();
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to .board-container div
        // it adds necessary event listeners also
        const boardContainer = document.querySelector('.board-container');

        for (let board of boards) {
            let boardTitle = board.title ? board.title : `Board ${board.id}`;
            let newBoard = dom.renderBoard(board.id, boardTitle);

            boardContainer.insertAdjacentHTML('beforeend', newBoard);
        }

        const buttons = document.querySelectorAll('.board-add');

        for (let button of buttons) {
            button.addEventListener('click', e => dom.addCard(e));
        }

        const boardTitles = document.querySelectorAll('.board-title');

        for (let title of boardTitles) {
            title.addEventListener('click', e => dom.renameBoard(e));
        }
    },
    addBoard: function (e) {
        e.stopImmediatePropagation();
        e.target.disabled = true;

        dataHandler.createNewBoard(
            function (response) {
                if (response.status === 200) {
                    dom.showBoard(response.body['board_id']);
                } else {
                    console.log('There was an error while connecting to the database');
                }
            }
        );
    },
    showBoard: function (boardId) {
        const boardContainer = document.querySelector('.board-container');

        const newBoard = dom.renderBoard(boardId, `Board ${boardId}`);

        boardContainer.insertAdjacentHTML('beforeend', newBoard);

        const titleContainer = document.querySelector(`[data-board-id="${boardId}"] .board-title`);
        const addCardButton = document.querySelector(`[data-board-id="${boardId}"] .board-add`);

        titleContainer.addEventListener('click', e => dom.renameBoard(e));
        addCardButton.addEventListener('click', e => dom.addCard(e));

        const board = titleContainer.closest('.board');
        const columns = board.querySelectorAll('.board-column');

        for (let column of columns) {
            column.addEventListener('dragover', e => allowDrop(e));
            column.addEventListener('drop', e => onDrop(e));
        }

        titleContainer.click();

        const addBoardButton = document.querySelector('.board-add');

        addBoardButton.disabled = false;
    },
    renameBoard: function (e) {
        const titleContainer = e.target;
        const board = titleContainer.closest('.board');

        const oldTitle = titleContainer.innerHTML;
        titleContainer.innerHTML = '';

        const formTemplate = document.querySelector('#board-rename-template');
        const formTemplateClone = document.importNode(formTemplate.content, true);

        titleContainer.appendChild(formTemplateClone);

        const renameField = document.querySelector('.board-rename');

        renameField.focus();

        renameField.addEventListener('focusout', function () {
            titleContainer.innerHTML = oldTitle;
        });

        renameField.addEventListener('keydown', function (e) {
            if (e.keyCode === 13) {
                handleRenaming();
            }
        });

        function handleRenaming() {
            const newTitle = renameField.value;
            dataHandler.renameBoard(newTitle, board.dataset.boardId, function (response) {
                if (response.status === 200) {
                    titleContainer.innerHTML = newTitle;
                } else {
                    console.log('There was an error while connecting to the database');
                    titleContainer.innerHTML = oldTitle;
                }
            })
        }
    },
    renderCard: function (id, title) {
        return renderElement(id, title, 'card');
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
        });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for (let card of cards) {
            let cardContainer = document.querySelector(
                `[data-board-id="${card.board_id}"] [data-column-type="${card.status_id}"]`);
            let cardTitle = card.title ? card.title : `new card ${card.id}`;
            let newCard = dom.renderCard(card.id, cardTitle);

            cardContainer.insertAdjacentHTML('beforeend', newCard);
        }

        const removeIcons = document.querySelectorAll('i');

        for (let icon of removeIcons) {
            icon.addEventListener('click', e => dom.removeCard(e))
        }

        const cardElements = document.querySelectorAll('.card');

        addDragAndDrop(cardElements);
    },
    addCard: function (e) {
        const board = e.target.closest('.board');
        const boardId = board.dataset.boardId;

        dataHandler.createNewCard(
            `${board.dataset.boardId}`,
            function (response) {
                if (response.status === 200) {
                    dom.showCard(boardId, response.body['card_id']);
                } else {
                    console.log('There was an error while connecting to the database');
                }
            })
    },
    showCard: function (boardId, cardId) {
        const board = document.querySelector(`[data-board-id="${boardId}"]`);
        const boardColumns = board.querySelector('.board-columns');
        const cardContainer = boardColumns.querySelector('.board-column-content');

        const newCard = dom.renderCard(cardId, `new card ${cardId}`);

        cardContainer.insertAdjacentHTML('beforeend', newCard);

        const removeIcon = document.querySelector(`[data-card-id="${cardId}"] div i`);

        removeIcon.addEventListener('click', e => dom.removeCard(e));
        addDragAndDrop([cardContainer.lastElementChild]);
    },
    removeCard: function (e) {
        e.stopImmediatePropagation();

        const card = e.target.closest('.card');
        const cardId = card.dataset.cardId;

        dataHandler.removeCard(cardId, () => card.remove())
    },
    registerUser: function () {
        dataHandler.registerUser(function (response) {
            if (response.status === 200) {
                console.log('ok') // TODO: handle successful registration here
            } else {
                console.log(response.body['message']);
            }
        })
    }
    // here comes more features
};

function renderElement(id, title, type) {
    // this function can only be called by the renderBoard and renderCard methods of the dom object
    if (type !== 'board' && type !== 'card') {
        throw 'Invalid argument provided for parameter "type"!';
    }

    const source = document.querySelector(`#${type}-template`).innerHTML;
    const templateRenderer = Handlebars.compile(source);

    return templateRenderer({
        id: id,
        title: title
    }).trim();
}

function addDragAndDrop(cards) {
    for (let card of cards) {
        card.draggable = true;
        card.addEventListener('dragstart', e => onDrag(e))
    }

    const containers = document.querySelectorAll('.board-column');

    for (let container of containers) {
        container.addEventListener('dragover', e => allowDrop(e));
        container.addEventListener('drop', e => onDrop(e));
    }
}

function onDrag(e) {
    e.stopImmediatePropagation();

    e.dataTransfer.setData('text', e.target.closest('.card').dataset.cardId);
}

function allowDrop(e) {
    e.preventDefault();
}

function onDrop(e) {
    e.stopImmediatePropagation();
    e.preventDefault();

    const cardId = e.dataTransfer.getData('text');
    const card = document.querySelector(`[data-card-id="${cardId}"]`);

    const targetColumn = e.target.closest('.board-column');
    const board = targetColumn.closest('.board');
    const boardId = board.dataset.boardId;

    const cardContainer = targetColumn.querySelector('.board-column-content');
    const statusId = cardContainer.dataset.columnType;

    dataHandler.updateCardPosition(cardId, boardId, statusId, function (response) {
        if (response.status === 200) {
            cardContainer.appendChild(card);
        } else {
            console.log(response.body['message']);
        }
    });
}