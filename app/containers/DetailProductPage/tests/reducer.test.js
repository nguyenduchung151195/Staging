import { fromJS } from 'immutable';
import detailProductPageReducer from '../reducer';

describe('detailProductPageReducer', () => {
  it('returns the initial state', () => {
    expect(detailProductPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
