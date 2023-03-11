import { fromJS } from 'immutable';
import addImportProductReducer from '../reducer';

describe('addImportProductReducer', () => {
  it('returns the initial state', () => {
    expect(addImportProductReducer(undefined, {})).toEqual(fromJS({}));
  });
});
