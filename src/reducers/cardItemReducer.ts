export type CardItemState = {
    isEditing: boolean;
    content: string;
    now: number;
};


export type CardItemAction = | {type: "START_EDIT"} | {type: "STOP_EDIT"} | {type: "SET_CONTENT"; value: string} | {type: "RESET_CONTENT"; value: string} | {type: "TICK"; now: number};


export function initCardItemState(title: string): CardItemState {
    return {isEditing: false, content: title, now: Date.now()};
}


export function cardItemReducer(
    state: CardItemState,
    action: CardItemAction
): CardItemState {

    if (action.type === "START_EDIT") {
        return { isEditing: true, content: state.content, now: state.now};
    }

    if (action.type === "STOP_EDIT") {
        return {isEditing: false, content: state.content, now: state.now};
    }

    if (action.type === "SET_CONTENT") {
        return {isEditing:state.isEditing, content: action.value, now: state.now};
    }

    if (action.type === "RESET_CONTENT") {
        return {isEditing: state.isEditing, content: action.value, now: state.now};
    }

    return {isEditing: state.isEditing, content: state.content, now: action.now};
}