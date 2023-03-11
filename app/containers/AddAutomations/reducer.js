/*
 *
 * AddTemplatePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE, GET_ALL_TEMPLATE_SUCCESS } from './constants';

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
  templates: [],
});

function addTemplatePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case 'CHANGE':
      return state.set('categoryDynamicForm', action.value);
    case 'GET_TEMPLATE_SUCCESS':
      if (action.id !== 'add')
        return state
          .merge(action.data)
          .set('loading', false)
          .set('error', false)
          .set('success', true);

      return state.merge(initialState).merge(action.data);

    case 'CHANGE_VALUE':
      return state.set(action.data.name, action.data.value);
    case MERGE:
      return state.merge(action.data);
    case GET_ALL_TEMPLATE_SUCCESS:
      return state.set('templates', action.data);
    default:
      return state;
  }
}

export default addTemplatePageReducer;
