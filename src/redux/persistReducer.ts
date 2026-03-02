import { combineReducers } from 'redux'; 
import cartReducer from './slices/cartSlice'; 

const themeInitialState = {
    theme: "light",
};

const themeReducer = (state = themeInitialState, action) => {
    switch (action.type) {
        case "SET_THEME":
            return { ...state, theme: action.payload };
        default:
            return state;
    }
}

export const rawPersistedReducer = combineReducers({
    cart: cartReducer, 
    theme: themeReducer,
});