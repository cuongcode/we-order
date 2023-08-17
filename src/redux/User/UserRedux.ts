import type { AnyAction } from 'redux';
import type { DefaultActionCreators, DefaultActionTypes } from 'reduxsauce';
import { createActions, createReducer } from 'reduxsauce';
import * as Immutable from 'seamless-immutable';

import type { User } from '@/types';

/* ------------- Model interface Create Action ------------- */
interface UserAction extends AnyAction {}

interface IActionTypes extends DefaultActionTypes {
  SET_CURRENT_USER: 'setCurrentUser';
  SET_SHOP_OWNER: 'setShopOwner';
}

interface IActionCreators extends DefaultActionCreators {
  setCurrentUser: (newUser: User | null) => AnyAction;
  setShopOwner: (newShopOwner: User | null) => AnyAction;
}

type IActions = UserAction | AnyAction;

export interface UserState {
  currentUser: User | null;
  shopOwner: User | null;
}

type ImmutableMyType = Immutable.ImmutableObject<UserState>;

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions<IActionTypes, IActionCreators>({
  setCurrentUser: ['newUser'],
  setShopOwner: ['newShopOwner'],
});

export const UserTypes = Types;
export default Creators;

const INITIAL_STATE: ImmutableMyType = Immutable.from({
  currentUser: <User | null>null,
  shopOwner: <User | null>null,
});

const setCurrentUser = (
  state: ImmutableMyType,
  { newUser }: { newUser: User | null },
) => state.merge({ currentUser: newUser });

const setShopOwner = (
  state: ImmutableMyType,
  { newShopOwner }: { newShopOwner: User | null },
) => state.merge({ shopOwner: newShopOwner });

export const reducer = createReducer<ImmutableMyType, IActions>(INITIAL_STATE, {
  [Types.SET_CURRENT_USER]: setCurrentUser,
  [Types.SET_SHOP_OWNER]: setShopOwner,
});
