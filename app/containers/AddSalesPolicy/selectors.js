import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSalesPolicy state domain
 */

const selectAddSalesPolicyDomain = state => state.get('addSalesPolicy', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSalesPolicy
 */

const makeSelectAddSalesPolicy = () => createSelector(selectAddSalesPolicyDomain, substate => substate.toJS());

export default makeSelectAddSalesPolicy;
export { selectAddSalesPolicyDomain };
