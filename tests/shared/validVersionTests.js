import { expect } from "chai"

/**
 * @param {string} version
 */
export default function areVersionTestsValid(version) {
    return describe(`Duplicate tests for version ${version}`, function () {
        it(`no duplicate tests in /versions/${version}/basic.js`, async function () {
            const tests = Object.values(
                await import(
              `../../versions/basic.js`
            ))

            let versionTests = []
            try {
                versionTests = Object.values(
                    await import(
                    `../../versions/${version}/basic.js`
                ))
            } catch (e) {
                throw new Error(`No basic tests found for version ${version}`)
            }

            // Filter out all duplicate tests
            const uniqueTests = versionTests?.filter(test => tests.includes(test))

            expect(uniqueTests?.length).to.be.eq(0)
        })
    })  
}