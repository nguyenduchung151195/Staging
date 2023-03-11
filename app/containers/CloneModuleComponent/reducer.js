/*
 *
 * CloneModuleComponent reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_DOCS,
  GET_ALL_DOCS_FAIL,
  GET_ALL_DOCS_SUCCESS,
  ADD_DOC,
  ADD_DOC_FAIL,
  ADD_DOC_SUCCESS,
  DELETE_DOCS,
  DELETE_DOCS_FAIL,
  DELETE_DOCS_SUCCESS,
  UPDATE_DOC,
  UPDATE_DOC_SUCCESS,
  UPDATE_DOC_FAIL,
  GET_ALL_PLUGINS,
  GET_ALL_PLUGINS_SUCCESS,
  GET_ALL_PLUGINS_FAIL,
  GET_ALL_RELATION_DOCS_FAIL,
} from './constants';

export const initialState = fromJS({
  plugins: [],
});

function cloneModuleComponentReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);

    case GET_ALL_PLUGINS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_PLUGINS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_PLUGINS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('plugins', action.data);
    case GET_ALL_DOCS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_DOCS_FAIL:
      return state
        .set('loading', false)
        .set('docs', [])
        .set('success', false)
        .set('error', true);
    case GET_ALL_DOCS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('docs', action.data);
    case ADD_DOC:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_DOC_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message);
    // .set('docs', action.data);
    case ADD_DOC_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case UPDATE_DOC:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_DOC_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('success', true);
    // .set('docs', action.data);
    case UPDATE_DOC_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case DELETE_DOCS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_DOCS_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false);
    // .set('docs', action.data);
    case DELETE_DOCS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case GET_ALL_RELATION_DOCS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    default:
      return state;
  }
}

export default cloneModuleComponentReducer;
