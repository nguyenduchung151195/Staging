import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the experiencePage state domain
 */

const selectExperiencePageDomain = state => state.get('experiencePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by experiencePage
 */

const makeSelectExperiencePage = () => createSelector(selectExperiencePageDomain, substate => substate.toJS());

export default makeSelectExperiencePage;
export { selectExperiencePageDomain };
