/*
 * TaskRelatePage Messages
 *
 * This contains all the text for the TaskRelatePage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/TaskRelatePage.json');
export const scope = 'task.TaskRelatePage';

export default defineMessages(getDataI18N(scope, data));
