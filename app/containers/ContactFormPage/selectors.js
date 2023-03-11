import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the contactFormPage state domain
 */

const selectContactFormPageDomain = state => state.get('contactFormPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ContactFormPage
 */

const makeSelectContactFormPage = () => createSelector(selectContactFormPageDomain, substate => substate.toJS());

export default makeSelectContactFormPage;
export { selectContactFormPageDomain };
