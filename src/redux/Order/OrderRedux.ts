import type { AnyAction } from 'redux';
import type { DefaultActionCreators, DefaultActionTypes } from 'reduxsauce';
import { createActions, createReducer } from 'reduxsauce';
import * as Immutable from 'seamless-immutable';

import type { Order } from '@/types';

/* ------------- Model interface Create Action ------------- */
interface OrderAction extends AnyAction {}

interface IActionTypes extends DefaultActionTypes {
  SET_ORDER: 'setOrder';
}

interface IActionCreators extends DefaultActionCreators {
  setOrder: (newOrder: Order) => AnyAction;
}

type IActions = OrderAction | AnyAction;

export interface OrderState {
  redux_order: Order;
}

type ImmutableMyType = Immutable.ImmutableObject<OrderState>;

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions<IActionTypes, IActionCreators>({
  setOrder: ['newOrder'],
});

export const OrderTypes = Types;
export default Creators;

const INITIAL_STATE: ImmutableMyType = Immutable.from({
  redux_order: <Order>{
    id: '',
    shipFee: 0,
    discount: 0,
    shopOwnerName: '',
    shopOwnerMomo: '',
    selectedMenuName: '',
    selectedMenuLink: '',
  },
});

const setOrder = (state: ImmutableMyType, { newOrder }: { newOrder: Order }) =>
  state.merge({ redux_order: newOrder });

export const reducer = createReducer<ImmutableMyType, IActions>(INITIAL_STATE, {
  [Types.SET_ORDER]: setOrder,
});
