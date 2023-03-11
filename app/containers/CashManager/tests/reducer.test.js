import { fromJS } from 'immutable';
import cashManagerReducer from '../reducer';

describe('cashManagerReducer', () => {
  it('returns the initial state', () => {
    expect(cashManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
