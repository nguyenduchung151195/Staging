import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addEducation state domain
 */

const selectAddEducationDomain = state => state.get('addEducation', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddEducation
 */

const makeSelectAddEducation = () => createSelector(selectAddEducationDomain, substate => substate.toJS());

export default makeSelectAddEducation;
export { selectAddEducationDomain };
