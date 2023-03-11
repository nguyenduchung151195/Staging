/*
 *
 * ReportPage actions
 *
 */

import {
  DEFAULT_ACTION, GET_SUM_IN_YEAR,
  GET_SUM_IN_YEAR_SUCCESS,
  GET_SUM_IN_YEAR_FAILURE,
  GET_CHARGE_PROPORTION,
  GET_CHARGE_PROPORTION_SUCCESS,
  GET_CHARGE_PROPORTION_FAILURE,
  GET_SUM_REVENUE_COST_IN_YEAR,
  GET_SUM_REVENUE_COST_IN_YEAR_SUCCESS,
  GET_SUM_REVENUE_COST_IN_YEAR_FAILURE,
  GET_SUM_REVENUE_INVENTORY_IN_YEAR,
  GET_SUM_REVENUE_INVENTORY_IN_YEAR_SUCCESS,
  GET_SUM_REVENUE_INVENTORY_IN_YEAR_FAILURE,
  GET_DETAILED_SALES_BY_STAFF,
  GET_DETAILED_SALES_BY_STAFF_SUCCESS,
  GET_DETAILED_SALES_BY_STAFF_FAILURE,
  GET_COMPARE_SALES_PERSON_SALES_OF_YEAR,
  GET_COMPARE_SALES_PERSON_SALES_OF_YEAR_SUCCESS,
  GET_COMPARE_SALES_PERSON_SALES_OF_YEAR_FAILURE,
  GET_PROPORTION_OF_COST_BY_ITEM,
  GET_PROPORTION_OF_COST_BY_ITEM_SUCCESS,
  GET_PROPORTION_OF_COST_BY_ITEM_FAILURE,
  GET_PROPORTION_OF_COST_BY_DEPARTMENT,
  GET_PROPORTION_OF_COST_BY_DEPARTMENT_SUCCESS,
  GET_PROPORTION_OF_COST_BY_DEPARTMENT_FAILURE
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

// tổng hợp chi phí bộ phận và khoản mục
export function getSumInYear() {
  return {
    type: GET_SUM_IN_YEAR
  }
}

export function getSumInYearSuccess(data) {
  return {
    type: GET_SUM_IN_YEAR_SUCCESS,
    data
  }
}
export function getSumInYearFailure(error) {
  return {
    type: GET_SUM_IN_YEAR_FAILURE,
    error
  }
}

export function getChargeProportion() {
  return {
    type: GET_CHARGE_PROPORTION
  }
}

export function getChargeProportionSuccess(data) {
  return {
    type: GET_CHARGE_PROPORTION_SUCCESS,
    data
  }
}
export function getChargeProportionFailure(error) {
  return {
    type: GET_CHARGE_PROPORTION_FAILURE,
    error
  }
}

// tổng hợp doanh số theo khách hàng và hàng hóa
export function getSumRevenueCostInYear() {
  return {
    type: GET_SUM_REVENUE_COST_IN_YEAR
  }
}
export function getSumRevenueCostInYearSuccess(data) {
  return {
    type: GET_SUM_REVENUE_COST_IN_YEAR_SUCCESS,
    data
  }
}
export function getSumRevenueCostInYearFailure(error) {
  return {
    type: GET_SUM_REVENUE_COST_IN_YEAR_FAILURE,
    error
  }
}

export function getSumRevenueInventoryInYear() {
  return {
    type: GET_SUM_REVENUE_INVENTORY_IN_YEAR
  }
}
export function getSumRevenueInventoryInYearSuccess(data) {
  return {
    type: GET_SUM_REVENUE_INVENTORY_IN_YEAR_SUCCESS,
    data
  }
}
export function getSumRevenueInventoryInYearFailure(error) {
  return {
    type: GET_SUM_REVENUE_INVENTORY_IN_YEAR_FAILURE,
    error
  }
}

// Tổng hợp doanh số theo nhân viên kinh doanh
export function getDetailedSalesByStaff() {
  return {
    type: GET_DETAILED_SALES_BY_STAFF
  }
}
export function getDetailedSalesByStaffSuccess(data) {
  return {
    type: GET_DETAILED_SALES_BY_STAFF_SUCCESS,
    data
  }
}
export function getDetailedSalesByStaffFailure(error) {
  return {
    type: GET_DETAILED_SALES_BY_STAFF_FAILURE,
    error
  }
}

export function getCompareSalesPersonSalesOfYear() {
  return {
    type: GET_COMPARE_SALES_PERSON_SALES_OF_YEAR
  }
}
export function getCompareSalesPersonSalesOfYearSuccess(data) {
  return {
    type: GET_COMPARE_SALES_PERSON_SALES_OF_YEAR_SUCCESS,
    data
  }
}
export function getCompareSalesPersonSalesOfYearFailure(error) {
  return {
    type: GET_COMPARE_SALES_PERSON_SALES_OF_YEAR_FAILURE,
    error
  }
}

// Tổng hợp tình hình kinh doanh
export function getProportionOfCostByItem() {
  return {
    type: GET_PROPORTION_OF_COST_BY_ITEM
  }
}
export function getProportionOfCostByItemSuccess(data) {
  return {
    type: GET_PROPORTION_OF_COST_BY_ITEM_SUCCESS,
    data
  }
}
export function getProportionOfCostByItemFailure(error) {
  return {
    type: GET_PROPORTION_OF_COST_BY_ITEM_FAILURE,
    error
  }
}

export function getProportionOfCostByDepartment() {
  return {
    type: GET_PROPORTION_OF_COST_BY_DEPARTMENT
  }
}
export function getProportionOfCostByDepartmentSuccess(data) {
  return {
    type: GET_PROPORTION_OF_COST_BY_DEPARTMENT_SUCCESS,
    data
  }
}
export function getProportionOfCostByDepartmentFailure(error) {
  return {
    type: GET_PROPORTION_OF_COST_BY_DEPARTMENT_FAILURE,
    error
  }
}
