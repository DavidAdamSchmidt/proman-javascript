// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
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

        for (let button of buttons) {
            button.addEventListener('click', (e) => dom.addCard(e));
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
        const boardId = e.target.parentElement.parentElement.id;
        const newId = document.querySelectorAll('.card').length + 1;

        const outerHTML = `
        <div class="card">
            <div class="card-remove" id="card-${newId}"><i class="fas fa-trash-alt"></i></div>
            <div class="card-title">new card ${newId}</div>
        </div>`;

        cardContainer.insertAdjacentHTML('beforeend', outerHTML);

        dataHandler.createNewCard(
            `${newId}`,
            `${boardId.slice(6)}`,
            function (response) {
                console.log(response);
            })
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for (let card of cards) {


            const cardContainer = document.querySelector(`#board-${card.board_id} #column-${card.status_id}`);
            let outerHTML = `
            <div class="card">
                <div class="card-remove" id="card-${card.id}"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title">${card.title}</div>
            </div>`;

            cardContainer.insertAdjacentHTML('beforeend', outerHTML)
        }
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

        dataHandler.createNewBoard(
            `${newBoardId}`,
            `${newBoardTitle}`,
            function (response) {
                console.log(response);
            })
    }

    // here comes more features
};
