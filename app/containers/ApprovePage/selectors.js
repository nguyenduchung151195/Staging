import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the approvePage state domain
 */

const selectApprovePageDomain = state => state.get('approvePage', initialState);
const selectDashboardPageDomain = state => state.get('dashboardPage', initialState);
/**
 * Other specific selectors
 */

/**
 * Default selector used by ApprovePage
 */

const makeSelectApprovePage = () => createSelector(selectApprovePageDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectApprovePageDomain, substate => substate.get(listName));
const makeSelectDashboardPage = () => createSelector(selectDashboardPageDomain, substate => substate.toJS());
export default makeSelectApprovePage;
export { selectApprovePageDomain, makeSelectDashboardPage, makeSelectBody };
