import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the wagesMamagemen state domain
 */

const selectWagesManagementDomain = state => state.get('wagesManagement', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WagesManagement
 */

const makeSelectWagesManagement = () => createSelector(selectWagesManagementDomain, substate => substate.toJS());
export default makeSelectWagesManagement;
export { selectWagesManagementDomain };
