# basic-l10n
[![NPM](https://nodei.co/npm/basic-l10n.png?compact=true)](https://nodei.co/npm/basic-l10n/)

basic localization of strings (396 bytes gzip, no dependencies),
including pluralization and reordering of substitutions with template literals.

in the non-minified version (`basic-l10n/dist/index.js`),
unknown template literals generate a warning when a logger is provided,
unless `process.env.NODE_ENV === "production"`.
in all cases, unknown template literals are returned
as they would from the default template function,
without localization.

# Example
see this [example](./example/index.ts) in this directory.<br/>
run this example [in your browser](https://cdn.rawgit.com/ZenyWay/basic-l10n/v2.0.0/example/index.html).
```ts
import createL10ns from 'basic-l10n/dist/index.js' // dev version with debug warnings
import logger from './console'
const log = logger()
const debug = logger('(debug)')

const localizations = {
  fr: {
    'welcome': 'bienvenue', // default string localization
    'date: %s/%s/%s': 'date: %1/%0/%2', // reorder substitutions
    'you have %s new messages.': [ // pluralization
      'vous n\'avez pas de nouveaux messages.', // 0
      'vous avez un nouveau message.', // 1
      'vous avez %0 nouveaux messages.' // 2
      // not limited to 3 entries, could be any number
    ]
  },
  en: {
    'welcome': 'welcome',
    'date: %s/%s/%s': 'date: %0/%1/%2',
    'you have %s new messages.': [
      'you have no new messages.',
      'you have one new message.',
      'you have %0 new messages.'
    ]
  }
}

const l10ns = createL10ns(localizations, { debug })

for (const lang of ['en', 'fr']) {
  const t = l10ns[lang]
  log(t('welcome')) // default string localization
  log(t`date: ${1}/${7}/${1982}`) // reordering with template strings
  for (const count of [0, 1, 5]) {
    log(t`you have ${count} new messages.`) // pluralization with template strings
  }
}
log(l10ns.en`unknown keys generate a warning`) // except in production
```
[output to console](https://cdn.rawgit.com/ZenyWay/basic-l10n/v2.0.0/example/index.html):
```
welcome
date: 1/7/1982
you have no new messages.
you have one new message.
you have 5 new messages.
bienvenue
date: 7/1/1982
vous n'avez pas de nouveaux messages.
vous avez un nouveau message.
vous avez 5 nouveaux messages.
(debug) WARNING: undefined localization for locale "fr" and key "unknown template literals generate a warning"
unknown template literals generate a warning
```
# API v2
```ts
export interface L10nTag {
  (key: string): string
  (strings: TemplateStringsArray, ...substitutes: any[]): string
}

export interface L10nOptions {
  debug: (...args: any[]) => void
}

export declare type L10n = KVs<string[] | string>

export interface KVs<V> {
  [key: string]: V
}

export default function createL10n(
  l10ns: KVs<L10n>,
  opts?: Partial<L10nOptions>
): KVs<L10nTag>
```
for a detailed specification of this API,
in particular for handling of corner cases,
run the [unit tests](https://cdn.rawgit.com/ZenyWay/basic-l10n/v2.0.0/spec/web/index.html)
in your browser.

# TypeScript
although this library is written in [TypeScript](https://www.typescriptlang.org),
it may also be imported into plain JavaScript code:
modern code editors will still benefit from the available type definition,
e.g. for helpful code completion.

# License
Copyright 2018 Stéphane M. Catala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the [License](./LICENSE) for the specific language governing permissions and
Limitations under the License.
