import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';
/**
 * Direct selector to the addImportProduct state domain
 */

const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);
const selectAddImportProductDomain = state => state.get('addImportProduct', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddImportProduct
 */

const makeSelectAddImportProduct = () => createSelector(selectAddImportProductDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());
export default makeSelectAddImportProduct;
export { selectAddImportProductDomain, selectDashBoardPageDomain, makeSelectDashboardPage };
