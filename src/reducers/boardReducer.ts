import type { Card, Columns } from "../types";

export const LOCAL_STORAGE_KEY = "123456";

export type BoardAction = | {type: "ADD_CARD"; title: string; columnName: string} | {type: "DROP_CARD"; cardId: string; newColumn: string} | {type: "REMOVE_CARD"; columnName: string; cardId: string};

export function createBaseColumns(): Columns {
    return {
        "Backlog": [],
        "Em Desenvolvimento": [],
        "Em Revisão": [],
        "Em Teste": [],
        "Concluído": [],
    };
};


export function garantCreated(cols: Columns): Columns {
    const fixed: Columns = {};

    for (const colName in cols) {
        const cards = cols[colName] ?? [];
        const newCards: Card[] = [];

        for (let i = 0; i < cards.length; i++) {
            const c: any = cards[i];
            const card: any = {};
            card.id = c.id;
            card.title = c.title;
            card.createDate = c.createDate ?? Date.now();
            newCards.push(card);
        }

        fixed[colName] = newCards;
    }

    return fixed;
};


export function initBoard(): Columns {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const baseColumns = createBaseColumns();

    if (!saved) {
        return baseColumns;
    }

    try {
        const parsed = JSON.parse(saved) as Columns;
        return garantCreated({...baseColumns, ...parsed});
    } catch {
        return baseColumns;
    }
};

export function boardReducer(state: Columns, action: BoardAction): Columns {

    if (action.type === "ADD_CARD") {

        const newCard: Card = {
            id: Math.random().toString(36).substring(2, 9),
            title: action.title,
            createDate: Date.now(),
        } as any;
        

        const updated: Columns = {};

        for (const col in state) {
            const oldCards = state[col];
            const newCards: Card[] = [];
            for (let i = 0; i < oldCards.length; i++) {
                newCards.push(oldCards[i]);
            }
            updated[col] = newCards;
        }

        if (!updated[action.columnName]) {
            updated[action.columnName] = [];
        }

        updated[action.columnName].push(newCard);
        return updated;
    }

    if (action.type === "DROP_CARD") {
        let draggedCard: Card | null = null;
        const updated: Columns = {};

        for (const colName in state) {
            const oldCards = state[colName];
            const newCards: Card[] = [];

            for (let i = 0; i < oldCards.length; i++) {
                const card = oldCards[i];
                if (card.id === action.cardId) {
                    draggedCard = card;
                } else {
                    newCards.push(card);
                }
            }

            updated[colName] = newCards;
        }

        if (draggedCard !== null) {
            if (!updated[action.newColumn]) {
                updated[action.newColumn] = [];
            }

            const moveCard: any = {};
            moveCard.id = draggedCard.id;
            moveCard.title = draggedCard.title;
            moveCard.createDate = Date.now();

            updated[action.newColumn].push(moveCard);
        }

        return updated;
    }

    const updated: Columns = {};

    for (const col in state) {
        const oldCards = state[col];
        const newCards: Card[] = [];

        for (let i = 0; i < oldCards.length; i++) {
            const card = oldCards[i];

            if (col === action.columnName && card.id === action.cardId) {
                continue;
            }
            newCards.push(card);
        }

        updated[col] = newCards;
    }

    return updated;
}