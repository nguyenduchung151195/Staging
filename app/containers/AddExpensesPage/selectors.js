import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addExpensesPage state domain
 */

const selectAddExpensesPageDomain = state => state.get('addExpensesPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddExpensesPage
 */

const makeSelectAddExpensesPage = () => createSelector(selectAddExpensesPageDomain, substate => substate.toJS());

export default makeSelectAddExpensesPage;
export { selectAddExpensesPageDomain };
