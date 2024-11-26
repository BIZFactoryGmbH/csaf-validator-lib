#!/usr/bin/env node

/**
 * @file Script to validate JSON files against given tests
 *
 * Usage: node <script-path>.js json/file/path.json mandatoryTest_6_1_1
 *
 * `mandatoryTest_6_1_1` is a sample here. You can insert any test name from lib/mandatoryTests.js,
 *  `lib/optionalTests.js`, `lib/schemaTests.js` and `lib/schemaTests.js`.
 */

import { readFile } from 'fs/promises'
import validate from '../validate.js'
import { getVersionInformativeTests, getVersionMandatoryTests, getVersionOptionalTests, getVersionSchemaTests } from '../getVersionTests.js'

function grab(/** @type {string} **/ flag) {
  var index = process.argv.indexOf(flag);
  return (index === -1) ? null : process.argv[index+1];
}

const [, , filePath, testName] = process.argv

const json = JSON.parse(await readFile(filePath, { encoding: 'utf-8' }))
const version = grab('--csaf') ?? '2.0'

const mandatoryTests = getVersionMandatoryTests(version)
const optionalTests = getVersionOptionalTests(version)
const informativeTests = getVersionInformativeTests(version)
const schemaTests = getVersionSchemaTests(version)

const matchingTests =
  testName === 'mandatory'
    ? Object.values(mandatoryTests)
    : testName === 'optional'
    ? Object.values(optionalTests)
    : testName === 'informative'
    ? Object.values(informativeTests)
    : testName === 'schema'
    ? Object.values(schemaTests)
    : testName === 'base'
    ? Object.values(schemaTests).concat(Object.values(mandatoryTests))
    : /** @type {Array<import('../lib/shared/types.js').DocumentTest>} */ (
        Object.values(mandatoryTests)
      )
        .concat(Object.values(optionalTests))
        .concat(Object.values(informativeTests))
        .concat(Object.values(schemaTests))
        .filter((t) => t.name === testName)

if (!matchingTests.length)
  throw new Error(`No test matching "${testName}" found`)
const result = await validate(matchingTests, json)
process.exitCode = result.isValid ? 0 : 1
console.log(JSON.stringify(result, null, 2))
