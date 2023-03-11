import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';
/**
 * Direct selector to the addImportProduct state domain
 */

const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);
const selectAddImportStockDomain = state => state.get('addImportStock', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddImportProduct
 */

const makeSelectAddImportStock = () => createSelector(selectAddImportStockDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());
export default makeSelectAddImportStock;
export { selectAddImportStockDomain, selectDashBoardPageDomain, makeSelectDashboardPage };
