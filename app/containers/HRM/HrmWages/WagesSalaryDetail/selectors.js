import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the wagesMamagemen state domain
 */

const selectWageSalaryDetailDomain = state => state.get('wageSalaryDetail', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WageSalary
 */

const makeSelectWageSalaryDetail = () => createSelector(selectWageSalaryDetailDomain, substate => substate.toJS());
export default makeSelectWageSalaryDetail;
export { selectWageSalaryDetailDomain };
