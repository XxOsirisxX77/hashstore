import ReactNative from 'react-native';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '../lang/en.json';
import es from '../lang/es.json';

const i18n = new I18n({ en, es });
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.locale = getLocales()[0].languageTag;

export const translate = i18n;
