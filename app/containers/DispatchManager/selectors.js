import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';

/**
 * Direct selector to the dispatchManager state domain
 */

const selectDispatchManagerDomain = state => state.get('dispatchManager', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);

/**
 * Other specific selectors
 */

/**
 * Default selector used by DispatchManager
 */

const makeSelectDispatchManager = () => createSelector(selectDispatchManagerDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectDispatchManager;
export { selectDispatchManagerDomain, makeSelectDashboardPage };
