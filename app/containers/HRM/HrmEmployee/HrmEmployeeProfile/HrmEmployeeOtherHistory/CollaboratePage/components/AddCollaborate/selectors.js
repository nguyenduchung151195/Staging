import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addCollaborate state domain
 */

const selectAddCollaborateDomain = state => state.get('addCollaborate', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddCollaborate
 */

const makeSelectAddCollaborate = () => createSelector(selectAddCollaborateDomain, substate => substate.toJS());

export default makeSelectAddCollaborate;
export { selectAddCollaborateDomain };
