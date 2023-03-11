import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the contract state domain
 */

const selectContractDomain = state => state.get('contract', initialState);
const selectDashboardDomain = state => state.get('dashboardPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Contract
 */

const makeSelectContract = () => createSelector(selectContractDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashboardDomain, substate => substate.toJS());

export default makeSelectContract;
export { selectContractDomain,makeSelectDashboardPage };
