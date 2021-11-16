import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";

const { Types, Creators } = createActions({
  updateGlobalProps: ["options"],
  updateGlobalProps2: ["options"],
  saveGlobalProps: (options) => {
    return (dispatch, getState) => {
      dispatch(Creators.updateGlobalProps(options));
    };
  },

  setGlobalProps: (options) => {
    return (dispatch) => {
      dispatch(Creators.updateGlobalProps2(options));
    };
  },
});

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  globalProps: {},
});

/* ------------- Reducers ------------- */
export const updateGlobalProps = (state, { options }) => {
  return Immutable.merge(state, {
    globalProps: { ...options },
  });
};

export const updateGlobalProps2 = (state, { options }) => {
  state = state.setIn(["globalProps", "to"], options.to);
  state = state.setIn(["globalProps", "chatType"], options.chatType);
  return state;
};

/* ------------- Hookup Reducers To Types ------------- */
export const globalPropsReducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_GLOBAL_PROPS]: updateGlobalProps,
  [Types.UPDATE_GLOBAL_PROPS2]: updateGlobalProps2,
});

export default Creators;
