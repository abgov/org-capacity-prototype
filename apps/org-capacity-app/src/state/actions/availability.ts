import { BusyAction, AvailabilityStatusType } from '../../types';

export const AVAILABILITY_STATUS_TYPES_LOADING = 'AVAILABILITY/STATUS_TYPES_LOADING';
export const AVAILABILITY_STATUS_TYPES_LOADED = 'AVAILABILITY/STATUS_TYPES_LOADED';

export interface AvailabilityStatusTypesLoadingAction extends BusyAction {
  type: typeof AVAILABILITY_STATUS_TYPES_LOADING
}

export interface AvailabilityStatusTypesLoadedAction extends BusyAction {
  type: typeof AVAILABILITY_STATUS_TYPES_LOADED
  types: AvailabilityStatusType[]
}

export type AvailabilityActionTypes = 
  AvailabilityStatusTypesLoadingAction | AvailabilityStatusTypesLoadedAction

export const loadAvailabilityStatusTypes = (): AvailabilityStatusTypesLoadingAction => ({
  type: AVAILABILITY_STATUS_TYPES_LOADING,
  operation: 'load-availability-status-types',
  isBusy: true
})

export const loadedAvailabilityStatusTypes = (
  statuses: AvailabilityStatusType[]
): AvailabilityStatusTypesLoadedAction => ({
  type: AVAILABILITY_STATUS_TYPES_LOADED,
  operation: 'load-availability-status-types',
  isBusy: false,
  types: statuses
})
