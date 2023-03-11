import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the contactCenterFormPage state domain
 */

const selectContactCenterFormPageDomain = state => state.get('contactCenterFormPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ContactCenterFormPage
 */

const makeSelectContactCenterFormPage = () => createSelector(selectContactCenterFormPageDomain, substate => substate.toJS());

export default makeSelectContactCenterFormPage;
export { selectContactCenterFormPageDomain };
