import { fromJS } from 'immutable';
import stockImportPageReducer from '../reducer';

describe('stockImportPageReducer', () => {
  it('returns the initial state', () => {
    expect(stockImportPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
