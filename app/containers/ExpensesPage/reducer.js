/*
 *
 * ExpensesPage reducer
 *
 */

import { fromJS } from 'immutable';
import { 
  DEFAULT_ACTION, 
  MERGE_DATA, 
  GET_COST_SUCCESS, 
  GET_DATA_SUCCESS,
  UPDATE_EXPENSE,
  UPDATE_EXPENSE_SUCCESS,
  UPDATE_EXPENSE_FAILURE,
} from './constants';

export const initialState = fromJS({
  name: '',
  data: '',
  forms: [],
  form: '',
  templates: [],
  template: '',
  printId: '',
  itemCost: '',
  costId: '',
  addDialog: false,
  kanbanStatus: '1',
  reload: 0,
  id: 'add',
  businessData: [],
  exchangingData: [],
});

function expensesPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_COST_SUCCESS:
      return state.set('forms', action.forms);
    case GET_DATA_SUCCESS:
      return state.set('businessData', action.businessData).set('exchangingData', action.exchangingData);
    case UPDATE_EXPENSE:
      return state.set('reload', false);
    case UPDATE_EXPENSE_FAILURE:
      return state.set('reload', true);
    default:
      return state;
  }
}

export default expensesPageReducer;
