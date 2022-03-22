import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";

const { Types, Creators } = createActions({
  updateGlobalProps: ["options"],
  updateGlobalProps2: ["options"],
  logout:[],
  saveGlobalProps: (options) => {
    return (dispatch, getState) => {
      dispatch(Creators.updateGlobalProps(options));
    };
  },

  setGlobalProps: (options) => {
    console.log(options, 'options==setGlobalProps')
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

export const logout = (state = INITIAL_STATE) => {
  return state.merge({ username: null, password: null })
}

export const updateGlobalProps2 = (state, { options }) => {
  console.log(options, 'options==updateGlobalProps2')
  let presenceObj = state.globalProps.presenceExt?.asMutable() || {}
  state = state.setIn(["globalProps", "to"], options.to);
  state = state.setIn(["globalProps", "chatType"], options.chatType);
  state = state.setIn(["globalProps", "presenceExt"], {...presenceObj, ...options.presenceExt});
  return state;
};

/* ------------- Hookup Reducers To Types ------------- */
export const globalPropsReducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_GLOBAL_PROPS]: updateGlobalProps,
  [Types.UPDATE_GLOBAL_PROPS2]: updateGlobalProps2,
  [Types.LOGOUT]: logout
});

export default Creators;
