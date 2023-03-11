import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';
/**
 * Direct selector to the dispatchManagerGo state domain
 */

const selectDispatchManagerGoDomain = state => state.get('dispatchManagerGo', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);
/**
 * Other specific selectors
 */

/**
 * Default selector used by DispatchManagerGo
 */

const makeSelectDispatchManagerGo = () => createSelector(selectDispatchManagerGoDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectDispatchManagerGo;
export { selectDispatchManagerGoDomain, makeSelectDashboardPage };
