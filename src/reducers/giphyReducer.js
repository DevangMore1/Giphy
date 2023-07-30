
const initialState = {
    data : [],
};

const giphyReducer = (state = initialState,action) =>{
    switch(action.type){
        case 'FETCH_GIPHY':
            return { ...state, data : action.payload}
        default :
        return state;
    }
}

export default giphyReducer;