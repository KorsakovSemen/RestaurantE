import {createStore, combineReducers, applyMiddleware} from 'redux';
import { Dishes } from './dishes';
import { Comments } from './comments';
import { Promotions } from './promotions';
import { Leaders } from './leaders';
import { createForms } from "react-redux-form";
import thunk from "redux-thunk";
import logger from "redux-logger"
import {InitialFeedback, InitialComment} from "./forms";

export const ConfigureStore = () => {

    const store = createStore(
        combineReducers({
            dishes: Dishes,
            comments: Comments,
            promotions: Promotions,
            leaders: Leaders,
            ...createForms({
                feedback: InitialFeedback,
                comment: InitialComment
            })
        }),
        applyMiddleware(thunk, logger));
    console.log(store);
    return store;

};

