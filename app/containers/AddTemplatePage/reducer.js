/*
 *
 * AddTemplatePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE, GET_ALL_TEMPLATE_SUCCESS, GET_ALL_MODULE_CODE_SUCCESS } from './constants';
import { clientId } from '../../variable';

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
  reload: false,
  modules: {},
  moduleCode: null,
  imageSrc: null,
  selection: 0,
  viewConfig: null,
  clientId: clientId,
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
    case 'POST_TEMPLATE':
      return state.set('reload', false);
    case 'POST_TEMPLATE_SUCCESS':
      return state.set('reload', true);
    case 'POST_TEMPLATE_FAILURE':
      return state.set('reload', false);

    case 'PUT_TEMPLATE':
      return state.set('reload', false);
    case 'PUT_TEMPLATE_SUCCESS':
      return state.set('reload', true);
    case 'PUT_TEMPLATE_FAILURE':
      return state.set('reload', false);

    case GET_ALL_MODULE_CODE_SUCCESS:
      return state.set('modules', action.data);
    default:
      return state;
  }
}

export default addTemplatePageReducer;
