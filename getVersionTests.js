import * as basic from './versions/basic.js'

/**
 * @param {string} version
 */
export default async function getVersionTests(version) {
  let TESTS = Object.values(basic)
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
    throw new Error(
      `Could not load tests for version ${version}. Falling back to basic tests.`
    )
  }

  TESTS = TESTS.filter((t) => !IGNORED_TESTS.includes(t.name))

  // Make sure that the tests are not duplicated
  VERSION_TESTS.forEach((t) => {
    if (!TESTS.map((t) => t.name).includes(t.name)) {
      TESTS.push(t)
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Test ${t.name} is already present in the basic tests.`)
    }
  })

  return TESTS
}
