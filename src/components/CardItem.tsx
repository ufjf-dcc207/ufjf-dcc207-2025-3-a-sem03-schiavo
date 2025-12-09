import type { Card } from '../types';
import { useState } from 'react';

interface CardItemProps {
  card: Card;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, cardId: string) => void;
  onRemove: () => void;
}

export default function CardItem({ card, onDragStart, onRemove }: CardItemProps) {

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className="card"
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onDoubleClick={() => setIsEditing(true)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "8px",
        backgroundColor: "#fff",
      }}
    >
      {!isEditing ? (
        <p style={{ margin: 0}}>{card.title}</p>
      ): (
        <input
          autoFocus
          defaultValue={card.title}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setIsEditing(false);
          }}
          style={{
            flex: 1,
            marginRight: "8px",
            padding: "4px 6px",
          }}
          />
      )}

      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          color: "red",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ❌
      </button>
    </div>
  );
};