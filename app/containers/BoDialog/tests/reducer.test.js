import { fromJS } from 'immutable';
import boDialogReducer from '../reducer';

describe('boDialogReducer', () => {
  it('returns the initial state', () => {
    expect(boDialogReducer(undefined, {})).toEqual(fromJS({}));
  });
});
