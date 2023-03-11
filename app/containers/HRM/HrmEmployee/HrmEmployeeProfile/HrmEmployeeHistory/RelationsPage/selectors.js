import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the RelationPage state domain
 */

const selectRelationPageDomain = state => state.get('relationPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by RelationPage
 */

const makeSelectRelationPage = () => createSelector(selectRelationPageDomain, substate => substate.toJS());

export default makeSelectRelationPage;
export { selectRelationPageDomain };
