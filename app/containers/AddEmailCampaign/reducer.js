/*
 *
 * AddEmailCampaign reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_DATA_SUCCESS, POST_DATA_SUCCESS, GET_DEFAULT, GET_CURRENT_SUCCESS } from './constants';

export const initialState = fromJS({
  name: '',
  active: false,
  sender: 1,
  senderName: '',
  totalSend: false,
  mail: '',
  receiver: { groupCustomer: [], typeCustomer: [], customer: [] },
  category: [],
  form: '',
  title: '',
  content: '',
  timer: new Date(),
  minute: '',
  day: { hours: '', minute: '' },
  month: { day: '', hours: '', minute: '' },
  custom: {},
  templates: [],
  data: '',
  type: 0,
  customers: [],
  typeOfCustomer: '',
  group: '',
  groupCustomer: [],
  typeCustomer: [],
  customer: [],
});

function addEmailCampaignReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DATA_SUCCESS:
      return state.set('templates', action.data).set('customers', action.customers);
    case POST_DATA_SUCCESS:
      return state.set('data', action.data);
    case GET_DEFAULT:
      return state
        .set('active', false)
        .set('active', false)
        .set('senderName', '')
        .set('totalSend', false)
        .set('receiver', { groupCustomer: [], typeCustomer: [], customer: [] })
        .set('form', '')
        .set('title', '')
        .set('name', '')
        .set('customers', [])
        .set('groupCustomer', [])
        .set('typeCustomer', [])
        .set('customer', [])
    case GET_CURRENT_SUCCESS:
      console.log("sss")
      return state.merge(action.data);
    default:
      return state;
  }
}

export default addEmailCampaignReducer;
