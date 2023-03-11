import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the inventoryDetailPage state domain
 */

const selectInventoryDetailPageDomain = state => state.get('inventoryDetailPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by InventoryDetailPage
 */

const makeSelectInventoryDetailPage = () => createSelector(selectInventoryDetailPageDomain, substate => substate.toJS());

export default makeSelectInventoryDetailPage;
export { selectInventoryDetailPageDomain };
