import type { AnyAction } from 'redux';
import type { DefaultActionCreators, DefaultActionTypes } from 'reduxsauce';
import { createActions, createReducer } from 'reduxsauce';
import * as Immutable from 'seamless-immutable';

import type { Heart } from '@/types';

/* ------------- Model interface Create Action ------------- */
interface HeartAction extends AnyAction {}

interface IActionTypes extends DefaultActionTypes {
  SET_HEARTS: 'setHearts';
}

interface IActionCreators extends DefaultActionCreators {
  setHearts: (newHearts: Heart[]) => AnyAction;
}

type IActions = HeartAction | AnyAction;

export interface HeartState {
  hearts: Heart[];
}

type ImmutableMyType = Immutable.ImmutableObject<HeartState>;

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions<IActionTypes, IActionCreators>({
  setHearts: ['newHearts'],
});

export const HeartTypes = Types;
export default Creators;

const INITIAL_STATE: ImmutableMyType = Immutable.from({
  hearts: <Heart[]>[],
});

const setHearts = (
  state: ImmutableMyType,
  { newHearts }: { newHearts: Heart[] },
) => state.merge({ hearts: newHearts });

export const reducer = createReducer<ImmutableMyType, IActions>(INITIAL_STATE, {
  [Types.SET_HEARTS]: setHearts,
});
