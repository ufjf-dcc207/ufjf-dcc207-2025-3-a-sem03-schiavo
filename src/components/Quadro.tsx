import { useState } from "react";
import { useEffect } from "react";
import Column from "./Column";
import type { Card, Columns } from "../types";

const LOCAL_STORAGE_KEY = "123456";


function garantCreated(cols: Columns): Columns {
  const fixed: Columns = {};

  for (const colName in cols) {
    const cards = cols[colName] ?? [];
    fixed[colName] = cards.map((card: any) => ({
      ...card,
      createDate: card.createDate ?? Date.now()
    }));
  };
  return fixed;
};

export default function App(){

  const [columns, setColumns] = useState<Columns>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);

    const baseColumns: Columns = {
      "Backlog": [],
      "Em Desenvolvimento": [],
      "Em Revisão": [],
      "Em Teste": [],
      "Concluído": []
    };

    if (!saved) {
      return baseColumns;
    }

    try {
      const parsed = JSON.parse(saved) as Columns;
      return garantCreated({...baseColumns, ...parsed});
    } catch {
      return baseColumns;
    }
  });
  
  const [isLocked, setLocked] = useState(false);

  useEffect(() => {
    const count = columns["Em Desenvolvimento"]?.length ?? 0;
    setLocked(count >= 5);
  }, [columns["Em Desenvolvimento"]]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

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

      const movedCard: any = {};
      movedCard.id = draggedCard.id;
      movedCard.title = draggedCard.title;
      movedCard.createDate = Date.now();

      updated[newColumn].push(movedCard);
      setColumns(updated);
    }

  };

  const handleAddCard = (title: string, columnName: string) => {
    const newCard: Card = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      createDate: Date.now(),
    } as any;

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
