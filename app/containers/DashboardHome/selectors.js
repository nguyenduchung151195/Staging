import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dashboardHome state domain
 */

const selectDashboardHomeDomain = state => state.get('dashboardHome', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashboardHome
 */

const makeSelectDashboardHome = () => createSelector(selectDashboardHomeDomain, substate => substate.toJS());

export default makeSelectDashboardHome;
export { selectDashboardHomeDomain };
