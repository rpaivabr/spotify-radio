import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import { Controller } from '../../../server/controller.js'
import { Service } from '../../../server/service.js'

describe('#Controller', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  })

  test('should call service when call getFileStream method', async () => {
    const controller = new Controller()
    const filename = "index.html"
    jest.spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockResolvedValue({})

    await controller.getFileStream(filename)

    expect(Service.prototype.getFileStream).toHaveBeenCalledWith(filename)
  })
})