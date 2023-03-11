import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';

/**
 * Direct selector to the addBillPage state domain
 */

const selectAddBillPageDomain = state => state.get('addBillPage', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddBillPage
 */

const makeSelectAddBillPage = () => createSelector(selectAddBillPageDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectAddBillPage;
export { selectAddBillPageDomain, selectDashBoardPageDomain, makeSelectDashboardPage };
