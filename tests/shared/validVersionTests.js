import { expect } from "chai"

/**
 * @param {string} version
 */
export default function areTestsValid(version) {
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
            const filteredTests = versionTests?.filter(test => tests.includes(test))

            expect(filteredTests?.length).to.be.eq(0)
        })
    })  
}