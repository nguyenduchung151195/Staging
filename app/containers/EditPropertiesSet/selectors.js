import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editPropertiesSet state domain
 */

const selectEditPropertiesSetDomain = state => state.get('editPropertiesSet', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditPropertiesSet
 */

const makeSelectEditPropertiesSet = () => createSelector(selectEditPropertiesSetDomain, substate => substate.toJS());

export default makeSelectEditPropertiesSet;
export { selectEditPropertiesSetDomain };
