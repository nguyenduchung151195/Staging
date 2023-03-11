import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dashboardHome state domain
 */

const selectDashboardHomeDomain = state => state.get('addNewsFeed', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashboardHome
 */

const makeSelectAddTemplatePage = () => createSelector(selectDashboardHomeDomain, substate => substate.toJS());

export default makeSelectAddTemplatePage;
export { selectDashboardHomeDomain };
