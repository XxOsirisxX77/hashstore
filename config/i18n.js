import ReactNative from 'react-native';
import { Localization } from 'expo-localization';
import i18n from 'i18n-js';

import en from '../lang/en.json';
import es from '../lang/es.json';

i18n.fallbacks = true;
i18n.translations = { en, es };
i18n.locale = Localization.locale;

export const translate = i18n;
