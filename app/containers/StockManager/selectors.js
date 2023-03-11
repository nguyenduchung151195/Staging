import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the stockManager state domain
 */

const selectStockManagerDomain = state => state.get('stockManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by StockManager
 */

const makeSelectStockManager = () => createSelector(selectStockManagerDomain, substate => substate.toJS());

export default makeSelectStockManager;
export { selectStockManagerDomain };
