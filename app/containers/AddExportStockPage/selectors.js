import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { initialState as initialStateDashboard } from '../Dashboard/reducer';
import { initialState as initialStateHocTable } from '../HocTable/reducer';

/**
 * Direct selector to the addExportStockPage state domain
 */

const selectAddExportStockPageDomain = state => state.get('addExportStockPage', initialState);
const selectDashBoardPageDomain = state => state.get('dashboardPage', initialStateDashboard);
const selectHocTableDomain = state => state.get('hocTable', initialStateHocTable);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddExportStockPage
 */

const makeSelectAddExportStockPage = () => createSelector(selectAddExportStockPageDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashBoardPageDomain, substate => substate.toJS());
const makeSelectHocTable = () => createSelector(selectHocTableDomain, substate => substate.toJS());

export default makeSelectAddExportStockPage;
export { selectAddExportStockPageDomain, makeSelectDashboardPage, makeSelectHocTable };
