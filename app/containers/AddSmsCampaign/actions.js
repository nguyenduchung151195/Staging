/*
 *
 * AddSmsCampaign actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_DATA_SUCCESS,
  GET_DATA,
  POST_CAMPAIGN,
  POST_CAMPAIGN_SUCCESS,
  PUT_CAMPAIGN,
  PUT_CAMPAIGN_SUCCESS,
  GET_DEFAULT,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}
export function getData() {
  return {
    type: GET_DATA,
  };
}
export function getDataSuccess(data) {
  return {
    type: GET_DATA_SUCCESS,
    data,
  };
}
export function postCampaign(data) {
  return {
    type: POST_CAMPAIGN,
    data,
  };
}
export function postCampaignSuccess(data) {
  return {
    type: POST_CAMPAIGN_SUCCESS,
    data,
  };
}
export function putCampaign(data, id) {
  return {
    type: PUT_CAMPAIGN,
    data,
    id,
  };
}
export function putCampaignSuccess(data) {
  return {
    type: PUT_CAMPAIGN_SUCCESS,
    data,
  };
}
