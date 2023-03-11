/*
 * AddBillPage Messages
 *
 * This contains all the text for the AddBillPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';

export const scope1 = 'app.containers.AddContract';
const data = require('../../translations/en/AddContract.json');

export const scope = 'app.containers.AddBillPage';

export default defineMessages(getDataI18N(scope1, data), {
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AddBillPage container!',
  },
});