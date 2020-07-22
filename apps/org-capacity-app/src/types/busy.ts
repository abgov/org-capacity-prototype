import { Action } from 'redux';

export interface BusyAction extends Action {
  operation: string,
  isBusy: boolean
}

export interface BusyState {
  [x: string]: boolean
}
