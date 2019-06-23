// It uses data_handler.js to visualize elements
import {dataHandler} from './data_handler.js';

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        const addBoardButton = document.querySelector('.board-add');

        addBoardButton.addEventListener('click', e => dom.addBoard(e));
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
            let newBoard = dom.renderBoard(board.id, board.title);

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

        const boardContainer = document.querySelector('.board-container');

        const boardId = document.querySelectorAll('.board').length + 1;
        const boardTitle = `Board ${boardId}`;
        const newBoard = dom.renderBoard(boardId, boardTitle);

        boardContainer.insertAdjacentHTML('beforeend', newBoard);

        const titleContainer = document.querySelector(`#board-${boardId} .board-title`);
        const addCardButton = document.querySelector(`#board-${boardId} .board-add`);

        titleContainer.addEventListener('click', e => dom.renameBoard(e));
        addCardButton.addEventListener('click', e => dom.addCard(e));

        dataHandler.createNewBoard(
            `${boardId}`,
            `${boardTitle}`,
            response => console.log(response)
        );
    },
    renameBoard: function (e) {
        const board = e.target.closest('.board');

        const oldTitle = e.target.innerHTML;
        e.target.innerHTML = '';

        const formTemplate = document.querySelector('#board-rename-template');
        const formTemplateClone = document.importNode(formTemplate.content, true);

        e.target.appendChild(formTemplateClone);

        const renameField = document.querySelector('.board-rename');
        const form = renameField.closest('form');

        renameField.focus();

        form.addEventListener('focusout',function () {
            e.target.innerHTML = oldTitle;
        });

        form.addEventListener('submit', function () {
            dataHandler.renameBoard(
                renameField.value,
                board.dataset.boardId,
                response => console.log(response)
            );
        });
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
            let newCard = dom.renderCard(card.id, card.title);

            cardContainer.insertAdjacentHTML('beforeend', newCard);
        }

        const removeIcons = document.querySelectorAll('i');

        for (let icon of removeIcons) {
            icon.addEventListener('click', e => dom.removeCard(e), )
        }

        cards = document.querySelectorAll('.card');

        addDragAndDrop(cards);
    },
    addCard: function (e) {
        const board = e.target.closest('.board');
        const boardColumns = board.querySelector('.board-columns');
        const cardContainer = boardColumns.querySelector('.board-column-content');

        const cardId = document.querySelectorAll('.card').length + 1;
        const newCard = dom.renderCard(cardId, `new card ${cardId}`);

        cardContainer.insertAdjacentHTML('beforeend', newCard);

        const removeIcon = document.querySelector(`[data-card-id="${cardId}"] div i`);

        removeIcon.addEventListener('click', e => dom.removeCard(e));
        addDragAndDrop([cardContainer.lastElementChild]);

        dataHandler.createNewCard(
            `${cardId}`,
            `${board.dataset.boardId}`,
            function (response) {
                if (response.status !== 200) {
                    console.log('There was an error while connecting to the "database"')
                }
            }
        )
    },
    removeCard: function (e) {
        e.stopImmediatePropagation();

        const card = e.target.closest('.card');
        const cardId = card.dataset.cardId;

        dataHandler.removeCard(cardId, function (cardId, response) {
            if (response.status === 200) {
                card.remove();
            } else {
                console.log('There was an error during the operation');
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
    const cardContainer = targetColumn.querySelector('.board-column-content');

    cardContainer.appendChild(card);
}