import { fromJS } from 'immutable';
import customersPageReducer from '../reducer';

describe('customersPageReducer', () => {
  it('returns the initial state', () => {
    expect(customersPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
