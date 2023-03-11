import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the favoritePage state domain
 */

const selectFavoritePageDomain = state => state.get('favoritePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by FavoritePage
 */

const makeSelectFavoritePage = () => createSelector(selectFavoritePageDomain, substate => substate.toJS());

export default makeSelectFavoritePage;
export { selectFavoritePageDomain };
