import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the salesEmployee state domain
 */

const selectSalesEmployeeDomain = state => state.get('salesEmployee', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SalesEmployee
 */

const makeSelectSalesEmployee = () => createSelector(selectSalesEmployeeDomain, substate => substate.toJS());

export default makeSelectSalesEmployee;
export { selectSalesEmployeeDomain };
