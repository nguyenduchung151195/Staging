/*
 *
 * ConfigTask reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_CONFIG_SUCCSESS, MERGE_DATA, GET_DEFAULT } from './constants';

export const initialState = fromJS({
  config: [],
  data: '',
  dialogKanban: false,
  name: '',
  code: '',
  type: 1,
  color: '#ff0000',
  configId: null,
  _id: '',
  configItem: '',
  openDialog: false,
  checkConfig: [],
});

function configTaskReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_CONFIG_SUCCSESS:
      return state.set('config', action.config);
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DEFAULT:
      return state
        .set('name', '')
        .set('code', '')
        .set('color', '#ff0000')
        .set('configItem', '');
    default:
      return state;
  }
}

export default configTaskReducer;
