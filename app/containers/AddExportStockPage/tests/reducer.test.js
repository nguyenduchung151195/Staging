import { fromJS } from 'immutable';
import addExportStockPageReducer from '../reducer';

describe('addExportStockPageReducer', () => {
  it('returns the initial state', () => {
    expect(addExportStockPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
