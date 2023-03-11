import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the reportTypeCustomer state domain
 */

const selectReportTypeCustomerDomain = state =>
  state.get('reportTypeCustomer', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ReportTypeCustomer
 */

const makeSelectReportTypeCustomer = () =>
  createSelector(selectReportTypeCustomerDomain, substate => substate.toJS());

export default makeSelectReportTypeCustomer;
export { selectReportTypeCustomerDomain };
