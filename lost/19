import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { messageReducer } from "./message";
import { sessionReducer } from "./session";
import { globalPropsReducer } from "./globalProps";
import { threadReducer } from "./thread"
const logger = createLogger();
const rootReducer = combineReducers({
  global: globalPropsReducer,
  session: sessionReducer,
  message: messageReducer,
  thread: threadReducer,
});
const middlewares = [thunk, logger];
const enhancers = [];
enhancers.push(applyMiddleware(...middlewares));


const resetReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined
  }
  return rootReducer(state, action)
}
const uikit_store = createStore(resetReducer, compose(...enhancers));
window.uikit_store = uikit_store;

export default uikit_store;
