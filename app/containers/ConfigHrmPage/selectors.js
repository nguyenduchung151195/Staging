import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the configHrmPage state domain
 */

const selectConfigHrmPageDomain = state => state.get('configHrmPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ConfigHrmPage
 */

const makeSelectConfigHrmPage = () => createSelector(selectConfigHrmPageDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectConfigHrmPageDomain, substate => substate.get(listName));
export default makeSelectConfigHrmPage;
export { selectConfigHrmPageDomain, makeSelectBody };
