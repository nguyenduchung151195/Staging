import { fromJS } from 'immutable';
import addNewProductPageReducer from '../reducer';

describe('addNewProductPageReducer', () => {
  it('returns the initial state', () => {
    expect(addNewProductPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
