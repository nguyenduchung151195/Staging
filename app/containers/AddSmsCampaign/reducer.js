/*
 *
 * AddSmsCampaign reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_DATA_SUCCESS, POST_CAMPAIGN_SUCCESS } from './constants';

export const initialState = fromJS({
  data: '',
  name: '',
  formType: '',
  sender: 1,
  senderName: 1,
  totalSend: true,
  active: false,
  mail: '',
  receiver: { customer: [] },
  form: '',
  title: '',
  content: '',
  timer: new Date(),
  minute: '',
  day: { hours: '', minute: '' },
  month: { day: '', hours: '', minute: '' },
  custom: {},
  templates: [],
  selectAll: false,
  customers: [],
  groupCustomer: '',
  typeCustomer: '',
});

function addSmsCampaignReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DATA_SUCCESS:
      return state.set('templates', action.data).set('customers', action.customers);
    case POST_CAMPAIGN_SUCCESS:
      return state.set('data', action.data);
    default:
      return state;
  }
}

export default addSmsCampaignReducer;
