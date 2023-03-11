import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addFavoritePage state domain
 */

const selectAddFavoritePageDomain = state => state.get('addFavoritePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddFavoritePage
 */

const makeSelectAddFavoritePage = () => createSelector(selectAddFavoritePageDomain, substate => substate.toJS());

export default makeSelectAddFavoritePage;
export { selectAddFavoritePageDomain };
