import { useState } from "react";
import Column from "./Column";
import type { Card, Columns } from "../types";

export default function App(){

  const [columns, setColumns] = useState<Columns>({
    "Backlog": [],
    "Em Desenvolvimento": [],
    "Em Revisão": [],
    "Em Teste": [],
    "Concluído": []
  });

  const [isLocked, setLocked] = useState(false);

  const resetLock = (cols: Columns) => {
    const count = cols["Em Desenvolvimento"]?.length ?? 0;
    setLocked(count >= 5);
  }

  const handleDropCard = (cardId: string, newColumn: string) => {
    let draggedCard: Card | null = null;

    const updated: Columns = {};

    for (const colName in columns) {
      const oldCards = columns[colName];
      const newCards: Card[] = [];

      for (let i = 0; i < oldCards.length; i++) {
        const card = oldCards[i];

        if (card.id === cardId) {
          draggedCard = card;
        } else {
          newCards.push(card);
        }
      }
      updated[colName] = newCards;
    }

    if (draggedCard !== null) {
      if (!updated[newColumn]) {
        updated[newColumn] = []
      }

      updated[newColumn].push(draggedCard);
      setColumns(updated);
      resetLock(updated);
    }

  };

  const handleAddCard = (title: string, columnName: string) => {
    const newCard: Card = {
      id: Math.random().toString(36).substring(2, 9),
      title,
    };

    const updated: Columns = {};

    for (const col in columns) {
      const oldCards = columns[col];
      const newCards: Card[] = [];

      for (let i = 0; i < oldCards.length; i++) {
        newCards.push(oldCards[i]);
      }

      updated[col] = newCards;
    }

    if (!updated[columnName]) {
      updated[columnName] = [];
    }

    updated[columnName].push(newCard);

    setColumns(updated);
    resetLock(updated);
  }

  const handleRemoveCard = (columnName: string, cardId: string) => {

    const updated: Columns = {};

    for (const col in columns) {
      const oldCards = columns[col];
      const newCards: Card[] = [];

      for (let i = 0; i < oldCards.length; i++) {
        const card = oldCards[i];
        if (col === columnName && card.id === cardId) {
          continue;
        }

        newCards.push(card);
      }
      updated[col] = newCards;
    }

    setColumns(updated);
    resetLock(updated);

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
