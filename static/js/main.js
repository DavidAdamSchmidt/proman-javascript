import { dom } from "./dom.js";

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();
    // loads the cards inside a given board
    setTimeout(function () {
        const boards = document.querySelectorAll('section');

        for (let i = 1; i <= boards.length; i++) {
            dom.loadCards(i);
        }
    }, 100);
}

init();
