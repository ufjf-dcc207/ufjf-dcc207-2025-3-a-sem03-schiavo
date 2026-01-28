import { useEffect, useReducer, useState } from "react";
import Column from "./Column";

import { boardReducer, initBoard, LOCAL_STORAGE_KEY } from "../reducers/boardReducer";


export default function App(){

  const [columns, dispatch] = useReducer(boardReducer, undefined as any, initBoard);

  const [isLocked, setLocked] = useState(false);

  useEffect(() => {
    const count = columns["Em Desenvolvimento"]?.length ?? 0;
    setLocked(count >= 5);
  }, [columns["Em Desenvolvimento"]]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  const handleDropCard = (cardId: string, newColumn: string) => {

    if (newColumn === "Em Desenvolvimento" && isLocked) {
      return;
    }

    dispatch({type: "DROP_CARD", cardId, newColumn});

  };

  const handleAddCard = (title: string, columnName: string) => {

    dispatch({type: "ADD_CARD", title, columnName});

  }

  const handleRemoveCard = (columnName: string, cardId: string) => {

    dispatch({type: "REMOVE_CARD", columnName, cardId});

  };

  return (
    <div className="board-container">
        <div className="board-painel">
            <div className="board-header">
                <h1>TAREFAS</h1>
            </div>
            <div className="board">
            {Object.entries(columns).map(([colName, cards]) => (
                <Column
                key={colName}
                title={colName}
                cards={cards}
                onDropCard={handleDropCard}
                onRemoveCard={handleRemoveCard}
                onAddCard={handleAddCard}
                isLocked={colName === "Em Desenvolvimento" ? isLocked : false}
                />
            ))}
            </div>
        </div>
    </div>
  );
};
