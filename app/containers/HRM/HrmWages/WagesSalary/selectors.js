import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the wagesMamagemen state domain
 */

const selectWageSalaryDomain = state => state.get('wageSalary', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WageSalary
 */

const makeSelectWageSalary = () => createSelector(selectWageSalaryDomain, substate => substate.toJS());
export default makeSelectWageSalary;
export { selectWageSalaryDomain };
