import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';

/**
 * Direct selector to the addNewProductPage state domain
 */

const selectAddNewProductPageDomain = state => state.get('addNewProductPage', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddNewProductPage
 */

const makeSelectAddNewProductPage = () => createSelector(selectAddNewProductPageDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectAddNewProductPage;
export { selectAddNewProductPageDomain, makeSelectDashboardPage, selectDashBoardPageDomain };
