
export interface Card {
    id: string;
    title: string;
};

export interface Columns {
    [key: string]: Card[];
}