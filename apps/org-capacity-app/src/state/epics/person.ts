import { of, from } from 'rxjs';
import { mergeMap, map, withLatestFrom, debounceTime, filter, catchError } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { AppState } from '../../types';
import { PERSON_AVAILABILITY_SAVING, PersonAvailabilitySavingAction, savedPersonAvailability, PERSON_AVAILABILITY_MODIFY, savePersonAvailability, PEOPLE_SEARCHING, PeopleSearchingAction, searchedPeople, PEOPLE_SEARCH_MODIFY, searchPeople } from '../actions';
import { Services } from './services';

interface PersonEpics {
  autoSearchPeopleEpic: Epic
  searchPeopleEpic: Epic
  autoSaveAvailabilityEpic: Epic
  saveAvailabilityEpic: Epic
}

export const createPersonEpics = (services: Services): PersonEpics => ({
  autoSearchPeopleEpic: (action$, state$) => action$.pipe(
    ofType(PEOPLE_SEARCH_MODIFY),
    debounceTime(300),
    withLatestFrom(state$.pipe(map((s: AppState) => s.person.criteria))),
    filter(([_, c]) => !!c.nameContains),
    map(([_, c]) => searchPeople(c))
  ),
  searchPeopleEpic: (action$, state$) => action$.pipe(
    ofType(PEOPLE_SEARCHING),
    withLatestFrom(state$.pipe(map((s: AppState) => s.user.token))),
    mergeMap(([a, t]: [PeopleSearchingAction, string]) => 
      services.person.getPeople(t, 10, null, a.criteria).pipe(
        map((result) => searchedPeople(result)),
        catchError((err) => of())
      )
    )
  ),
  autoSaveAvailabilityEpic: (action$, state$) => action$.pipe(
    ofType(PERSON_AVAILABILITY_MODIFY),
    debounceTime(3000),
    withLatestFrom(state$.pipe(map((s: AppState) => s.person.availabilityUpdated))),
    filter(([a, us]) => !!us[a.personId]),
    mergeMap(([a, us]) => from(
      Object.entries(us).map(([id, u]) => 
        savePersonAvailability(u.organizationId, id, u.status))
      )
    )
  ),

  saveAvailabilityEpic: (action$, state$) => action$.pipe(
    ofType(PERSON_AVAILABILITY_SAVING),
    withLatestFrom(state$.pipe(map((s: AppState) => s.user.token))),
    mergeMap(([a, t]: [PersonAvailabilitySavingAction, string]) => 
      services.person.setAvailability(t, a.organizationId, a.personId, a.status).pipe(
        map((result) => savedPersonAvailability(a.organizationId, result.id, result.availability)),
        catchError((err) => of())
      )
    )
  )
})
