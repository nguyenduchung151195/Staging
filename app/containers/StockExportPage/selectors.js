import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the stockExportPage state domain
 */

const selectStockExportPageDomain = state => state.get('stockExportPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by StockExportPage
 */

const makeSelectStockExportPage = () => createSelector(selectStockExportPageDomain, substate => substate.toJS());

export default makeSelectStockExportPage;
export { selectStockExportPageDomain };
