import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the businessOpportunitiesReport state domain
 */

const selectBusinessOpportunitiesReportDomain = state => state.get('businessOpportunitiesReport', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by BusinessOpportunitiesReport
 */

const makeSelectBusinessOpportunitiesReport = () => createSelector(selectBusinessOpportunitiesReportDomain, substate => substate.toJS());

export default makeSelectBusinessOpportunitiesReport;
export { selectBusinessOpportunitiesReportDomain };
