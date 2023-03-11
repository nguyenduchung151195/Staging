/*
 *
 * AddEmail reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({
  categoryDynamicForm: '',
  templateTypes: [],
  title: '',
  content: '',
  code: '',
  moduleCode: null,
  codeRef: '',
  dialogRef: false,
  name: '',
  listItem: [],
  arrayDialog: false,
  formType: 'email',
});

function addEmailReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case 'GET_TEMPLATE_SUCCESS':
      if (action.id !== 'add')
        return state
          .merge(action.data)
          .set('loading', false)
          .set('error', false)
          .set('success', true);
      return state.merge(initialState).merge(action.data);
    default:
      return state;
  }
}

export default addEmailReducer;
