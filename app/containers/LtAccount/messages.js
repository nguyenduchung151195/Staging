/*
 * TotalTask Messages
 *
 * This contains all the text for the TotalTask container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/TotalTask.json');
export const scope = 'task.TotalTask';

export default defineMessages(getDataI18N(scope, data));
