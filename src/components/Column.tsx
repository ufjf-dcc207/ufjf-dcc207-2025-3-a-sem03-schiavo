import { useState } from "react";
import type { Card } from "../types";
import CardItem from "./CardItem";

interface ColumnProps {
  title: string;
  cards: Card[];
  onDropCard: (cardId: string, newColumn: string) => void;
  onRemoveCard: (columnName: string, cardId: string) => void;
  onAddCard: (title: string, columnName: string) => void;
}

export default function Column({ title, cards, onDropCard, onRemoveCard, onAddCard }: ColumnProps) {

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    onDropCard(cardId, title);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCard = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAddCard(trimmed, title);
    setNewTitle("");
    setIsAdding(false);
  }

  return (
    <div className="column" onDrop={handleDrop} onDragOver={handleDragOver}>
      <h2>{title}</h2>
      {title === "Backlog" && ( 
        <>
          {!isAdding ? (
          <button className="add-card-btn" onClick={() => setIsAdding(true)}>
            + Adicionar card
          </button>
          ): (
          <div className="add-card-form">
            <input
              type="text"
              placeholder="Título"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
              autoFocus
            />
            <div className="form-actions">
              <button onClick={handleAddCard}>Adicionar</button>
              <button className="cancel" onClick={() => setIsAdding(false)}>Cancelar</button>
            </div>
          </div>
          )}
        </>
      )}
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onDragStart={(e, id) => e.dataTransfer.setData("cardId", id)}
          onRemove={() => onRemoveCard(title, card.id)} // botão de remover
        />
      ))}
    </div>
  );
};
