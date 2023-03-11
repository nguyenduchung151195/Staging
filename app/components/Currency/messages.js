/*
 * Currency Messages
 *
 * This contains all the text for the Currency container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/Currency.json');
export const scope = 'crm.Currency';

export default defineMessages(getDataI18N(scope, data));
