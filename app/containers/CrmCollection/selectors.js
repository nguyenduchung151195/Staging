import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';
/**
 * Direct selector to the crmCollection state domain
 */

const selectCrmCollectionDomain = state => state.get('crmCollection', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CrmCollection
 */

const makeSelectCrmCollection = () => createSelector(selectCrmCollectionDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectCrmCollection;
export { selectCrmCollectionDomain, makeSelectDashboardPage };
