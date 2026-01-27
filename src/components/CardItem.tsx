import type { Card } from '../types';
import { useMemo, useState } from 'react';
import { useEffect } from 'react';

interface CardItemProps {
  card: Card;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, cardId: string) => void;
  onRemove: () => void;
}

function getDays(createDate: number, now: number) {
  const daysInMilliseconds = 24*60*60*1000;
  return Math.floor((now - createDate) / daysInMilliseconds);
}

function getColor(days: number) {
  if (days >= 6) {
    return 'red';
  } else if (days >= 3) {
    return 'yellow';
  }
  return 'green';
}

export default function CardItem({ card, onDragStart, onRemove }: CardItemProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(card.title);

  const [now, setNow] = useState(() => Date.now());

  const createDate = (card as any).createdAt ?? Date.now();

  useEffect(() => {

    const id = setInterval(() => {
      setNow(Date.now()), 10_000
    }, 30_000);

    return () => clearInterval(id);
  }, []);

  const days = useMemo(() => getDays(createDate, now), [createDate, now]);
  const color =  useMemo(() => getColor(days), [days]);


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

      <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: color,
            border: "1px solid rgba(0,0,0,0.15)",
            cursor: "default",
          }}
        />
  
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