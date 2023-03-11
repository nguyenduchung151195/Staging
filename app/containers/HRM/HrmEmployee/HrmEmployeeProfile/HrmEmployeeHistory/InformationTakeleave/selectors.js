import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the salaryPage state domain
 */

const selectSalaryPageDomain = state => state.get('salaryPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SalaryPage
 */

const makeSelectSalaryPage = () => createSelector(selectSalaryPageDomain, substate => substate.toJS());

export default makeSelectSalaryPage;
export { selectSalaryPageDomain };
