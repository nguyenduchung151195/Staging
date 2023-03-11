import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addExpenseManage state domain
 */

const selectAddExpenseManageDomain = state => state.get('addExpenseManage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddExpenseManage
 */

const makeSelectAddExpenseManage = () => createSelector(selectAddExpenseManageDomain, substate => substate.toJS());

export default makeSelectAddExpenseManage;
export { selectAddExpenseManageDomain };
