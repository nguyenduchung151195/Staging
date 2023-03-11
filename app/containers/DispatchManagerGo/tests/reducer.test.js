import { fromJS } from 'immutable';
import dispatchManagerGoReducer from '../reducer';

describe('dispatchManagerGoReducer', () => {
  it('returns the initial state', () => {
    expect(dispatchManagerGoReducer(undefined, {})).toEqual(fromJS({}));
  });
});
