import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';

/**
 * Direct selector to the addReimbursementRequirePage state domain
 */

const selectAddReimbursementRequirePageDomain = state => state.get('addReimbursementRequirePage', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);
/**
 * Other specific selectors
 */

/**
 * Default selector used by AddReimbursementRequirePage
 */

const makeSelectAddReimbursementRequirePage = () => createSelector(selectAddReimbursementRequirePageDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectAddReimbursementRequirePage;
export { selectAddReimbursementRequirePageDomain, selectDashBoardPageDomain, makeSelectDashboardPage };
