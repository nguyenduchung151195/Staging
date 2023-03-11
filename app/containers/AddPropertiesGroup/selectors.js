import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addPropertiesGroup state domain
 */

const selectAddPropertiesGroupDomain = state => state.get('addPropertiesGroup', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddPropertiesGroup
 */

const makeSelectAddPropertiesGroup = () => createSelector(selectAddPropertiesGroupDomain, substate => substate.toJS());

export default makeSelectAddPropertiesGroup;
export { selectAddPropertiesGroupDomain };
