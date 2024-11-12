import chai, { expect } from 'chai'
import areVersionTestsValid from './shared/validVersionTests.js'
import ChaiAsPromised from 'chai-as-promised'

chai.use(ChaiAsPromised)

describe('Duplicate tests for versions', () => {
  it('no tests for unavailable version', async () => {
    areVersionTestsValid('1.2').then(
      (result) => {
          result.should.throw(Error, 'No basic tests found for version 1.2');
      }
    )
  })
  it('no duplicate tests in /versions/2.0/basic.js', async () => {
    expect(await areVersionTestsValid('2.0')).to.be.true
  })
  it('no duplicate tests in /versions/2.1/basic.js', async () => {
    expect(await areVersionTestsValid('2.1')).to.be.true
  })
})
