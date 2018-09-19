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
export interface L10nTag {
  (key: string): string
  (strings: TemplateStringsArray, ...substitutes: any[]): string
}

export interface L10nOptions {
  debug: (...args: any[]) => void
}

export type L10n = KVs<string[] | string>

export interface KVs <V> {
  [key: string]: V
}

const isArray: (val: any) => val is any[] = Array.isArray.bind(Array)

export default function createL10n (
  l10ns: KVs<L10n>,
  opts = {} as Partial<L10nOptions>
): KVs<L10nTag> {
  const _l10ns = map(l10ns, function (locale: string, l10n: L10n): L10nTag {
    const _l10n = map(l10n, function (_: any, t9n: string[] | string) {
      return isArray(t9n) ? t9n.slice() : t9n
    })
    return function localize (
      keyOrStrings: string | TemplateStringsArray,
    ...substitutes: any[]
    ): string {
      const isKey =
        !isArray(keyOrStrings && (keyOrStrings as TemplateStringsArray).raw)
      const key = isKey
        ? keyOrStrings as string
        : (keyOrStrings as TemplateStringsArray).join(
            substitutes.length ? '%s' : ''
          )
      const t9n = _l10n[key]
      if (process.env.NODE_ENV !== 'production') { // excluded from minified production build
        assert(opts, _l10n, t9n, locale, key, isKey)
      }
      return isKey
        ? (!t9n || isArray(t9n) ? key : t9n)
        : (
          !t9n
            ? (String.raw as Function)(...arguments)
            : substitute(t9n, substitutes)
        )
    }
  })

  return _l10ns
}

function substitute (translation: string | string[], substitutes: any[]) {
  const template = !isArray(translation)
    ? translation
    : getBounded(translation, substitutes[0]);
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

function map <T,U>(
  entries: KVs<T>,
  project: (key: string, val: T) => U
): KVs<U> {
  return Object.keys(entries).reduce(reduce, {} as KVs<U>)

  function reduce (result: KVs<U>, key: string) {
    result[key] = project(key, entries[key])
    return result
  }
}

// excluded from minified production build
function assert (
  { debug }: Partial<L10nOptions>,
  translations: { [key: string]: string | string[] },
  translation: string | string[],
  locale: string,
  key: string,
  isKey: boolean
) {
  if (!debug) { return }
  if (!translations) {
    return debug(
      `WARNING: undefined localizations for locale "${locale}"`
    )
  }
  if (!translation) {
    return debug(
      `WARNING: undefined localization for locale "${locale}" and key "${key}"`
    )
  }
  else if (isKey && isArray(translation)) {
    return debug(
      `WARNING: unexpected localization type for locale "${locale}" and key "${key}"`
    )
  }
}
