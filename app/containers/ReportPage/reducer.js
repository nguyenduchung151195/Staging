/*
 *
 * ReportPage reducer
 *
 */

import { fromJS } from 'immutable';
import { truncate } from 'lodash';
import {
  DEFAULT_ACTION,
  GET_SUM_IN_YEAR,
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
  GET_PROPORTION_OF_COST_BY_DEPARTMENT_FAILURE,
} from './constants';

export const initialState = fromJS({
  sumInYear: [],
  chargeProportion: [],
  sumRevenueCost: [],
  sumRevenueInventory: [],
  compareSalesPerson: [],
  proportionCostByItem: [],
  proportionCostByDepartment: [],
  loadingProportionOfCostByItem: false,
  loadingCompareSalesPerson: false,
  loadingSumRevenueCost: false,
  loadingSumRevenueInventory: false,
  loadingSumInYear: false,
  loadingChargeProportion: false,
});

function reportPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_SUM_IN_YEAR:
      return state.set('loadingSumInYear', false);
    case GET_SUM_IN_YEAR_SUCCESS:
      return state.set('sumInYear', action.data).set('loadingSumInYear', false);
    case GET_SUM_IN_YEAR_FAILURE:
      return state.set('loadingSumInYear', false);
    case GET_CHARGE_PROPORTION:
      return state.set('loadingChargeProportion', true);
    case GET_CHARGE_PROPORTION_SUCCESS:
      return state.set('chargeProportion', action.data).set('loadingChargeProportion', false);
    case GET_CHARGE_PROPORTION_FAILURE:
      return state.set('loadingChargeProportion', false);
    case GET_SUM_REVENUE_COST_IN_YEAR:
      return state.set('loadingSumRevenueCost', true);
    case GET_SUM_REVENUE_COST_IN_YEAR_SUCCESS:
      return state.set('sumRevenueCost', action.data).set('loadingSumRevenueCost', false);
    case GET_SUM_REVENUE_COST_IN_YEAR_FAILURE:
      return state.set('loadingSumRevenueCost', false);
    case GET_SUM_REVENUE_INVENTORY_IN_YEAR:
      return state.set('loadingSumRevenueInventory', true);
    case GET_SUM_REVENUE_INVENTORY_IN_YEAR_SUCCESS:
      return state.set('sumRevenueInventory', action.data).set('loadingSumRevenueInventory', false);
    case GET_SUM_REVENUE_INVENTORY_IN_YEAR_FAILURE:
      return state.set('loadingSumRevenueInventory', false);
    case GET_COMPARE_SALES_PERSON_SALES_OF_YEAR:
      return state.set('loadingCompareSalesPerson', true);
    case GET_COMPARE_SALES_PERSON_SALES_OF_YEAR_SUCCESS:
      return state.set('compareSalesPerson', action.data).set('loadingCompareSalesPerson', false);
    case GET_COMPARE_SALES_PERSON_SALES_OF_YEAR_FAILURE:
      return state.set('loadingCompareSalesPerson', false);
    case GET_PROPORTION_OF_COST_BY_ITEM:
      return state.set('loadingProportionOfCostByItem', true);
    case GET_PROPORTION_OF_COST_BY_ITEM_SUCCESS:
      return state.set('proportionCostByItem', action.data).set('loadingProportionOfCostByItem', false);
    case GET_PROPORTION_OF_COST_BY_ITEM_FAILURE:
      return state.set('loadingProportionOfCostByItem', false);
    case GET_PROPORTION_OF_COST_BY_DEPARTMENT_SUCCESS:
      return state.set('proportionCostByDepartment', action.data);
    default:
      return state;
  }
}

export default reportPageReducer;
