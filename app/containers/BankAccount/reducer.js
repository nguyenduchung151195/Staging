import { fromJS } from 'immutable';
import {
  CREATE_ACCOUNT_REQUESTED,CREATE_ACCOUNT_REQUESTED_SUCCEEDED,
  CREATE_ACCOUNT_REQUESTED_FAILED,
  MERGE_DATA
} from './constants';

export const initialState = fromJS({
  loading: false,
});

function accountRequestReducer(state = initialState, action) {
  switch (action.type) {
    // case CREATE_ACCOUNT_REQUESTED:
    //   return state.set('loading', true).set('createAccountRequestSuccess', null);
    // case CREATE_ACCOUNT_REQUESTED_SUCCEEDED:
    //   return state.set('loading', false).set('createAccountRequestSuccess', true);
    // case CREATE_ACCOUNT_REQUESTED_FAILED:
    //   return state.set('loading', false).set('createAccountRequestSuccess', false);
      
      case MERGE_DATA:
        return state.merge(action.data);

    default:
      return state;
  }
}

export default accountRequestReducer;
