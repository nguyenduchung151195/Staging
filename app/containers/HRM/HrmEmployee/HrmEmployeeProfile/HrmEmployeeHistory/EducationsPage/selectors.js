import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the EducationPage state domain
 */

const selectEducationPageDomain = state => state.get('educationPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by EducationPage
 */

const makeSelectEducationPage = () => createSelector(selectEducationPageDomain, substate => substate.toJS());

export default makeSelectEducationPage;
export { selectEducationPageDomain };
