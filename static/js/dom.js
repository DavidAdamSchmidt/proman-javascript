// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        const addBoardButton = document.querySelector(".board-add");
        addBoardButton.addEventListener("click", () => dom.addPublicBoard());
    },
    clearBoardContainer: function () {
        const boardContainer = document.querySelector('.board-container');

        boardContainer.innerHTML = '';
    },
    renderBoard: function (id, title) {
        const source = document.querySelector('#board-template').innerHTML;
        const templateRenderer = Handlebars.compile(source);

        return templateRenderer({
            id: id,
            title: title
        })
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.clearBoardContainer();
            dom.showBoards(boards);
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
        const boardTitles = document.querySelectorAll('.board-title');

        for (let button of buttons) {
            button.addEventListener('click', (e) => dom.addCard(e));
        }

        for (let title of boardTitles) {
            title.addEventListener('click', (e) => dom.renamePublicBoard(e));
        }

    },
    addDragAndDrop: function (cards) {
        for (let card of cards) {
            card.draggable = true;
            card.addEventListener('dragstart', e => dom.drag(e))
        }

        const containers = document.querySelectorAll('.board-column');

        for (let container of containers) {
            container.addEventListener('dragover', e => dom.allowDrop(e));
            container.addEventListener('drop', e => dom.drop(e));
        }
    },
    drag: function (e) {
        e.stopImmediatePropagation();
        e.dataTransfer.setData('text', e.target.firstElementChild.firstElementChild.id);
    },
    allowDrop: function (e) {
        e.preventDefault();
    },
    drop: function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        const cardId = e.dataTransfer.getData('text');
        const cardContainer = document.querySelector(`#${cardId}`).parentElement.parentElement;

        if (e.target.className === 'board-column') {
            e.target.lastElementChild.appendChild(cardContainer);
        } else if (e.target.className === 'board-column-title') {
            e.target.nextElementSibling.appendChild(cardContainer)
        } else {
            let element = e.target;

            while (element.className !== 'board-column-content') {
                element = element.parentElement;
            }
            element.appendChild(cardContainer)
        }
    },
    renderCard: function (id, title) {
        const source = document.querySelector('#card-template').innerHTML;
        const templateRenderer = Handlebars.compile(source);

        return templateRenderer({
            id: id,
            title: title
        }).trim();
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
        });
    },
    addCard: function (e) {
        const cardContainer = e.target.parentElement.nextElementSibling.firstElementChild.lastElementChild;
        const boardId = e.target.parentElement.parentElement.id;
        const newId = document.querySelectorAll('.card').length + 1;
        const newCard = dom.renderCard(newId, `new card ${newId}`);

        cardContainer.insertAdjacentHTML('beforeend', newCard);

        const removeButton = document.querySelector(`#card-${newId}`);

        removeButton.addEventListener('click', e => dom.removeCard(e));
        dom.addDragAndDrop([cardContainer.lastElementChild]);

        dataHandler.createNewCard(
            `${newId}`,
            `${boardId.slice(6)}`,
            function (response) {
                if (response.status !== 200) {
                    console.log('There was an error while connecting to the "database"')
                }
            })
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for (let card of cards) {
            const cardContainer = document.querySelector(`#board-${card.board_id} #column-${card.status_id}`);
            let newCard = dom.renderCard(card.id, card.title);

            cardContainer.insertAdjacentHTML('beforeend', newCard)
        }

        const removeIcons = document.querySelectorAll('.card-remove:first-child i');

        for (let icon of removeIcons) {
            icon.addEventListener('click', e => dom.removeCard(e), )
        }

        const cards_ = document.querySelectorAll('.card');

        dom.addDragAndDrop(cards_);
    },
    removeCard: function (e) {
        e.stopImmediatePropagation();

        const cardId = e.target.id.slice(5);

        dataHandler.removeCard(cardId, function (cardId, response) {
            if (response.status === 200) {
                document.querySelector(`#card-${cardId}`).parentElement.parentElement.remove()
            } else {
                console.log('There was an error during the operation')
            }
        })
    },
    addPublicBoard: function () {

        const boardContainer = document.querySelector(".board-container");
        const newBoardId = document.querySelectorAll(".board").length+1;
        const newBoardTitle = `Board ${newBoardId}`;

        const newBoard = dom.renderBoard(newBoardId, newBoardTitle);

        boardContainer.insertAdjacentHTML("beforeend", newBoard);
        const BoardName = document.querySelector(`#board-${newBoardId} .board-title`);
        const BoardButton = document.querySelector(`#board-${newBoardId} .board-add`);
        console.log(BoardButton);
        BoardName.addEventListener('click', (e) => dom.renamePublicBoard(e));
        BoardButton.addEventListener('click', (e) => dom.addCard(e));

        dataHandler.createNewBoard(
            `${newBoardId}`,
            `${newBoardTitle}`,
            function (response) {
                console.log(response);
            })
    },
    renamePublicBoard: function (e) {
        const oldTitle = e.target.innerHTML;
        let renamedBoardId = e.target.parentElement.parentElement.id.slice(6);
        e.target.innerHTML = `
        <form class="board-submit">
            <input class="board-rename" type="text" placeholder="Press Enter to save your title!" required>
        </form>`;
        let renameField = document.querySelector(".board-rename");
        renameField.focus();
        renameField.parentElement.addEventListener("focusout",function () {
            e.target.innerHTML = oldTitle
        });
        renameField.parentElement.addEventListener('submit', function () {
            dataHandler.renameBoard(renameField.value, renamedBoardId, function (response) {
                console.log(response)
            })
        });
    }
    // here comes more features
};
