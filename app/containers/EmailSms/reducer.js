/*
 *
 * EmailSms reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({
  templates: [],
  openDrawer: false,
  openCampaign: false,
  openHistory: false,
  openSms: false,
  openDrawer: false,
  id: 'add',
  formType: '',
  reload: 0,
});

function emailSmsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default emailSmsReducer;
