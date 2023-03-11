/*
 *
 * DashboardHome actions
 *
 */

import {
  DEFAULT_ACTION,
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
  GET_ALL_TEMPLATE_FAILURE
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