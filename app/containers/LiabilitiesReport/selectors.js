import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the liabilitiesReport state domain
 */

const selectLiabilitiesReportDomain = state => state.get('liabilitiesReport', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by LiabilitiesReport
 */

const makeSelectLiabilitiesReport = () => createSelector(selectLiabilitiesReportDomain, substate => substate.toJS());

export default makeSelectLiabilitiesReport;
export { selectLiabilitiesReportDomain };
