import type { AnyAction } from 'redux';
import type { DefaultActionCreators, DefaultActionTypes } from 'reduxsauce';
import { createActions, createReducer } from 'reduxsauce';
import * as Immutable from 'seamless-immutable';

import type { WantedInfo } from '@/types';

/* ------------- Model interface Create Action ------------- */
interface WantedAction extends AnyAction {}

interface IActionTypes extends DefaultActionTypes {
  SET_WANTEDS: 'setWanteds';
}

interface IActionCreators extends DefaultActionCreators {
  setWanteds: (newWanteds: WantedInfo[]) => AnyAction;
}

type IActions = WantedAction | AnyAction;

export interface WantedState {
  wanteds: WantedInfo[];
}

type ImmutableMyType = Immutable.ImmutableObject<WantedState>;

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions<IActionTypes, IActionCreators>({
  setWanteds: ['newWanteds'],
});

export const WantedTypes = Types;
export default Creators;

const INITIAL_STATE: ImmutableMyType = Immutable.from({
  wanteds: <WantedInfo[]>[],
});

const setWanteds = (
  state: ImmutableMyType,
  { newWanteds }: { newWanteds: WantedInfo[] },
) => state.merge({ wanteds: newWanteds });

export const reducer = createReducer<ImmutableMyType, IActions>(INITIAL_STATE, {
  [Types.SET_WANTEDS]: setWanteds,
});
