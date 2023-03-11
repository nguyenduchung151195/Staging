/*
 * Contract Messages
 *
 * This contains all the text for the Contract container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';

export const scope = 'app.containers.Contract';
const data = require('../../translations/en/Contract.json');

export default defineMessages(getDataI18N(scope, data));
