import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the propertiesPage state domain
 */

const selectPropertiesPageDomain = state => state.get('propertiesPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by PropertiesPage
 */

const makeSelectPropertiesPage = () => createSelector(selectPropertiesPageDomain, substate => substate.toJS());
const makeSelectListProperties = () => createSelector(selectPropertiesPageDomain, substate => substate.get('propertiesList'));
const makeSelectPropertiesGroup = () => createSelector(selectPropertiesPageDomain, substate => substate.get('propertiesGroup'));
const makeSelectPropertiesSet = () => createSelector(selectPropertiesPageDomain, substate => substate.get('propertiesSet'));

export default makeSelectPropertiesPage;
export { selectPropertiesPageDomain, makeSelectListProperties, makeSelectPropertiesGroup, makeSelectPropertiesSet };
