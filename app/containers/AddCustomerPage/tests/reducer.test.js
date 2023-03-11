import { fromJS } from 'immutable';
import addCustomerPageReducer from '../reducer';

describe('addCustomerPageReducer', () => {
  it('returns the initial state', () => {
    expect(addCustomerPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
