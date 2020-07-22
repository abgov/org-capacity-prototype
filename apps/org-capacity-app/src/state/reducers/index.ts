import { History } from 'history';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { userReducer } from './user';
import { busyReducer } from './busy';
import { organizationReducer } from './organization';
import { availabilityReducer } from './availability';
import { personReducer } from './person';

const createAppReducer = (history: History) => combineReducers({
  user: userReducer,
  router: connectRouter(history),
  busy: busyReducer,
  availability: availabilityReducer,
  organization: organizationReducer,
  person: personReducer
});

export default createAppReducer;
