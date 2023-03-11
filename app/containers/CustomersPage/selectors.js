import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the customersPage state domain
 */

const selectCustomersPageDomain = state => state.get('customersPage', initialState);

const selectAddCustomerPageDomain = state => state.get('addCustomerPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CustomersPage
 */

const makeSelectCustomersPage = () => createSelector(selectCustomersPageDomain, substate => substate.toJS());
const makeSelectAddCustomerPage = () => createSelector(selectAddCustomerPageDomain, substate => substate.toJS());

export { selectCustomersPageDomain, makeSelectCustomersPage, makeSelectAddCustomerPage };
