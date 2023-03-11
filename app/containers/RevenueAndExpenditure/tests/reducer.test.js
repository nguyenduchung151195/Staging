import { fromJS } from 'immutable';
import revenueAndExpenditureReducer from '../reducer';

describe('revenueAndExpenditureReducer', () => {
  it('returns the initial state', () => {
    expect(revenueAndExpenditureReducer(undefined, {})).toEqual(fromJS({}));
  });
});
