/**
 * @license
 * Copyright 2018 Stephane M. Catala
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * Limitations under the License.
 */
;
export interface L10nTag {
  (key: string): string
  (strings: TemplateStringsArray, ...substitutes: any[]): string
  localizations: Localizations
  locale: string
}

export interface Localizations {
  [locale: string]: {
    [key: string]: string[]|string
  }
}

export interface L10nOptions {
  locale: string
  debug: (...args: any[]) => void
}

const isArray: (val: any) => val is any[] = Array.isArray.bind(Array)

export default function createL10n(
  localizations = {} as Localizations,
  opts = {} as Partial<L10nOptions>
): L10nTag {
  ;(l10n as L10nTag).localizations = localizations
  const locales = localizations && Object.keys(localizations)
  ;(l10n as L10nTag).locale = opts.locale || (locales && locales[0])

  return l10n as L10nTag

  function l10n (key: string): string
  function l10n (strings: TemplateStringsArray, ...substitutes: any[]): string
  function l10n (
    keyOrStrings: string|TemplateStringsArray,
    ...substitutes: any[]
  ): string {
    const locale = (l10n as L10nTag).locale
    const localizations = ((l10n as L10nTag).localizations || {})[locale]
    const isKey = !isArray(keyOrStrings && (keyOrStrings as TemplateStringsArray).raw)
    const numSubstitutes = substitutes.length
    const key = isKey
      ? keyOrStrings as string
      : (keyOrStrings as TemplateStringsArray).join(numSubstitutes ? '%s' : '')
    const localization = localizations && localizations[key]
    if (process.env.NODE_ENV !== 'production') { // excluded from minified production build
      assert(opts, localizations, localization, locale, key, isKey)
    }
    return isKey
      ? (!localization || isArray(localization) ? key : localization)
      : (
        !localization
          ? (String.raw as Function)(...arguments)
          : substitute(localization, substitutes)
      )
  }
}

function substitute (localization: string | string[], substitutes: any[]) {
  const template = !isArray(localization)
    ? localization
    : getBounded(localization, substitutes[0]);
  const phrases = template.split(/%(\d+)/);
  let i = phrases.length;
  while (--i > 0) {
    const k = phrases[--i];
    phrases[i] = substitutes[k];
  }
  return phrases.join('');
}

function getBounded <T=any>(arr: T[], index: number): T {
  const length = arr.length
  return arr[index < length ? (index < 0 ? 0 : index) : (length - 1)]
}

// excluded from minified production build
function assert(
  { debug }: Partial<L10nOptions>,
  localizations: { [key: string]: string | string[] },
  localization: string | string[],
  locale: string,
  key: string,
  isKey: boolean
) {
  if (!debug) { return }
  if (!localizations) {
    return debug(
      `WARNING: undefined localizations for locale "${locale}"`
    )
  }
  if (!localization) {
    return debug(
      `WARNING: undefined localization for locale "${locale}" and key "${key}"`
    )
  }
  else if (isKey && isArray(localization)) {
    return debug(
      `WARNING: unexpected localization type for locale "${locale}" and key "${key}"`
    )
  }
}
