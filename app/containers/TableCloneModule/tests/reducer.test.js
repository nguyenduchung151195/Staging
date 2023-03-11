import { fromJS } from 'immutable';
import tableCloneModuleReducer from '../reducer';

describe('tableCloneModuleReducer', () => {
  it('returns the initial state', () => {
    expect(tableCloneModuleReducer(undefined, {})).toEqual(fromJS({}));
  });
});
