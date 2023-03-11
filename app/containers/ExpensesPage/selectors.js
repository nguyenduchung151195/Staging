import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the expensesPage state domain
 */

const selectExpensesPageDomain = state => state.get('expensesPage', initialState);
const selectDashboardDomain = state => state.get('dashboardPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ExpensesPage
 */

const makeSelectExpensesPage = () => createSelector(selectExpensesPageDomain, substate => substate.toJS());
const makeSelectDashboardPage = listName => createSelector(selectDashboardDomain, substate => substate.get(listName));

export default makeSelectExpensesPage;
export { selectExpensesPageDomain, makeSelectDashboardPage };
