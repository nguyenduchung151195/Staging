import { fromJS } from 'immutable';
import {
  CREATE_ACCOUNT_REQUESTED,CREATE_ACCOUNT_REQUESTED_SUCCEEDED,
  CREATE_ACCOUNT_REQUESTED_FAILED,
  UPDATE_ACCOUNT_REQUESTED,UPDATE_ACCOUNT_REQUESTED_SUCCEEDED,
  UPDATE_ACCOUNT_REQUESTED_FAILED,
  UPDATE_PASSWORD_REQUESTED_SUCCEEDED,UPDATE_PASSWORD_REQUESTED_FAILED,
  UPDATE_PASSWORD_REQUESTED,
  MERGE_DATA
} from './constants';

export const initialState = fromJS({
  loading: false,
  createAccountRequestSuccess: null,
  updateAccountRequestSuccess: null,
  updatePasswordRequestSuccess: null,
});

function accountRequestReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_ACCOUNT_REQUESTED:
      return state.set('loading', false).set('createAccountRequestSuccess', null);
    case CREATE_ACCOUNT_REQUESTED_SUCCEEDED:
      return state.set('loading', true).set('createAccountRequestSuccess', true);
    case CREATE_ACCOUNT_REQUESTED_FAILED:
      return state.set('loading', false).set('createAccountRequestSuccess', false);
      
    case UPDATE_ACCOUNT_REQUESTED:
      return state.set('loading', false).set('updateAccountRequestSuccess', null);
    case UPDATE_ACCOUNT_REQUESTED_SUCCEEDED:
      return state.set('loading', true).set('updateAccountRequestSuccess', true);
    case UPDATE_ACCOUNT_REQUESTED_FAILED:
      return state.set('loading', false).set('updateAccountRequestSuccess', false);

      case UPDATE_PASSWORD_REQUESTED:
        return state.set('updatePasswordRequestSuccess', null);
      case UPDATE_PASSWORD_REQUESTED_SUCCEEDED:
        return state.set('updatePasswordRequestSuccess', true);
      case UPDATE_PASSWORD_REQUESTED_FAILED:
        return state.set('updatePasswordRequestSuccess', false);
      
      case MERGE_DATA:
        return state.merge(action.data);

      case 'RELOAD_ACCOUNT_PAGE':
        console.log(action);
        return state.set('loading', false);
    default:
      return state;
  }
}

export default accountRequestReducer;
