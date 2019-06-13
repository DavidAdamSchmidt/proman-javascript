// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        const addBoardButton = document.querySelector(".board-add");
        addBoardButton.addEventListener("click", (e) => dom.addPublicBoard(e));
    },
    clearBoardContainer: function () {
        const boardContainer = document.querySelector('.board-container');

        boardContainer.innerHTML = '';
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
            let outerHtml = `
            <section class="board" id="board-${board.id}">
                <div class="board-header"><span class="board-title">${board.title}</span>
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="board-columns">
                    <div class="board-column">
                        <div class="board-column-title">New</div>
                        <div class="board-column-content" id="column-new"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">In progress</div>
                        <div class="board-column-content" id="column-in-progress"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Testing</div>
                        <div class="board-column-content" id="column-testing"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Done</div>
                        <div class="board-column-content" id="column-done"></div>
                    </div>
                </div>
            </section>`;
            boardContainer.insertAdjacentHTML('beforeend', outerHtml);
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
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
        });
    },
    addCard: function (e) {
        const cardContainer = e.target.parentElement.nextElementSibling.firstElementChild;
        console.log(cardContainer);
        const boardId = e.target.parentElement.parentElement.id;
        const newId = document.querySelectorAll('.card').length + 1;

        const outerHTML = `
        <div class="card">
            <div class="card-remove"><i id="card-${newId}" class="fas fa-trash-alt"></i></div>
            <div class="card-title">new card ${newId}</div>
        </div>`;

        cardContainer.insertAdjacentHTML('beforeend', outerHTML);

        const removeButton = document.querySelector(`#card-${newId}`);

        removeButton.addEventListener('click', e => dom.removeCard(e));

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
            let outerHTML = `
            <div class="card">
                <div class="card-remove"><i id="card-${card.id}" class="fas fa-trash-alt"></i></div>
                <div class="card-title">${card.title}</div>
            </div>`;

            cardContainer.insertAdjacentHTML('beforeend', outerHTML)
        }

        const removeIcons = document.querySelectorAll('.card-remove:first-child i');

        for (let icon of removeIcons) {
            icon.addEventListener('click', e => dom.removeCard(e), )
        }
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

    addPublicBoard: function (e) {

        const boardContainer = document.querySelector(".board-container");
        const newBoardId = document.querySelectorAll(".board").length+1;
        const newBoardTitle = `Board ${newBoardId}`;

        const outerHTML = `
        <section class="board" id="board-${newBoardId}">
                <div class="board-header"><span class="board-title">${newBoardTitle}</span>
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="board-columns">
                    <div class="board-column">
                        <div class="board-column-title">New</div>
                        <div class="board-column-content" id="column-new"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">In progress</div>
                        <div class="board-column-content" id="column-in-progress"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Testing</div>
                        <div class="board-column-content" id="column-testing"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Done</div>
                        <div class="board-column-content" id="column-done"></div>
                    </div>
                </div>
            </section>\
            `;

        boardContainer.insertAdjacentHTML("beforeend", outerHTML);
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
        e.target.innerHTML = `<form class="board-submit"><input class="board-rename" type="text" style="width: 100px"></form>`;
        let renameField = document.querySelector(".board-rename");
        renameField.focus();
        renameField.parentElement.addEventListener("focusout",function () {e.target.innerHTML = oldTitle});
        renameField.parentElement.addEventListener('submit', function () {dataHandler.renameBoard(renameField.value, renamedBoardId, function (response) {console.log(response)})});
    }
    // here comes more features
};
