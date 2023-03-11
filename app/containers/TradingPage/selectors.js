import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the businessOpportunities state domain
 */

const selectBusinessOpportunitiesDomain = state => state.get('trading', initialState);
const selectDashboardDomain = state => state.get('dashboardPage', initialState);
/**
 * Other specific selectors
 */

/**
 * Default selector used by BusinessOpportunities
 */

const makeSelectBusinessOpportunities = () => createSelector(selectBusinessOpportunitiesDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectBusinessOpportunitiesDomain, substate => substate.get(listName));
const makeSelectDashboardPage = listName => createSelector(selectDashboardDomain, substate => substate.get(listName));
export default makeSelectBusinessOpportunities;
export { selectBusinessOpportunitiesDomain, makeSelectBody, makeSelectDashboardPage };
