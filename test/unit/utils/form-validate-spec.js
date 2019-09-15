import * as formValidate from 'utils/form-validate'

describe('form validate function', () => {
  it('should get the truly result for phone validation function when send 13928956535', () => {
    let res = formValidate.default.phone('13928956535')
    expect(res).toBe(true)
  })
})
