/*
 *
 * DashboardHome actions
 *
 */

import {
  GET_API,
  GET_API_SUCCESS,
  MERGE_DATA,
  GET_KPI,
  GET_REVENUE_CHART_DATA,
  GET_REVENUE_CHART_DATA_SUCCESS,
  GET_REVENUE_CHART_DATA_FAILURE,
  GET_PROFIT_CHART,
  GET_PROFIT_CHART_SUCCESS,
  GET_PROFIT_CHART_FAILURE,
  GET_ALL_TEMPLATE,
  GET_ALL_TEMPLATE_SUCCESS,
  GET_ALL_TEMPLATE_FAILURE,
  DEFAULT_ACTION,
  GET_IS_USER_FOLLOWED,
  GET_IS_USER_FOLLOWED_SUCCESS,
  GET_IS_USER_FOLLOWED_FAIL,
  PUT_USER_FOLLOW,
  PUT_USER_FOLLOW_FAIL,
  PUT_USER_FOLLOW_SUCCESS,
  GET_LIST_FOLLOW_SUGGEST,
  GET_LIST_FOLLOW_SUGGEST_FAIL,
  GET_LIST_FOLLOW_SUGGEST_SUCCESS,
  DELETE_LIST_FOLLOW_SUGGEST,
  DELETE_LIST_FOLLOW_SUGGEST_FAIL,
  DELETE_LIST_FOLLOW_SUGGEST_SUCCESS,
  SEND_ADD_FRIEND_FAIL,
  SEND_ADD_FRIEND,
  SEND_ADD_FRIEND_SUCCESS,
  GET_SEND_ADD_FRIEND,
  GET_SEND_ADD_FRIEND_FAIL,
  GET_SEND_ADD_FRIEND_SUCCESS,
  ADD_FRIEND,
  ADD_FRIEND_FAIL,
  ADD_FRIEND_SUCCESS,
  GET_LIST_FRIEND,
  GET_LIST_FRIEND_FAIL,
  GET_LIST_FRIEND_SUCCESS,
  UNFRIEND,
  UNFRIEND_SUCCESS,
  UNFRIEND_FAIL,
  GET_RELATIONSHIP,
  GET_RELATIONSHIP_FAIL,
  GET_RELATIONSHIP_SUCCESS
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getApi() {
  return {
    type: GET_API,
  };
}
export function getKpi() {
  return {
    type: GET_KPI,
  };
}

export function getRevenueChartData() {
  return {
    type: GET_REVENUE_CHART_DATA,
  };
}

export function getRevenueChartDataSuccess(data) {
  return {
    type: GET_REVENUE_CHART_DATA_SUCCESS,
    data,
  };
}

export function getRevenueChartDataFailure() {
  return {
    type: GET_REVENUE_CHART_DATA_FAILURE,
  };
}

export function getApiSuccess(
  contracts,
  projects,
  customers,
  businessOpportunities,
  profile,
  tasks,
  inChargeSelect,
  viewableSelect,
  stopSelect,
  cancelSelect,
  doingSelect,
  progressSelect,
  completeSelect,
  projectSkip,
  notDoingSelect,
) {
  return {
    type: GET_API_SUCCESS,
    contracts,
    projects,
    customers,
    businessOpportunities,
    profile,
    tasks,
    inChargeSelect,
    viewableSelect,
    stopSelect,
    cancelSelect,
    doingSelect,
    progressSelect,
    completeSelect,
    projectSkip,
    notDoingSelect,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function getProfitChart() {
  return {
    type: GET_PROFIT_CHART,
  };
}

export function getProfitChartSuccess(data) {
  return {
    type: GET_PROFIT_CHART_SUCCESS,
    data,
  };
}

export const handleChangeTitle = value => ({
  type: 'CHANGE',
  value,
});

export const getTemplate = (id, getTem) => ({
  type: 'GET_TEMPLATE',
  id,
  getTem,
});
export const getTemplateSuccess = (data, id) => ({
  type: 'GET_TEMPLATE_SUCCESS',
  data,
  id,
});

export const handleChange = data => ({
  type: 'CHANGE_VALUE',
  data,
});

export const postTemplate = data => ({
  type: 'POST_TEMPLATE',
  data,
});

export const putTemplate = (id, data) => ({
  type: 'PUT_TEMPLATE',
  id,
  data,
});

export const postTemplateSuccess = data => ({
  type: 'POST_TEMPLATE_SUCCESS',
  data,
});

export const postTemplateFailed = data => ({
  type: 'POST_TEMPLATE_FAILED',
  data,
});

export const putTemplateFailed = data => ({
  type: 'PUT_TEMPLATE_FAILED',
  data,
});


export function getProfitChartFailure() {
  return {
    type: GET_PROFIT_CHART_FAILURE,
  };
}


export function getAllTemplate() {
  return {
    type: GET_ALL_TEMPLATE,
  }
}

export function getAllTemplateSuccess(data) {
  return {
    type: GET_ALL_TEMPLATE_SUCCESS,
    data
  }
}
export function getAllTemplateFailure(error) {
  return {
    type: GET_ALL_TEMPLATE_FAILURE,
    error
  }
}
export function getIsUserFollowed(id) {
  return {
    type: GET_IS_USER_FOLLOWED,
    id: id
  };
}
export function getIsUserFollowedFail(id) {
  return {
    type: GET_IS_USER_FOLLOWED_FAIL,
  };
}
export function getIsUserFollowedSuccess(data) {
  return {
    type: GET_IS_USER_FOLLOWED_SUCCESS,
    data
  };
}

export function putUserFollow(id, status) {
  return {
    type: PUT_USER_FOLLOW,
    id, status
  };
}
export function putUserFollowfail() {
  return {
    type: PUT_USER_FOLLOW_FAIL,
  };
}
export function putUserFollowsuccess(data) {
  return {
    type: PUT_USER_FOLLOW_SUCCESS,
    data
  };
}

export function getListFollowSuggest(fieldName) {
  return {
    type: GET_LIST_FOLLOW_SUGGEST,
    fieldName
  };
}

export function getListFollowSuggestFail() {
  return {
    type: GET_LIST_FOLLOW_SUGGEST_FAIL,
  };
}
export function getListFollowSuggestSuccess(data) {
  return {
    type: GET_LIST_FOLLOW_SUGGEST_SUCCESS,
    data
  };
}


export function deleteListFollowSuggest(id) {
  return {
    type: DELETE_LIST_FOLLOW_SUGGEST,
    id
  };
}

export function deleteListFollowSuggestFail() {
  return {
    type: DELETE_LIST_FOLLOW_SUGGEST_FAIL,
  };
}
export function deleteListFollowSuggestSuccess(data) {
  return {
    type: DELETE_LIST_FOLLOW_SUGGEST_SUCCESS,
    data
  };
}

export function sendAddFriend(id, isFollowed) {
  return {
    type: SEND_ADD_FRIEND,
    id, isFollowed
  };
}
export function sendAddFriendFail() {
  return {
    type: SEND_ADD_FRIEND_FAIL,
  };
}
export function sendAddFriendSuccess(data) {
  return {
    type: SEND_ADD_FRIEND_SUCCESS,
    data
  };
}

export function getsendAddFriend() {
  return {
    type: GET_SEND_ADD_FRIEND,
  };
}
export function getsendAddFriendFail() {
  return {
    type: GET_SEND_ADD_FRIEND_FAIL,
  };
}
export function getsendAddFriendSuccess(data) {
  return {
    type: GET_SEND_ADD_FRIEND_SUCCESS,
    data
  };
}


export function addFriend(id, accept, itself) {
  console.log(id, accept)
  return {
    type: ADD_FRIEND,
    id, accept, itself
  };
}
export function addFriendFail() {
  return {
    type: ADD_FRIEND_FAIL,
  };
}
export function addFriendSuccess(data) {
  return {
    type: ADD_FRIEND_SUCCESS,
    data
  };
}

export function getListFriend() {
  return {
    type: GET_LIST_FRIEND,
  };
}
export function getListFriendFail() {
  return {
    type: GET_LIST_FRIEND_FAIL,
  };
}
export function getListFriendSuccess(data) {
  return {
    type: GET_LIST_FRIEND_SUCCESS,
    data
  };
}

export function unFriend(id, itself) {
  return {
    type: UNFRIEND,
    id, itself
  };
}
export function unFriendFail() {
  return {
    type: UNFRIEND_FAIL,
  };
}
export function unFriendSuccess(data) {
  return {
    type: UNFRIEND_SUCCESS,
    data
  };
}

export function getRelationship(checkerId) {
  return {
    type: GET_RELATIONSHIP,
    checkerId
  };
}
export function getRelationshipFail() {
  return {
    type: GET_RELATIONSHIP_FAIL,
  };
}
export function getRelationshipSuccess(data) {
  return {
    type: GET_RELATIONSHIP_SUCCESS,
    data
  };
}