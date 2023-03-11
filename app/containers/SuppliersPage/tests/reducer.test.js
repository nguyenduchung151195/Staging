import { fromJS } from 'immutable';
import suppliersPageReducer from '../reducer';

describe('suppliersPageReducer', () => {
  it('returns the initial state', () => {
    expect(suppliersPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
