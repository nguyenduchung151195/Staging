import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addRelation state domain
 */

const selectAddRelationDomain = state => state.get('addRelation', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddRelation
 */

const makeSelectAddRelation = () => createSelector(selectAddRelationDomain, substate => substate.toJS());

export default makeSelectAddRelation;
export { selectAddRelationDomain };
