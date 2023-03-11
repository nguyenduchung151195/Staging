/*
 * AddNewProductPage Messages
 *
 * This contains all the text for the AddNewProductPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';

export const scope = 'app.containers.AddNewProductPage';
const data = require('../../translations/en/AddProduct.json');

export default defineMessages(getDataI18N(scope, data));
