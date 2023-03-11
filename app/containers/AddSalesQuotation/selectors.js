import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSalesQuotation state domain
 */

const selectAddSalesQuotationDomain = state => state.get('addSalesQuotation', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSalesQuotation
 */

const makeSelectAddSalesQuotation = () => createSelector(selectAddSalesQuotationDomain, substate => substate.toJS());
const makeSelectTemplate = () => createSelector(selectAddSalesQuotationDomain, substate => substate.get('template').toJS());

export default makeSelectAddSalesQuotation;
export { selectAddSalesQuotationDomain, makeSelectTemplate };
