import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the configHrmPage state domain
 */

const selectConfigSalaryDomain = state => state.get('dataSalary', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ConfigHrmPage
 */

const makeSelectConfigSalary = () => createSelector(selectConfigSalaryDomain, substate => substate.toJS());
export default makeSelectConfigSalary;
export { selectConfigSalaryDomain };
