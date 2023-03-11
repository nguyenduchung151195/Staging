import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the stockConfigPage state domain
 */

const selectStockConfigPageDomain = state => state.get('stockConfigPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by StockConfigPage
 */

const makeSelectStockConfigPage = () => createSelector(selectStockConfigPageDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectStockConfigPageDomain, substate => substate.get(listName));
export default makeSelectStockConfigPage;
export { selectStockConfigPageDomain, makeSelectBody };
