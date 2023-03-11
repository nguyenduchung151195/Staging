/*
 *
 * AddDispatchManagerPage reducer
 *
 */

import { fromJS } from 'immutable';
// import { DEFAULT_ACTION } from './types';
import * as types from './constants';

export const initialState = fromJS({
  ducumentData: {},
  data: [],
  tab: 0,
  name: '',
  code: null,
  type: 2,
  typeDocument: '',
  task: null,
  toUsers: [],
  toDate: new Date(),
  signer: '',
  urgency: '',
  abstract: '',
  content: '',
  files: [],
  kanbanStatus: 0,
  where: '',
  handlingComments: '',
  replyDispatch: null, // new
  officialDispatch: null, // new
  signerPosition: '', // new
  receivingUnit: '',
  nameUnit: '',
  addressUnit: '',
  reciever: '',
  recieverPosition: '',
  receiveTime: new Date(),
  replyDeadline: new Date(),
  density: '',
  receiverSign: null,
  viewer: null,
  reloadTask: 1,
  reload: false,
  storage: '',
  additionalPlaces: '',
  fromUsers: [],
  errorUser: true,
  openDrawerMeeting: false,
  idCalendar: 'add',
  openDrawerTask: false,
  logs: [],
  taskData: {},
  treeData: [
    {
      name: 'Công văn 1',
      attributes: {},
      children: [
        {
          name: 'Công văn phúc đáp',
          attributes: {},
        },
        {
          name: 'Trả lời công văn',
        },
      ],
    },
  ],
  anchorEl: null,
});

function addDispatchManagerPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.DEFAULT_ACTION:
      return state;
    case types.CREATE_DOCUMENT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case types.CREATE_DOCUMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case types.CREATE_DOCUMENT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case types.UPDATE_DOCUMENT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case types.UPDATE_DOCUMENT_SUCCESS:
      return state
        .set('data', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case types.UPDATE_DOCUMENT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case types.MEGER_DATA:
      return state.merge(action.data);
    case types.GET_CURRENT_SUCCSESS:
      return state.merge(action.data).set('errorUser', false);
    case types.GET_DEFAULT:
      return state.merge(initialState);
    case types.GET_LOG_SUCCESS_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false)
        .set('logs', action.data.logs);
    default:
      return state;
  }
}

export default addDispatchManagerPageReducer;
