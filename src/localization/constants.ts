/**
 * Constants and mappings for localization utilities
 */

import type { LocaleCurrencyInfo } from './types';

/**
 * Mapping of locales to their primary currencies
 */
export const LOCALE_CURRENCY_MAP: Record<string, LocaleCurrencyInfo> = {
  'en-US': {
    currency: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimalPlaces: 2,
    locale: 'en-US',
  },
  'en-GB': {
    currency: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimalPlaces: 2,
    locale: 'en-GB',
  },
  'de-DE': {
    currency: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimalPlaces: 2,
    locale: 'de-DE',
  },
  'fr-FR': {
    currency: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimalPlaces: 2,
    locale: 'fr-FR',
  },
  'ja-JP': {
    currency: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    decimalPlaces: 0,
    locale: 'ja-JP',
  },
  'zh-CN': {
    currency: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    decimalPlaces: 2,
    locale: 'zh-CN',
  },
  'es-ES': {
    currency: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimalPlaces: 2,
    locale: 'es-ES',
  },
  'pt-BR': {
    currency: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    decimalPlaces: 2,
    locale: 'pt-BR',
  },
  'en-NG': {
    currency: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    decimalPlaces: 2,
    locale: 'en-NG',
  },
};
