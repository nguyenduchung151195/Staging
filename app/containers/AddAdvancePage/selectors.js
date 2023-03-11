import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';

/**
 * Direct selector to the addAdvancePage state domain
 */

const selectAddAdvancePageDomain = state => state.get('addAdvancePage', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddAdvancePage
 */

const makeSelectAddAdvancePage = () => createSelector(selectAddAdvancePageDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectAddAdvancePage;
export { selectAddAdvancePageDomain, makeSelectDashboardPage, selectDashBoardPageDomain };
