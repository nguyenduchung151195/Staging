import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the reportReportCustomer state domain
 */

const selectReportReportCustomerDomain = state => state.get('reportReportCustomer', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ReportReportCustomer
 */

const makeSelectReportReportCustomer = () => createSelector(selectReportReportCustomerDomain, substate => substate.toJS());

export default makeSelectReportReportCustomer;
export { selectReportReportCustomerDomain };
