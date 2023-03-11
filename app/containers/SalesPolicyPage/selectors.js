import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the salesPolicyPage state domain
 */

const selectSalesPolicyPageDomain = state => state.get('salesPolicyPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SalesPolicyPage
 */

const makeSelectSalesPolicyPage = () => createSelector(selectSalesPolicyPageDomain, substate => substate.toJS());

export default makeSelectSalesPolicyPage;
export { selectSalesPolicyPageDomain };
