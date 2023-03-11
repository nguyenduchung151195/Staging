/**
 *
 * Asynchronously loads the component for TaskManager
 *
 */

 import loadable from 'loadable-components';

 export default loadable(() => import('./index'));
 