import getVersionTests from "../../getVersionTests.js"

/**
 * @param {string} version
 */
export default async function areVersionTestsValid(version) {
  const tests = Object.values(await import(`../../versions/basic.js`))

  let versionTests = []
  try {
    versionTests = await getVersionTests(version, [], 'basic')
  } catch (e) {
    throw new Error(`No basic tests found for version ${version}`)
  }

  // Filter out all duplicate tests
  const uniqueTests = versionTests?.filter((/** @type {any} */test) => tests.includes(test))

  return uniqueTests?.length === 0
}
