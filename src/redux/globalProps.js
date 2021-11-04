import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";

const { Types, Creators } = createActions({
  updateGlobalProps: ["options"],
  saveGlobalProps: (options) => {
    return (dispatch, getState) => {
      dispatch(Creators.updateGlobalProps(options));
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

/* ------------- Hookup Reducers To Types ------------- */
export const globalPropsReducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_GLOBAL_PROPS]: updateGlobalProps,
});

export default Creators;
