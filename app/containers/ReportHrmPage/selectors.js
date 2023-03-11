import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the reportHrmPage state domain
 */

const selectReportHrmPageDomain = state => state.get('reportHrmPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ReportHrmPage
 */

const makeSelectReportHrmPage = () => createSelector(selectReportHrmPageDomain, substate => substate.toJS());

export default makeSelectReportHrmPage;
export { selectReportHrmPageDomain };
