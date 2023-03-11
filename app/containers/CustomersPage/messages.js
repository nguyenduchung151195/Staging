/*
 * CustomersPage Messages
 *
 * This contains all the text for the CustomersPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/CustomersPage.json');
export const scope = 'crm.CustomersPage';

export default defineMessages(getDataI18N(scope, data));
