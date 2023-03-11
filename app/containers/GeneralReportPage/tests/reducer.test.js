import { fromJS } from 'immutable';
import favoritePageReducer from '../reducer';

describe('favoritePageReducer', () => {
  it('returns the initial state', () => {
    expect(favoritePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
