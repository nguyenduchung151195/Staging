/**
 *
 * Asynchronously loads the component for Contract
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
