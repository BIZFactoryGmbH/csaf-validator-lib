import * as basic from './versions/basic.js'
import * as informative from './versions/informativeTests.js'
import * as mandatory from './versions/mandatoryTests.js'
import * as schema from './versions/schemaTests.js'
import * as optional from './versions/optionalTests.js'

/**
 * @param {string} version
 * @param {unknown[]} tests
 * @param {'basic' | 'optional' | 'mandatory' | 'schema' | 'informative'} type
 */
export default async function getVersionTests(version, tests, type) {
  let versionTests = tests
  /** @type {unknown[]} */
  let VERSION_TESTS = []
  /** @type {unknown[]} */
  let IGNORED_TESTS = []

  try {
    VERSION_TESTS = Object.values(
      await import(
        `../../../../csaf-validator-lib/versions/${version}/${type}.js`
      )
    )
    IGNORED_TESTS = Object.values(
      await import(
        `../../../../csaf-validator-lib/versions/${version}/ignoredTests.js`
      )
    )
  } catch (error) {
    console.error(
      `Could not load version specific tests for version ${version}.`
    )
  }

  versionTests = versionTests.filter((/** @type {any} */t) => !IGNORED_TESTS.includes(t.name))
  versionTests = versionTests.concat(
    // add version tests if they're not already in the list
    VERSION_TESTS.filter((/** @type {any} */t) => versionTests.every((/** @type {any} */x) => x.name !== t.name))
  )

  return versionTests
}

export const getVersionBasicTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(basic), 'basic')
export const getVersionOptionalTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(optional), 'optional')
export const getVersionMandatoryTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(mandatory), 'mandatory')
export const getVersionSchemaTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(schema), 'schema')
export const getVersionInformativeTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(informative), 'informative')
