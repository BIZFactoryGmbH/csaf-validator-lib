import * as basic from './versions/basic.js'
import * as informative from './versions/informativeTests.js'
import * as mandatory from './versions/mandatoryTests.js'
import * as schema from './versions/schemaTests.js'
import * as optional from './versions/optionalTests.js'

/**
 * @param {string} version
 * @param {unknown[]} tests
 */
export default async function getVersionTests(version, tests) {
  let TESTS = tests
  let VERSION_TESTS = []
  let IGNORED_TESTS = []

  try {
    VERSION_TESTS = Object.values(
      await import(
        `../../../../csaf-validator-lib/versions/${version}/basic.js`
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

  TESTS = TESTS.filter((/** @type {any} */t) => !IGNORED_TESTS.includes(t.name))

  // Make sure that the tests are not duplicated
  VERSION_TESTS.forEach((t) => {
    if (!TESTS.map((/** @type {any} */t) => t.name).includes(t.name)) {
      TESTS.push(t)
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Test ${t.name} is already present in the basic tests.`)
    }
  })

  return TESTS
}

export const getVersionBasicTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(basic))
export const getVersionOptionalTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(optional))
export const getVersionMandatoryTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(mandatory))
export const getVersionSchemaTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(schema))
export const getVersionInformativeTests = (/** @type {string} */ version) => getVersionTests(version, Object.values(informative))
