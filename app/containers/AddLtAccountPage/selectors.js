import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectAccountManage = state => state.get('accountRequest', initialState);

const makeSelectAddLtAccount = () => createSelector(selectAccountManage, substate => substate.toJS());

export default makeSelectAddLtAccount;
export { selectAccountManage };