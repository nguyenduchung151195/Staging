import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';

/**
 * Direct selector to the addPaymentPage state domain
 */

const selectAddPaymentPageDomain = state => state.get('addPaymentPage', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddPaymentPage
 */

const makeSelectAddPaymentPage = () => createSelector(selectAddPaymentPageDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectAddPaymentPage;
export { selectAddPaymentPageDomain, makeSelectDashboardPage, selectDashBoardPageDomain };
