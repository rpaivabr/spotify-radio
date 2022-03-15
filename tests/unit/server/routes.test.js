import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import { handler } from '../../../server/routes.js'
import TestUtil from '../_util/testUtil.js'

describe('#Routes - test site for api response', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  })

  test('GET / - should redirect to home page', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET'
    params.request.url = '/'
    
    await handler(...params.values())

    expect(params.response.end).toHaveBeenCalled()
    expect(params.response.writeHead).toHaveBeenCalledWith(302, { 
      Location: config.location.home 
    })
  })

  test(`GET /home - should response with ${config.pages.home} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET'
    params.request.url = '/home'
    const mockFileStream = TestUtil.generateReadableStream(['data'])
    jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream
      })
    jest.spyOn(mockFileStream, 'pipe')
      .mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(config.pages.home)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
  })

  test(`GET /controller - should response with ${config.pages.controller} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET'
    params.request.url = '/controller'
    const mockFileStream = TestUtil.generateReadableStream(['data'])
    jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream
      })
    jest.spyOn(mockFileStream, 'pipe')
      .mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(config.pages.controller)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
  })

  test('GET /index.html - should respond with file stream', async () => {
    const filename = '/index.html'
    const expectedType = '.html'
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET'
    params.request.url = filename
    const mockFileStream = TestUtil.generateReadableStream(['data'])
    jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: `.${filename.split('.')[1]}`
      })
    jest.spyOn(mockFileStream, 'pipe')
      .mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(filename)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.writeHead).toHaveBeenCalledWith(200, {
      'Content-Type': config.constants.CONTENT_TYPE[expectedType]
    })
  })

  test('GET /file.ext - should respond with file stream', async () => {
    const filename = '/file.ext'
    const expectedType = '.ext'
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET'
    params.request.url = filename
    const mockFileStream = TestUtil.generateReadableStream(['data'])
    jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: `.${filename.split('.')[1]}`
      })
    jest.spyOn(mockFileStream, 'pipe')
      .mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(filename)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.writeHead).not.toHaveBeenCalledWith()
  })

  test('POST /unknown - given an inexistent route it should respond with 404', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'POST'
    params.request.url = '/unknown'

    await handler(...params.values())

    expect(params.response.writeHead).toHaveBeenCalledWith(404)
    expect(params.response.end).toHaveBeenCalledWith()
  })

  describe('exceptions', () => {
    test('given inexistent file it should respond with 404', async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = 'GET'
      params.request.url = '/index.png'
      jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error('Error: ENOENT: no such file or directory'))
  
      await handler(...params.values())
  
      expect(params.response.writeHead).toHaveBeenCalledWith(404)
      expect(params.response.end).toHaveBeenCalledWith()
    })

    test('given an error it should respond with 500', async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = 'GET'
      params.request.url = '/index.png'
      jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error('Error: '))
  
      await handler(...params.values())
  
      expect(params.response.writeHead).toHaveBeenCalledWith(500)
      expect(params.response.end).toHaveBeenCalledWith()
    })
  })
})