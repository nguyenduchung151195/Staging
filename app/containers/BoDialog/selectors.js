import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';
/**
 * Direct selector to the boDialog state domain
 */

const selectBoDialogDomain = state => state.get('boDialog', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);
/**
 * Other specific selectors
 */

/**
 * Default selector used by BoDialog
 */

const makeSelectBoDialog = () => createSelector(selectBoDialogDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());

export default makeSelectBoDialog;
export { selectBoDialogDomain, selectDashBoardPageDomain, makeSelectDashboardPage };
