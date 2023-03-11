import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSalary state domain
 */

const selectAddSalaryDomain = state => state.get('addSalary', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSalary
 */

const makeSelectAddSalary = () => createSelector(selectAddSalaryDomain, substate => substate.toJS());

export default makeSelectAddSalary;
export { selectAddSalaryDomain };
