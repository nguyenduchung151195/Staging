import { fromJS } from 'immutable';
import payManagerReducer from '../reducer';

describe('payManagerReducer', () => {
  it('returns the initial state', () => {
    expect(payManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
