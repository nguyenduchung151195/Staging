import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addContractPage state domain
 */

const selectAddContractPageDomain = state => state.get('addContractPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddContractPage
 */

const makeSelectAddContractPage = () => createSelector(selectAddContractPageDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectAddContractPageDomain, substate => substate.get(listName));

export default makeSelectAddContractPage;
export { selectAddContractPageDomain, makeSelectBody };
