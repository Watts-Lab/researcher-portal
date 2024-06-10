import React from "react";
import dynamic from "next/dynamic.js";

// import { Element } from "./../../../.././deliberation-empirica/client/src/elements/Element.jsx";
import {
  usePlayer,
  useGame,
  useStage,
} from "./../../../.././deliberation-empirica/client/node_modules/@empirica/core/mocks";

const Element = dynamic(
  () =>
    import(
      "./../../../.././deliberation-empirica/client/src/elements/Element.jsx"
    ).then((mod) => mod.Element) as any,
  {
    ssr: false,
  }
);

interface DelibElement {
  element: any; // Replace 'any' with the appropriate type for 'element'
  onSubmit: any; // Replace 'any' with the appropriate type for 'onSubmit'
}

export default function RenderDelibElement(
  element: DelibElement,
  onSubmit: any
): JSX.Element {
  const player = usePlayer();
  const game = useGame();
  const stage = useStage();
  console.log("player called from RenderDelibElement ", player);
  // TODO: Set necessary stuff in player, game, and stage

  return (
    <div>
      {/* <DynamicElement */}
      <Element element={element.element as any} onSubmit={element.onSubmit} />
    </div>
  );
}
