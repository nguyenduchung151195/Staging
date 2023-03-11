import { fromJS } from 'immutable';
import addSalesQuotationReducer from '../reducer';

describe('addSalesQuotationReducer', () => {
  it('returns the initial state', () => {
    expect(addSalesQuotationReducer(undefined, {})).toEqual(fromJS({}));
  });
});
