import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSalesManager state domain
 */

const selectAddSalesManagerDomain = state => state.get('addSalesManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSalesManager
 */

const makeSelectAddSalesManager = () => createSelector(selectAddSalesManagerDomain, substate => substate.toJS());

export default makeSelectAddSalesManager;
export { selectAddSalesManagerDomain };
