import { expect } from 'chai'
import validate from '../validate.js'
import minimalVexDoc from './shared/minimalVexDoc.js'
import { getVersionBasicTests, getVersionMandatoryTests } from '../getVersionTests.js'

describe('Version specific tests', function () {
  it('invalid document with basic test', async function () {
    const tests = Object.values(await import('../versions/basic.js'))

    const result = await validate(tests, {
      ...minimalVexDoc,
      vulnerabilities: [
        ...minimalVexDoc.vulnerabilities,
        ...minimalVexDoc.vulnerabilities,
      ],
    })

    expect(result.isValid).to.be.false
  })

  it('invalid document, but one test is ignored', async function () {
    /** @type {any[]} */
    const tests = await getVersionMandatoryTests('2.1')

    // We expect the document to be valid, because the test is ignored
    const result = await validate(tests, {
      ...minimalVexDoc,
      vulnerabilities: [
        ...minimalVexDoc.vulnerabilities,
        ...minimalVexDoc.vulnerabilities,
      ],
    })

    expect(result.isValid).to.be.true
  })
})
