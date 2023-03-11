import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the salesQuotations state domain
 */

const selectSalesQuotationsDomain = state => state.get('salesQuotations', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SalesQuotations
 */

const makeSelectSalesQuotations = () => createSelector(selectSalesQuotationsDomain, substate => substate.toJS());

export default makeSelectSalesQuotations;
export { selectSalesQuotationsDomain };
