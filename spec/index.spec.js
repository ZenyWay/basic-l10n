'use strict' /* eslint-env jasmine */
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
//
const createL10n = require('../').default

describe('createL10n:', function () {
  let localizations, l10n
  beforeEach(function () {
    localizations = {
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
    l10n = createL10n(localizations)
  })
  it('returns a function.', function () {
    expect(l10n).toEqual(jasmine.any(Function))
  })

  describe('the returned function:', function () {
    it('exposes a "locale" string property', function () {
      expect(l10n.locale).toEqual(jasmine.any(String))
    })
    it('exposes a "localizations" object property', function () {
      expect(l10n.localizations).toEqual(jasmine.any(Object))
    })
    describe('when called as tag function with a known template literal',
    function () {
      let res
      beforeEach(function () {
        l10n.locale = 'fr'
        res = l10n`date: ${7}/${1}/${1982}`
      })
      it('returns a localized string', function () {
        expect(res).toBe('date: 1/7/1982')
      })
    })
    describe('when called as tag function with a known template literal for plurals',
    function () {
      let res
      beforeEach(function () {
        l10n.locale = 'fr'
        res = [0, 1, 5].map((count) => l10n`you have ${count} new messages.`)
      })
      it('returns a correspondingly pluralized localized string', function () {
        expect(res).toEqual([
          'vous n\'avez pas de nouveaux messages.',
          'vous avez un nouveau message.',
          'vous avez 5 nouveaux messages.'
        ])
      })
    })
  })
})
