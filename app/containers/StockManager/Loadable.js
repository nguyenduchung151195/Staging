/**
 *
 * Asynchronously loads the component for StockManager
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
