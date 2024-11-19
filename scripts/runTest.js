#!/usr/bin/env node

/**
 * @file Script to validate JSON files against given tests
 *
 * Usage: node <script-path>.js [--csaf version] json/file/path.json mandatoryTest_6_1_1
 *
 * `mandatoryTest_6_1_1` is a sample here. You can insert any test name from lib/mandatoryTests.js,
 *  `lib/optionalTests.js`, `lib/schemaTests.js` and `lib/schemaTests.js`.
 */

import { program } from 'commander'
import { readFile } from 'fs/promises'
import validate from '../validate.js'
import { getVersionInformativeTests, getVersionMandatoryTests, getVersionOptionalTests, getVersionSchemaTests } from '../getVersionTests.js'

/**
 * @param {string} filepath
 * @param {string} testName
 * @param {{[key: string]: unknown}} options
 */
const runTest = async (filepath, testName, options) => {
  const json = JSON.parse(await readFile(filepath, { encoding: 'utf-8' }))
  const version = options.csaf

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
}

program.name('runTest')
  .description('runs the specified tests for the given file')
  .argument('<filepath>', 'The path to the file to test')
  .argument('<testname>', 'This can either be one of the test groups (mandatory, informative, schema, base) or the name of one specific test')
  .option('-c, --csaf <version>', 'The csaf version to use', '2.0')
  .action(runTest)
  .parse()
