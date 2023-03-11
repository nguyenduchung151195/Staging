import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addKpiConfig state domain
 */

const selectAddKpiConfigDomain = state => state.get('addKpiConfig', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddKpiConfig
 */

const makeSelectAddKpiConfig = () => createSelector(selectAddKpiConfigDomain, substate => substate.toJS());

export default makeSelectAddKpiConfig;
export { selectAddKpiConfigDomain };
