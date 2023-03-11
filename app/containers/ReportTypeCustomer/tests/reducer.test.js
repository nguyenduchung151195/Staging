import { fromJS } from 'immutable';
import reportTypeCustomerReducer from '../reducer';

describe('reportTypeCustomerReducer', () => {
  it('returns the initial state', () => {
    expect(reportTypeCustomerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
