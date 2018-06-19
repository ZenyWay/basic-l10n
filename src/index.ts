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
  (strings: TemplateStringsArray, ...substitutions: any[]): string
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

export default function createL10n(
  localizations = {} as Localizations,
  { locale, debug } = {} as Partial<L10nOptions>
): L10nTag {
  ;(l10n as L10nTag).localizations = localizations
  const locales = localizations && Object.keys(localizations)
  ;(l10n as L10nTag).locale = locale || (locales && locales[0])

  return l10n as L10nTag

  function l10n (strings: TemplateStringsArray, ...substitutions: any[]): string {
    const locale = (l10n as L10nTag).locale
    const localizations = ((l10n as L10nTag).localizations || {})[locale]
    const key = strings.join('%s') // TODO
    const localization = localizations && localizations[key]
    if (process.env.NODE_ENV !== 'production') { // eliminated in minified build
      if (debug) {
        if (!localizations) {
          debug(`WARNING: undefined localizations for locale "${locales}"`)
        } else if (!localization) {
          debug(`WARNING: undefined localization for locale "${locale}" and key: "${key}"`)
        }
      }
    }
    if (!localization) {
      return (String.raw as Function)(...arguments)
    }
    const template = !Array.isArray(localization)
      ? localization
      : getBounded(localization, substitutions[0])
    const phrases = template.split(/%(\d+)/)
    let i = phrases.length
    while (--i > 0) {
      const k = phrases[--i]
      phrases[i] = substitutions[k]
    }
    return phrases.join('')
  }
}

function getBounded <T=any>(arr: T[], index: number): T {
  const length = arr.length
  return arr[index < length ? (index < 0 ? 0 : index) : (length - 1)]
}
