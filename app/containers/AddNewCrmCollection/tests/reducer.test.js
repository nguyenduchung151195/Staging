import { fromJS } from 'immutable';
import addNewCrmCollectionReducer from '../reducer';

describe('addNewCrmCollectionReducer', () => {
  it('returns the initial state', () => {
    expect(addNewCrmCollectionReducer(undefined, {})).toEqual(fromJS({}));
  });
});
