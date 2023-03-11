import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the inventoryPage state domain
 */

const selectInventoryPageDomain = state => state.get('inventoryPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by InventoryPage
 */

const makeSelectInventoryPage = () => createSelector(selectInventoryPageDomain, substate => substate.toJS());

export default makeSelectInventoryPage;
export { selectInventoryPageDomain };
