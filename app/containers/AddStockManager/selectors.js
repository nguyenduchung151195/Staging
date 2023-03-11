import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addStockManager state domain
 */

const selectAddStockManagerDomain = state => state.get('addStockManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddStockManager
 */

const makeSelectAddStockManager = () => createSelector(selectAddStockManagerDomain, substate => substate.toJS());

export default makeSelectAddStockManager;
export { selectAddStockManagerDomain };
