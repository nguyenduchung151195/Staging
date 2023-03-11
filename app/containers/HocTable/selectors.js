import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';

/**
 * Direct selector to the hocTable state domain
 */

const selectHocTableDomain = state => state.get('hocTable', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);

/**
 * Other specific selectors
 */

/**
 * Default selector used by HocTable
 */

const makeSelectHocTable = () => createSelector(selectHocTableDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectHocTable;
export { selectHocTableDomain, makeSelectDashboardPage };
