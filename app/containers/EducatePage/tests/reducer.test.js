import { fromJS } from 'immutable';
import educatePageReducer from '../reducer';

describe('educatePageReducer', () => {
  it('returns the initial state', () => {
    expect(educatePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
