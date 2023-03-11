/*
 *
 * FavoritePage actions
 *
 */

import { DEFAULT_ACTION, SHOW_DRAWER_SCREEN } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
// TT
export function showDrawerScreen(data) {
  return {
    type: SHOW_DRAWER_SCREEN,
    data,
  };
}
