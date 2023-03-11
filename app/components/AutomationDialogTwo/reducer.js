/*
 *
 * PluginAutomation reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_DYNAMIC_FORMS,
  GET_ALL_DYNAMIC_FORMS_SUCCESS,
  GET_ALL_DYNAMIC_FORMS_FAIL,
  GET_ALL_AUTOMATION,
  GET_ALL_AUTOMATION_FAIL,
  GET_ALL_AUTOMATION_SUCCESS,
  ADD_AUTOMATION,
  ADD_AUTOMATION_FAIL,
  ADD_AUTOMATION_SUCCESS,
  DELETE_AUTOMATION,
  DELETE_AUTOMATION_FAIL,
  DELETE_AUTOMATION_SUCCESS,
  UPDATE_AUTOMATION,
  UPDATE_AUTOMATION_FAIL,
  UPDATE_AUTOMATION_SUCCESS,
  GET_ALL_APPROVE_GROUP,
  GET_ALL_APPROVE_GROUP_SUCCESS,
  GET_ALL_APPROVE_GROUP_FAIL,
} from './constants';

export const initialState = fromJS({});

function pluginAutomationReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    case GET_ALL_DYNAMIC_FORMS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_DYNAMIC_FORMS_FAIL:
      return state
        .set('loading', false)
        .set('callAPIStatus', 0)
        .set('success', false)
        .set('notiMessage', action.message)
        .set('error', true);
    case GET_ALL_DYNAMIC_FORMS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('dynamicForms', action.data);
    case GET_ALL_AUTOMATION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_AUTOMATION_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_AUTOMATION_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('automations', action.data);
    case ADD_AUTOMATION:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_AUTOMATION_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message);
    // .set('bos', action.data);
    case ADD_AUTOMATION_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case UPDATE_AUTOMATION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_AUTOMATION_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('success', true)
        .set('automations', action.data);
    case UPDATE_AUTOMATION_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case DELETE_AUTOMATION:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_AUTOMATION_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('automations', action.data);
    case DELETE_AUTOMATION_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case GET_ALL_APPROVE_GROUP:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_APPROVE_GROUP_FAIL:
      return state
        .set('loading', false)
        .set('callAPIStatus', 0)
        .set('success', false)
        .set('notiMessage', action.message)
        .set('error', true);
    case GET_ALL_APPROVE_GROUP_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('mappingConvert', action.mappingConvert)
        .set('approveGroup', action.data);

    default:
      return state;
  }
}

export default pluginAutomationReducer;
