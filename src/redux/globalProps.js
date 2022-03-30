import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";

const { Types, Creators } = createActions({
  addGlobalProps: ["options"],
  updateGlobalProps: ["options"],
  logout:[],
  saveGlobalProps: (options) => {
    return (dispatch, getState) => {
      dispatch(Creators.addGlobalProps(options));
    };
  },

  setGlobalProps: (options) => {
    return (dispatch) => {
      dispatch(Creators.updateGlobalProps(options));
    };
  },
});

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  globalProps: {},
});

/* ------------- Reducers ------------- */
export const addGlobalProps = (state, { options }) => {
  return Immutable.merge(state, {
    globalProps: { ...options },
  });
};

export const logout = (state = INITIAL_STATE) => {
  return state.merge({ username: null, password: null })
}

export const updateGlobalProps = (state, { options }) => {
  state = state.setIn(["globalProps", "to"], options.to);
  state = state.setIn(["globalProps", "chatType"], options.chatType);
  state = state.setIn(["globalProps", "name"], options.name);
  return state;
};

/* ------------- Hookup Reducers To Types ------------- */
export const globalPropsReducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_GLOBAL_PROPS]: addGlobalProps,
  [Types.UPDATE_GLOBAL_PROPS]: updateGlobalProps,
  [Types.LOGOUT]: logout,
});

export default Creators;
