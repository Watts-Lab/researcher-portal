import React from "react";
import {Element} from "./../../../.././deliberation-empirica/client/src/elements/Element.jsx";
import {usePlayer, useGame, useStage} from "./../../../.././deliberation-empirica/client/node_modules/@empirica/core/mocks"

export default function RenderDelibElement(element, onSubmit) {
    const player = usePlayer();
    const game = useGame();
    const stage = useStage();
    console.log(player)
    //TODO set necessary stuff in player, game, and stage

    return (
        <Element element={element} onSubmit={onSubmit} />
    )
}