import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the expenseManager state domain
 */

const selectExpenseManagerDomain = state => state.get('expenseManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ExpenseManager
 */

const makeSelectExpenseManager = () => createSelector(selectExpenseManagerDomain, substate => substate.toJS());

export default makeSelectExpenseManager;
export { selectExpenseManagerDomain };
