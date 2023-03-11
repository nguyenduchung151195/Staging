/*
 * TaskTimes Messages
 *
 * This contains all the text for the TaskTimes container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/TaskTimes.json');
export const scope = 'task.TaskTimes';

export default defineMessages(getDataI18N(scope, data));
