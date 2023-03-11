import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the reportTask state domain
 */

const selectReportTaskDomain = state => state.get('reportTask', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ReportTask
 */

const makeSelectReportTask = () => createSelector(selectReportTaskDomain, substate => substate.toJS());

export default makeSelectReportTask;
export { selectReportTaskDomain };
