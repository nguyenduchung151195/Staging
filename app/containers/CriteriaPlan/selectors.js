import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the criteriaPlan state domain
 */

const selectCriteriaPlanDomain = state => state.get('criteriaPlan', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CriteriaPlan
 */

const makeSelectCriteriaPlan = () => createSelector(selectCriteriaPlanDomain, substate => substate.toJS());

export default makeSelectCriteriaPlan;
export { selectCriteriaPlanDomain };
