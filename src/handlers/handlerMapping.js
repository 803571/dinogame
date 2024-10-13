import { gameEnd, gameStart } from "./game.handler.js";
import { moveStageHandler } from "./stages.handler.js";
import { handleItemPickup } from "./item.handler.js";

const handlerMappings = {
    2: gameStart,
    3: gameEnd,
    11: moveStageHandler,
    21: handleItemPickup,
};

export default handlerMappings

