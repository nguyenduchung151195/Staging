import { fromJS } from 'immutable';
import addSupplierContractReducer from '../reducer';

describe('addSupplierContractReducer', () => {
  it('returns the initial state', () => {
    expect(addSupplierContractReducer(undefined, {})).toEqual(fromJS({}));
  });
});
