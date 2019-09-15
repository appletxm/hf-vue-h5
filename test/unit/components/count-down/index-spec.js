import mockAxios from 'jest-mock-axios'
import { mount, shallowMount } from '@vue/test-utils'
import CountDown from 'components/count-down'

function mock(opts = {}) {
  let wrapper = mount(CountDown, opts)
  let vm = wrapper.vm
  vm.$toast = function(arg) {
    // console.info(arg)
    return arg
  }
  return {
    wrapper,
    vm
  }
}

describe('Component Count Down unit test', () => {
  // beforeEach(() => {
  //   mock()
  // })

  it('should init success', () => {
    let { wrapper } = mock({})
    expect(wrapper.html()).toContain('<div class="component-count-down">')
  })

  it('should trigger error toast if phone props missed', () => {
    let { wrapper, vm } = mock({})
    const button = wrapper.find('button')
    const spy = jest.spyOn(vm, '$toast')
    button.trigger('click')
    expect(spy).toHaveBeenCalled()
  })

  it('should disabled the component when set the disabled parameter to be truth', () => {
    let { wrapper, vm } = mock({
      propsData: {
        disabled: true
      }
    })
    let expected = expect.stringMatching(/\<button.+(disabled="disabled")[^>]+>/)
    expect(wrapper.html()).toEqual(expected)
  })

  it('should show error toast if a already registered phone to get the code for register', () => {
    let { vm } = mock({
      propsData: {
        phone: '13888888888',
        isRegister: true
      }
    })
    const responseObj = {
      'code': '200',
      'message': '用户已经注册',
      'detailMessage': null,
      'data': true
    }
    const spy = jest.spyOn(vm, '$toast')
    vm.mobileExist()
    mockAxios.mockResponse(responseObj)
    expect(spy).toHaveBeenCalled()
  })

  it('should show error toast if a new phone to get the code for login', () => {
    let { vm } = mock({
      propsData: {
        phone: '13888888888'
      }
    })
    const responseObj = {
      'code': '200',
      'message': '用户不存在',
      'detailMessage': null,
      'data': false
    }
    const spy = jest.spyOn(vm, '$toast')
    vm.mobileExist()
    mockAxios.mockResponse(responseObj)
    expect(spy).toHaveBeenCalled()
  })

  it('should call send sms code function when a new phone to do register', () => {
    let { wrapper, vm } = mock({
      propsData: {
        phone: '13888888888',
        isRegister: true
      }
    })
    const responseObj = {
      'code': '200',
      'message': '操作成功',
      'detailMessage': null,
      'data': false
    }
    const mockFn  = jest.fn()
    wrapper.setMethods({ getCode: mockFn })
    vm.mobileExist()
    mockAxios.mockResponse(responseObj)
    expect(mockFn).toHaveBeenCalled()
  })

  it('should call send sms code function when a registered phone to do login ', () => {
    let { wrapper, vm } = mock({
      propsData: {
        phone: '13888888888',
        isRegister: false
      }
    })
    const responseObj = {
      'code': '200',
      'message': '操作成功',
      'detailMessage': null,
      'data': true
    }
    const jestFn = jest.fn()
    wrapper.setMethods({ getCode:  jestFn})
    vm.mobileExist()
    mockAxios.mockResponse(responseObj)
    expect(jestFn).toHaveBeenCalled()
  })

  it('should emit uniqueId after get the sms code success', () => {
    let { vm } = mock({})
    const responseObj = {
      'code': '200',
      'message': '操作成功',
      'detailMessage': null,
      'data': '12345678'
    }
    const jestFn = jest.fn()
    vm.$on('uniqueId', jestFn)
    vm.getCode()
    mockAxios.mockResponse(responseObj)
    expect(jestFn).toHaveBeenCalledWith('12345678')
    expect(vm.isDisabled).toBe(true)
  })

  it('should trigger cut down timer when get the sms code success', () => {
    let { vm } = mock({})
    const res = {
      'code': '200',
      'message': '操作成功',
      'detailMessage': "操作成功",
      'data': '12345678'
    }
    jest.useFakeTimers()
    vm.$getCodeSuccess(res)
    expect(setInterval).toHaveBeenCalled()
  })

  it('should call error handle function when check mobile exist failed', () => {
    let { wrapper, vm } = mock({
      propsData: {
        phone: '13888888888'
      }
    })
    const errorObj = {
      'code': '999',
      'message': '失败',
      'detailMessage': "失败",
      'data': null
    }
    const mockfn = jest.fn()
    wrapper.setMethods({$getCodeFailed: mockfn})
    vm.mobileExist()
    mockAxios.mockError(new Error(errorObj))
    expect(mockfn).toHaveBeenCalled()
  })

  it('should call error handle function when get sms code failed', () => {
    let { wrapper, vm } = mock({
      propsData: {
        phone: '13888888888'
      }
    })
    const errorObj = {
      'code': '999',
      'message': '失败',
      'detailMessage': "失败",
      'data': null
    }
    const mockfn = jest.fn()
    wrapper.setMethods({$getCodeFailed: mockfn})
    vm.getCode()
    mockAxios.mockError(new Error(errorObj))
    expect(mockfn).toHaveBeenCalled()
  })

  it('should get the correct count down number when the ', () => {
    const { wrapper, vm } = mock({})
    const num = 10
    wrapper.setData({ countDownNo: num })
    vm.$doCutDown()
    vm.$doCutDown()
    expect(vm.countDownNo).toEqual(num - 2)
  })

  it('should get the correct count down number when the ', () => {
    const { wrapper, vm } = mock({
      propsData: {
        phone: '13888888888',
        maxTime: 10
      }
    })
    const num = 1
    wrapper.setData({ countDownNo: num })
    vm.$doCutDown()
    expect(vm.countDownNo).toEqual(vm.maxTime)
    expect(vm.isDisabled).toBe(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })
})
