import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';

/**
 * Direct selector to the stockPage state domain
 */

const selectStockPageDomain = state => state.get('stockPage', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);

/**
 * Other specific selectors
 */

/**
 * Default selector used by StockPage
 */

const makeSelectStockPage = () => createSelector(selectStockPageDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectStockPage;
export { selectStockPageDomain, makeSelectDashboardPage, selectDashBoardPageDomain };
