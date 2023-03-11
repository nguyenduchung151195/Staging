import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the SocialPage state domain
 */

const selectSocialPageDomain = state => state.get('socialPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SocialPage
 */

const makeSelectSocialPage = () => createSelector(selectSocialPageDomain, substate => substate.toJS());

export default makeSelectSocialPage;
export { selectSocialPageDomain };
