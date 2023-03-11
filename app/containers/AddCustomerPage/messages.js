// /*
//  * AddCustomerPage Messages
//  *
//  * This contains all the text for the AddCustomerPage container.
//  */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/AddCustomerPage.json');
export const scope = 'crm.AddCustomerPage';

export default defineMessages(getDataI18N(scope, data));
