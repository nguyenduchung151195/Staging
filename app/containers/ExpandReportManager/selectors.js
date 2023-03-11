import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ExpandReportManager state domain
 */

const selectExpandReportManagerDomain = state => state.get('expandReportManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ExpandReportManager
 */

const makeSelectExpandReportManager = () => createSelector(selectExpandReportManagerDomain, substate => substate.toJS());

export default makeSelectExpandReportManager;
export { selectExpandReportManagerDomain };
