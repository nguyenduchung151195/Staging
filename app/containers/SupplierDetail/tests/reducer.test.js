import { fromJS } from 'immutable';
import supplierDetailReducer from '../reducer';

describe('supplierDetailReducer', () => {
  it('returns the initial state', () => {
    expect(supplierDetailReducer(undefined, {})).toEqual(fromJS({}));
  });
});
