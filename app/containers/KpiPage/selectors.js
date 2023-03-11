import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the kpiPage state domain
 */

const selectKpiPageDomain = state => state.get('kpiPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by KpiPage
 */

const makeSelectKpiPage = () => createSelector(selectKpiPageDomain, substate => substate.toJS());

export default makeSelectKpiPage;
export { selectKpiPageDomain };
