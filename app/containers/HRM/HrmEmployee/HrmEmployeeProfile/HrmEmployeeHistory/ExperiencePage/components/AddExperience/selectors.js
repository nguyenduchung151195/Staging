import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addExperience state domain
 */

const selectAddExperienceDomain = state => state.get('addExperience', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddExperience
 */

const makeSelectAddExperience = () => createSelector(selectAddExperienceDomain, substate => substate.toJS());

export default makeSelectAddExperience;
export { selectAddExperienceDomain };
