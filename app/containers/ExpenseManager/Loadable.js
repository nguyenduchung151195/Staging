/**
 *
 * Asynchronously loads the component for ExpenseManager
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
