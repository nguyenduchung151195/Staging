import { fromJS } from 'immutable';
import editProductPageReducer from '../reducer';

describe('editProductPageReducer', () => {
  it('returns the initial state', () => {
    expect(editProductPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
