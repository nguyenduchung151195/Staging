import { fromJS } from 'immutable';
import addSupplierPageReducer from '../reducer';

describe('addSupplierPageReducer', () => {
  it('returns the initial state', () => {
    expect(addSupplierPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
