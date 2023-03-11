import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSocial state domain
 */

const selectAddSocialDomain = state => state.get('addSocial', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSocial
 */

const makeSelectAddSocial = () => createSelector(selectAddSocialDomain, substate => substate.toJS());

export default makeSelectAddSocial;
export { selectAddSocialDomain };
