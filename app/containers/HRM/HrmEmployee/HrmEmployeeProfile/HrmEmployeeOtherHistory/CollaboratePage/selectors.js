import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the CollaboratePage state domain
 */

const selectCollaboratePageDomain = state => state.get('collaboratePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CollaboratePage
 */

const makeSelectCollaboratePage = () => createSelector(selectCollaboratePageDomain, substate => substate.toJS());

export default makeSelectCollaboratePage;
export { selectCollaboratePageDomain };
