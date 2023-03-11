import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the stockImportPage state domain
 */

const selectStockImportPageDomain = state => state.get('stockImportPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by StockImportPage
 */

const makeSelectStockImportPage = () => createSelector(selectStockImportPageDomain, substate => substate.toJS());

export default makeSelectStockImportPage;
export { selectStockImportPageDomain };
