import { expect } from 'chai'
import areVersionTestsValid from './shared/validVersionTests.js'

describe('Duplicate tests for versions', () => {
  it('no duplicate tests in /versions/1.2/basic.js', async () => {
    expect(await areVersionTestsValid('1.2')).to.be.true
  })
  it('no duplicate tests in /versions/2.0/basic.js', async () => {
    expect(await areVersionTestsValid('2.0')).to.be.true
  })
  it('no duplicate tests in /versions/2.1/basic.js', async () => {
    expect(await areVersionTestsValid('2.1')).to.be.true
  })
})
