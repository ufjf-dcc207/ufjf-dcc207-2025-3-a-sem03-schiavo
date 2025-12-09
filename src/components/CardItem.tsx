// Esse arquivo irá conter os cards

import type { Card } from '../types';


/**
 * Essa função "onDragStart", é acionada quando arrasta um elemento.
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event
 * https://dev.to/cristiansifuentes/mastering-mouse-events-in-react-typescript-click-drag-hover-and-beyond-21a6
*/

interface CardItemProps {
  card: Card;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, cardId: string) => void;
  onRemove: () => void; // 🆕
}

const CardItem = ({ card, onDragStart, onRemove }: CardItemProps) => {
  return (
    <div
      className="card"
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
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
      <p style={{ margin: 0 }}>{card.title}</p>
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

export default CardItem;