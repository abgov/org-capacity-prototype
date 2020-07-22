import { switchMap, map } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { Services } from './services';
import { AVAILABILITY_STATUS_TYPES_LOADING, AvailabilityStatusTypesLoadingAction, loadedAvailabilityStatusTypes } from '../actions';

interface AvailabilityEpics {
  loadAvailabilityStatusTypesEpic: Epic
}

export const createAvailabilityEpics = (services: Services): AvailabilityEpics => ({
  loadAvailabilityStatusTypesEpic: (action$) => action$.pipe(
    ofType(AVAILABILITY_STATUS_TYPES_LOADING),
    switchMap((a: AvailabilityStatusTypesLoadingAction) => 
      services.availability.getAvailabilityStatusTypes().pipe(
        map((result) => loadedAvailabilityStatusTypes(result))
      )
    )
  )
})
