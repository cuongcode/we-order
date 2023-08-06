import type { AnyAction } from 'redux';
import type { DefaultActionCreators, DefaultActionTypes } from 'reduxsauce';
import { createActions, createReducer } from 'reduxsauce';
import * as Immutable from 'seamless-immutable';

import type { DrinkTableRow } from '@/types';

/* ------------- Model interface Create Action ------------- */
interface RowsAction extends AnyAction {}

interface IActionTypes extends DefaultActionTypes {
  SET_ROWS: 'setRows';
}

interface IActionCreators extends DefaultActionCreators {
  setRows: (newRows: DrinkTableRow[]) => AnyAction;
}

type IActions = RowsAction | AnyAction;

export interface RowsState {
  rows: DrinkTableRow[];
}

type ImmutableMyType = Immutable.ImmutableObject<RowsState>;

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions<IActionTypes, IActionCreators>({
  setRows: ['newRows'],
});

export const RowsTypes = Types;
export default Creators;

const INITIAL_STATE: ImmutableMyType = Immutable.from({
  rows: <DrinkTableRow[]>[],
});

const setRows = (
  state: ImmutableMyType,
  { newRows }: { newRows: DrinkTableRow[] },
) => state.merge({ rows: newRows });

export const reducer = createReducer<ImmutableMyType, IActions>(INITIAL_STATE, {
  [Types.SET_ROWS]: setRows,
});
