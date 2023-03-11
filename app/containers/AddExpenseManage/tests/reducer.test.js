import { fromJS } from 'immutable';
import addExpenseManageReducer from '../reducer';

describe('addExpenseManageReducer', () => {
  it('returns the initial state', () => {
    expect(addExpenseManageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
