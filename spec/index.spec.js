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
  let localizations, l10ns
  beforeEach(function () {
    localizations = {
      en: {
        'welcome': 'welcome',
        'date: %s/%s/%s': 'date: %0/%1/%2',
        'you have %s new messages.': [
          'you have no new messages.',
          'you have one new message.',
          'you have %0 new messages.'
        ]
      },
      fr: {
        'welcome': 'bienvenue',
        'date: %s/%s/%s': 'date: %1/%0/%2',
        'you have %s new messages.': [
          'vous n\'avez pas de nouveaux messages.',
          'vous avez un nouveau message.',
          'vous avez %0 nouveaux messages.'
        ]
      }
    }
    l10ns = createL10n(localizations)
  })

  it('returns a key-value map with the same keys ' +
  'as the given localizations map, i.e. the locales.', function () {
    expect(Object.keys(l10ns)).toEqual(['en', 'fr'])
  })

  describe('each value of the returned key-value map:', function () {
    let t
    beforeEach(function () {
      t = l10ns.fr
    })

    it('is a function', function () {
      Object.keys(l10ns).forEach(
        locale => expect(l10ns[locale]).toEqual(jasmine.any(Function))
      )
    })

    describe('when called with a known string key', function () {
      let res
      beforeEach(function () {
        res = t('welcome')
      })

      it('returns a localized string', function () {
        expect(res).toBe('bienvenue')
      })
    })

    describe('when called as tag function ' +
    'with a known template literal', function () {
      let res
      beforeEach(function () {
        res = t`date: ${7}/${1}/${1982}`
      })

      it('returns a localized string', function () {
        expect(res).toBe('date: 1/7/1982')
      })
    })

    describe('when called as tag function ' +
    'with a known template literal for plurals', function () {
      let res
      beforeEach(function () {
        res = [0, 1, 5].map((count) => t`you have ${count} new messages.`)
      })

      it('returns a correspondingly pluralized localized string', function () {
        expect(res).toEqual([
          'vous n\'avez pas de nouveaux messages.',
          'vous avez un nouveau message.',
          'vous avez 5 nouveaux messages.'
        ])
      })
    })

    describe('when called with an unknown string key', function () {
      let res
      beforeEach(function () {
        res = t('42 is * in ASCII')
      })
      it('returns the given key', function () {
        expect(res).toBe('42 is * in ASCII')
      })
    })

    describe('when called as tag function ' +
    'with an unknown template literal key', function () {
      let res
      beforeEach(function () {
        res = t`${42} is * in ASCII`
      })
      it('returns the given key converted to a string', function () {
        expect(res).toBe('42 is * in ASCII')
      })
    })
  })
})
