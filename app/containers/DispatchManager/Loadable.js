/**
 *
 * Asynchronously loads the component for DispatchManager
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
