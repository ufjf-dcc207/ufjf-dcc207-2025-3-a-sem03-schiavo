import type { Card } from '../types';
import { useMemo, useState } from 'react';
import { useEffect } from 'react';

interface CardItemProps {
  card: Card;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, cardId: string) => void;
  onRemove: () => void;
}

function getDays(createDate: number, now: number) {
  const daysInMilliseconds = 5 * 1000;
  return Math.floor((now - createDate) / daysInMilliseconds);
}

function getCardColor(days: number) {
  if (days >= 6) {
    return '#ffaea0';
  } else if (days >= 3) {
    return '#fdef9c';
  }
  return 'white';
}

export default function CardItem({ card, onDragStart, onRemove }: CardItemProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(card.title);

  const [now, setNow] = useState(() => Date.now());

  const createDate = useMemo(() => (card as any).createDate ?? Date.now(), [card]);

  useEffect(() => {
   const id = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(id);
  }, []);

  const days = useMemo(() => getDays(createDate, now), [createDate, now]);
  const cardColor =  useMemo(() => getCardColor(days), [days]);


  return (
    <div
      className="card"
      draggable
      title={`${days} dia(s)`}
      onDragStart={(e) => onDragStart(e, card.id)}
      onDoubleClick={() => setIsEditing(true)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        border: "2px solid #000000",
        borderRadius: "8px",
        marginBottom: "8px",
        backgroundColor: cardColor,
      }}
    >

      {!isEditing ? (
        <p style={{ margin: 0}}>{content}</p>
      ): (
        <input
          autoFocus
          value={content}
          defaultValue={card.title}
          onBlur={() => {
            if (content.trim() === "") {
              setContent(card.title);
            }
            setIsEditing(false)}}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (content.trim() === "") {
                setContent(card.title)
              }
              setIsEditing(false);
            }
          }}
          onChange={(e) => {
            setContent(e.target.value);
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