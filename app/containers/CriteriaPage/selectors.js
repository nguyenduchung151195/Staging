import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the criteriaPage state domain
 */

const selectCriteriaPageDomain = state => state.get('criteriaPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CriteriaPage
 */

const makeSelectCriteriaPage = () => createSelector(selectCriteriaPageDomain, substate => substate.toJS());

export default makeSelectCriteriaPage;
export { selectCriteriaPageDomain };
