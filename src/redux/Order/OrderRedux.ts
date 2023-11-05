import type { AnyAction } from 'redux';
import type { DefaultActionCreators, DefaultActionTypes } from 'reduxsauce';
import { createActions, createReducer } from 'reduxsauce';
import * as Immutable from 'seamless-immutable';

import type { NoSignInOrder, Order } from '@/types';

/* ------------- Model interface Create Action ------------- */
interface OrderAction extends AnyAction {}

interface IActionTypes extends DefaultActionTypes {
  SET_ORDER: 'setOrder';
  SET_NO_SIGN_IN_ORDER: 'setNoSignInOrder';
}

interface IActionCreators extends DefaultActionCreators {
  setOrder: (newOrder: Order) => AnyAction;
  setNoSignInOrder: (newNoSignInOrder: NoSignInOrder) => AnyAction;
}

type IActions = OrderAction | AnyAction;

export interface OrderState {
  order: Order;
  noSignInOrder: NoSignInOrder;
}

type ImmutableMyType = Immutable.ImmutableObject<OrderState>;

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions<IActionTypes, IActionCreators>({
  setOrder: ['newOrder'],
  setNoSignInOrder: ['newNoSignInOrder'],
});

export const OrderTypes = Types;
export default Creators;

const INITIAL_STATE: ImmutableMyType = Immutable.from({
  order: <Order>{
    id: '',
    isClosed: false,
    shipFee: 0,
    discount: 0,
    selectedMenuName: '',
    selectedMenuLink: '',
    uid: '',
    timestamp: { seconds: 0, nanoseconds: 0 },
  },
  noSignInOrder: <NoSignInOrder>{
    id: '',
    isClosed: false,
    shipFee: 0,
    discount: 0,
    selectedMenuName: '',
    selectedMenuLink: '',
    password: '',
  },
});

const setOrder = (state: ImmutableMyType, { newOrder }: { newOrder: Order }) =>
  state.merge({ order: newOrder });

const setNoSignInOrder = (
  state: ImmutableMyType,
  { newNoSignInOrder }: { newNoSignInOrder: NoSignInOrder },
) => state.merge({ noSignInOrder: newNoSignInOrder });

export const reducer = createReducer<ImmutableMyType, IActions>(INITIAL_STATE, {
  [Types.SET_ORDER]: setOrder,
  [Types.SET_NO_SIGN_IN_ORDER]: setNoSignInOrder,
});
