import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addNewCrmCollection state domain
 */

const selectAddNewCrmCollectionDomain = state => state.get('addNewCrmCollection', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddNewCrmCollection
 */

const makeSelectAddNewCrmCollection = () => createSelector(selectAddNewCrmCollectionDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectAddNewCrmCollectionDomain, substate => substate.get(listName));
export default makeSelectAddNewCrmCollection;
export { selectAddNewCrmCollectionDomain, makeSelectBody };
