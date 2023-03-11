import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the assetPage state domain
 */

const selectAssetPageDomain = state => state.get('assetPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AssetPage
 */

const makeSelectAssetPage = () => createSelector(selectAssetPageDomain, substate => substate.toJS());

export default makeSelectAssetPage;
export { selectAssetPageDomain };
