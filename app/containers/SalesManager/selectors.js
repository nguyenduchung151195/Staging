import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the salesManager state domain
 */

const selectSalesManagerDomain = state => state.get('salesManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SalesManager
 */

const makeSelectSalesManager = () => createSelector(selectSalesManagerDomain, substate => substate.toJS());

export default makeSelectSalesManager;
export { selectSalesManagerDomain };
