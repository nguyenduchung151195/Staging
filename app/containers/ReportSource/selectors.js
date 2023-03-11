import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the reportSource state domain
 */

const selectReportSourceDomain = state => state.get('reportSource', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ReportSource
 */

const makeSelectReportSource = () => createSelector(selectReportSourceDomain, substate => substate.toJS());

export default makeSelectReportSource;
export { selectReportSourceDomain };
