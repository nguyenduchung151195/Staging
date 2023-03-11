import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the kpiProject state domain
 */

const selectKpiProjectDomain = state => state.get('kpiProject', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by KpiProject
 */

const makeSelectKpiProject = () => createSelector(selectKpiProjectDomain, substate => substate.toJS());

export default makeSelectKpiProject;
export { selectKpiProjectDomain };
