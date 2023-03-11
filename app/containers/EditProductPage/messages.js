/*
 * EditProductPage Messages
 *
 * This contains all the text for the EditProductPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';

export const scope = 'app.containers.EditProductPage';
export const scope1 = 'app.containers.AddNewProductPage';
const data = require('../../translations/en/AddProduct.json');

export default defineMessages(getDataI18N(scope1, data),{
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the EditProductPage container!',
  },
});
