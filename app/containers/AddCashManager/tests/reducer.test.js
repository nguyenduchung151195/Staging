import { fromJS } from 'immutable';
import addCashManagerReducer from '../reducer';

describe('addCashManagerReducer', () => {
  it('returns the initial state', () => {
    expect(addCashManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
