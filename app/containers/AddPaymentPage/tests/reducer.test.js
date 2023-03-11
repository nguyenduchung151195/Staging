import { fromJS } from 'immutable';
import addPaymentPageReducer from '../reducer';

describe('addPaymentPageReducer', () => {
  it('returns the initial state', () => {
    expect(addPaymentPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
