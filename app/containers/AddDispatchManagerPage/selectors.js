import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';
/**
 * Direct selector to the addDispatchManagerPage state domain
 */

const selectAddDispatchManagerPageDomain = state => state.get('addDispatchManagerPage', initialState);
const selectDashboardDomain = state => state.get('dashboardPage', initialStateDashboard);
/**
 * Other specific selectors
 */

/**
 * Default selector used by AddDispatchManagerPage
 */

const makeSelectAddDispatchManagerPage = () => createSelector(selectAddDispatchManagerPageDomain, substate => substate.toJS());
// const makeSelectDashboardPage = listName => createSelector(selectDashboardDomain, substate => substate.get(listName));
const makeSelectDashboardPage = () => createSelector(selectDashboardDomain, substate => substate.toJS());
export default makeSelectAddDispatchManagerPage;
export { selectAddDispatchManagerPageDomain, makeSelectDashboardPage };
