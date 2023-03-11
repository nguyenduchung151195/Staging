import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the kpiConfig state domain
 */

const selectKpiConfigDomain = state => state.get('kpiConfig', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by KpiConfig
 */

const makeSelectKpiConfig = () => createSelector(selectKpiConfigDomain, substate => substate.toJS());

export default makeSelectKpiConfig;
export { selectKpiConfigDomain };
