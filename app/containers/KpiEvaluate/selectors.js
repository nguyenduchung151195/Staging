import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the kpiEvaluate state domain
 */

const selectKpiEvaluateDomain = state => state.get('kpiEvaluate', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by KpiEvaluate
 */

const makeSelectKpiEvaluate = () => createSelector(selectKpiEvaluateDomain, substate => substate.toJS());

export default makeSelectKpiEvaluate;
export { selectKpiEvaluateDomain };
