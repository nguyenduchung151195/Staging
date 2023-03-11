import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the contactCenterPage state domain
 */

const selectContactCenterPageDomain = state => state.get('contactCenterPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ContactCenterPage
 */

const makeSelectContactCenterPage = () => createSelector(selectContactCenterPageDomain, substate => substate.toJS());

export default makeSelectContactCenterPage;
export { selectContactCenterPageDomain };
