import { fromJS } from 'immutable';
import addFavoritePageReducer from '../reducer';

describe('addFavoritePageReducer', () => {
  it('returns the initial state', () => {
    expect(addFavoritePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
