import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editContractPage state domain
 */

const selectEditContractPageDomain = state => state.get('editContractPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditContractPage
 */

const makeSelectEditContractPage = () => createSelector(selectEditContractPageDomain, substate => substate.toJS());

export default makeSelectEditContractPage;
export { selectEditContractPageDomain };
