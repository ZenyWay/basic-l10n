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
import createL10n from '../dist/index.js'
import logger from './console'
const log = logger()
const debug = logger('(debug)')

const localizations = {
  en: {
    'date: %s/%s/%s': 'date: %0/%1/%2',
    'you have %s new messages.': [
      'you have no new messages.',
      'you have one new message.',
      'you have %0 new messages.'
    ]
  },
  fr: {
    'date: %s/%s/%s': 'date: %1/%0/%2',
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
