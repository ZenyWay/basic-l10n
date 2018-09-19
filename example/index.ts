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
import createL10ns from '../dist/index.js' // dev version with debug warnings
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
