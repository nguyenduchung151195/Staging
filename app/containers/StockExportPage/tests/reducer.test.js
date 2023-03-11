import { fromJS } from 'immutable';
import stockExportPageReducer from '../reducer';

describe('stockExportPageReducer', () => {
  it('returns the initial state', () => {
    expect(stockExportPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
