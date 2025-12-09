import { useState } from "react";
import Column from "./Column";
import type { Card, Columns } from "../types";

export default function App(){

  const [columns, setColumns] = useState<Columns>({
    "Backlog": [{ id: "1", title: "Estudar nova matéria de PO" },
      { id: "2", title: "Estudar para prova de Testes de Software" },
      { id: "3", title: "Terminar de ler didascalicon" }
    ],
    "Em Desenvolvimento": [],
    "Em Revisão": [],
    "Em Teste": [],
    "Concluído": []
  });

  const handleDropCard = (cardId: string, newColumn: string) => {
    let draggedCard: Card | null = null;

    const updated: Columns = Object.fromEntries(
      Object.entries(columns).map(([colName, cards]) => {
        const filtered = cards.filter((c) => {
          if (c.id === cardId) draggedCard = c;
          return c.id !== cardId;
        });
        return [colName, filtered];
      })
    );

    if (draggedCard) {
      updated[newColumn] = [...(updated[newColumn] || []), draggedCard];
      setColumns(updated);
    }
  };

  const handleAddCard = (title: string, columnName: string) => {
    const newCard: Card = {
      id: Math.random().toString(36).substring(2, 9),
      title,
    };
    const updated = {
      ...columns,
      [columnName]: [...columns[columnName], newCard],
    };
    setColumns(updated);
  }

  const handleRemoveCard = (columnName: string, cardId: string) => {
    const updated: Columns = {
      ...columns,
      [columnName]: columns[columnName].filter((c) => c.id !== cardId)
    };
    setColumns(updated);
  };

  return (
    <div className="board-container">
        <div className="board-painel">
            <div className="board-header">
                <h1>Quadro Exemplo</h1>
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
                />
            ))}
            </div>
        </div>
    </div>
  );
};
