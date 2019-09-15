import * as uiUtils from 'utils/ui-utils'

function time() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({a:2})
    }, 2000)
  })
}

describe('ui-utils file unit test', () => {
  test('get query string from url: mock the url search', () => {
    let mockUrl = '?name=abc'
    let name = uiUtils.getQueryString('name', mockUrl)
    expect(name).toBe('abc')
  })
  
  test('test promise', () => {
    time().then(res => {
      expect(res).not.toBeNull()
    })
  })
  
  test('check type: isFunction will get the truthy result when pass a function parameter', () => {
    function a(){}
    expect(uiUtils.checkType.isFunction(a)).toBe(true)
  })
  
  test('check type: isFunction will get the falsy result when pass a object parameter', () => {
    let a = {}
    expect(uiUtils.checkType.isFunction(a)).toBe(false)
  })
})
