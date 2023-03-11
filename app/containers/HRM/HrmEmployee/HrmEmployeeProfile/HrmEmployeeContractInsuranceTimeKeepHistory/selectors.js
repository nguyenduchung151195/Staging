import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ContractInsuranceAndTimeKeep state domain
 */

const selectContractInsuranceAndTimeKeepDomain = state => state.get('contractInsuranceAndTimeKeep', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ContractInsuranceAndTimeKeep
 */

const makeSelectContractInsuranceAndTimeKeep = () => createSelector(selectContractInsuranceAndTimeKeepDomain, substate => substate.toJS());

export default makeSelectContractInsuranceAndTimeKeep;
export { selectContractInsuranceAndTimeKeepDomain };
