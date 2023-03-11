import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addKpiEvaluate state domain
 */

const selectAddKpiEvaluateDomain = state => state.get('addKpiEvaluate', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddKpiEvaluate
 */

const makeSelectAddKpiEvaluate = () => createSelector(selectAddKpiEvaluateDomain, substate => substate.toJS());

export default makeSelectAddKpiEvaluate;
export { selectAddKpiEvaluateDomain };
