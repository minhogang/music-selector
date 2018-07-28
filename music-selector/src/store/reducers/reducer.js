import * as actionTypes from '../actions/actionTypes';

const initialState = {
    formData: {
        '1': {amount: 0, composers: {}, error: false, limit: 48},
        '2': {amount: 0, composers: {}, error: false, limit: 79},
        '3': {amount: 0, composers: {}, error: false, limit: 56},
        '4': {amount: 0, composers: {}, error: false, limit: 104},
        '5': {amount: 0, composers: {}, error: false, limit: 159},
        '6': {amount: 0, composers: {}, error: false, limit: 251},
        '7': {amount: 0, composers: {}, error: false, limit: 324},
        '8': {amount: 0, composers: {}, error: false, limit: 272},
        '9': {amount: 0, composers: {},  error: false, limit: 14},
        '10': {amount: 0, composers: {}, error: false, limit: 7},
        'U': {amount: 0, composers: {}, error: false, limit: 28}
    },
    modalShowing: false,
    modalTargetId: 1,
    modalData: {}
}

const addPiece = ( state, action ) => {
    let newState = {...state}
    let value = action.value;
    let grade = action.grade;
    newState.formData[grade].amount = value;
    if (newState.formData[grade].amount > newState.formData[grade].limit) {
        newState.formData[grade].error = true
    } else {
        newState.formData[grade].error = false
    }
    return {
        ...state,
        ...newState
    };
}

const handleConfiguration = ( state, action ) => {
    let newState = {...state};
    newState.modalTargetId = action.grade;
    newState.modalShowing = true;
    return {
        ...state,
        ...newState
    }
}

const handleBackdropClicked = ( state, action ) => {
    let newState = {...state};
    newState.modalShowing = !newState.modalShowing;
    return {
        ...state,
        ...newState
    }
}

const mergeModalAndForm = ( state, action ) => {
    const newState = {...state};
    for (let obj in action.modalData) {
        newState.formData[action.grade].composers[action.modalData[obj].composer] = action.modalData[obj].amount
    }
    return {
        ...state,
        ...newState
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_PIECE: return addPiece( state, action ); //
        case actionTypes.HANDLE_CONFIGURE: return handleConfiguration( state, action ); //
        case actionTypes.BACKDROP_CLICKED: return handleBackdropClicked( state, action ); //
        case actionTypes.MERGE_MODAL_AND_FORM: return mergeModalAndForm( state, action );
        default: return state
    }
}

export default reducer