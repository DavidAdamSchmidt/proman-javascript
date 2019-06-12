import { dom } from "./dom.js";

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();
    // loads the cards inside a given board
    dom.loadCards(1);
    dom.loadCards(2)

}

init();
