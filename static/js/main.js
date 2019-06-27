import { dom } from './dom.js';

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards(function () {
        const boards = document.querySelectorAll('.board');

        for (let board of boards) {
            dom.loadCards(board.dataset.boardId)
        }
    });
}

init();
