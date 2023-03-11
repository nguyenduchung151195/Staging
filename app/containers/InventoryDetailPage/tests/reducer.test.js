import { fromJS } from 'immutable';
import inventoryDetailPageReducer from '../reducer';

describe('inventoryDetailPageReducer', () => {
  it('returns the initial state', () => {
    expect(inventoryDetailPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
