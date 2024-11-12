/**
 * @param {string} version
 */
export default async function areVersionTestsValid(version) {
  const tests = Object.values(await import(`../../versions/basic.js`))

  let versionTests = []
  try {
    versionTests = Object.values(
      await import(`../../versions/${version}/basic.js`)
    )
  } catch (e) {
    throw new Error(`No basic tests found for version ${version}`)
  }

  // Filter out all duplicate tests
  const uniqueTests = versionTests?.filter((test) => tests.includes(test))

  return uniqueTests?.length === 0
}
