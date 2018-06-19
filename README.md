# basic-l10n
[![NPM](https://nodei.co/npm/basic-l10n.png?compact=true)](https://nodei.co/npm/basic-l10n/)

basic localization of template literals (360 bytes gzip),
including pluralization and reordering of substitutions.
no dependencies.

in the non-minified version (`basic-l10n/dist/index.js`),
unknown template literals generate a warning when a logger is provided,
unless `process.env.NODE_ENV === "production"`.
in all cases, unknown template literals are returned
as they would from the default template function,
without localization.

# Example
see this [example](./example/index.ts) in this directory.<br/>
run this example [in your browser](https://cdn.rawgit.com/ZenyWay/basic-l10n/v1.0.0/example/index.html).
```ts
import createL10n from 'basic-l10n/dist/index.js' // dev version with debug warnings
import log from './console'
const log = logger()
const debug = logger('(debug)')

const localizations = {
  en: {
    'date: %s/%s/%s': 'date: %0/%1/%2',
    'you have %s new messages.': [ // pluralization
      'you have no new messages.', // 0
      'you have one new message.', // 1
      'you have %0 new messages.' // 2 and more
      // not limited to 3 entries, could be any number
    ]
  },
  fr: {
    'date: %s/%s/%s': 'date: %1/%0/%2', // reorder substitutions
    'you have %s new messages.': [
      'vous n\'avez pas de nouveaux messages.',
      'vous avez un nouveau message.',
      'vous avez %0 nouveaux messages.'
    ]
  }
}

const l10n = createL10n(localizations, { debug })

for (const lang of ['en', 'fr']) {
  l10n.locale = lang
  log(l10n`date: ${1}/${7}/${1982}`)
  for (const count of [0, 1, 5]) {
    log(l10n`you have ${count} new messages.`)
  }
}
log(l10n`unknown template literals generate a warning`)
```
[output to console](https://cdn.rawgit.com/ZenyWay/basic-l10n/v1.0.0/example/index.html):
```
date: 1/7/1982
you have no new messages.
you have one new message.
you have 5 new messages.
date: 7/1/1982
vous n'avez pas de nouveaux messages.
vous avez un nouveau message.
vous avez 5 nouveaux messages.
(debug) WARNING: undefined localization for locale "fr" and key: "unknown template literals generate a warning"
unknown template literals generate a warning
```
# API
```ts
export default function createL10n(
  localizations?: Localizations,
  opts?: Partial<L10nOptions>
): L10nTag

export interface L10nTag {
  (strings: TemplateStringsArray, ...substitutions: any[]): string
  localizations: Localizations
  locale: string
}
export interface Localizations {
  [locale: string]: {
    [key: string]: string[] | string
  }
}
export interface L10nOptions {
  locale: string
  debug: (...args: any[]) => void
}
```
for a detailed specification of this API,
in particular for handling of corner cases,
run the [unit tests](https://cdn.rawgit.com/ZenyWay/basic-l10n/v1.0.0/spec/web/index.html)
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
