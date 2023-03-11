import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHumanResourecePageDomain = state => state.get('humanResourecePage', initialState);

const makeSelectHumanResourecePage = () => createSelector(selectHumanResourecePageDomain, substate => substate.toJS());

export default makeSelectHumanResourecePage;
export { selectHumanResourecePageDomain };
