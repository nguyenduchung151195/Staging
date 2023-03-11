/*
 * AddDispatchManagerPage Messages
 *
 * This contains all the text for the AddDispatchManagerPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/AddCustomerPage.json');
export const scope1 = 'crm.AddCustomerPage';

export const scope = 'app.containers.AddDispatchManagerPage';

export default defineMessages(getDataI18N(scope1, data),{
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AddDispatchManagerPage container!',
  },
});