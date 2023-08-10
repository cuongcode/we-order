import type { AnyAction } from 'redux';
import type { DefaultActionCreators, DefaultActionTypes } from 'reduxsauce';
import { createActions, createReducer } from 'reduxsauce';
import * as Immutable from 'seamless-immutable';

import type { User } from '@/types';

/* ------------- Model interface Create Action ------------- */
interface UserAction extends AnyAction {}

interface IActionTypes extends DefaultActionTypes {
  SET_CURRENT_USER: 'setCurrentUser';
}

interface IActionCreators extends DefaultActionCreators {
  setCurrentUser: (newUser: User | null) => AnyAction;
}

type IActions = UserAction | AnyAction;

export interface UserState {
  currentUser: User | null;
}

type ImmutableMyType = Immutable.ImmutableObject<UserState>;

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions<IActionTypes, IActionCreators>({
  setCurrentUser: ['newUser'],
});

export const UserTypes = Types;
export default Creators;

const INITIAL_STATE: ImmutableMyType = Immutable.from({
  currentUser: <User | null>null,
});

const setCurrentUser = (
  state: ImmutableMyType,
  { newUser }: { newUser: User | null },
) => state.merge({ currentUser: newUser });

export const reducer = createReducer<ImmutableMyType, IActions>(INITIAL_STATE, {
  [Types.SET_CURRENT_USER]: setCurrentUser,
});
