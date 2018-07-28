import * as actionTypes from './actionTypes';

export const addPiece = (value, grade) => {
    return {
        type: actionTypes.ADD_PIECE,
        value: value,
        grade: grade
    }
}

export const backdropClicked = () => {
    return {
        type: actionTypes.BACKDROP_CLICKED
    }
}

export const handleConfigure = (e, i) => {
    return {
        type: actionTypes.HANDLE_CONFIGURE,
        eventObject: e,
        grade: i,
    }
}

export const mergeData = (grade, modalData) => {
    return {
        type: actionTypes.MERGE_MODAL_AND_FORM,
        grade: grade,
        modalData: modalData
    }
}
