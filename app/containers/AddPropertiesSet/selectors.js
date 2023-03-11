import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addPropertiesSet state domain
 */

const selectAddPropertiesSetDomain = state => state.get('addPropertiesSet', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddPropertiesSet
 */

const makeSelectAddPropertiesSet = () => createSelector(selectAddPropertiesSetDomain, substate => substate.toJS());

export default makeSelectAddPropertiesSet;
export { selectAddPropertiesSetDomain };
