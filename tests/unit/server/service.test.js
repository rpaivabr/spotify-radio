import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import config from '../../../server/config.js'
import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
import fs from 'fs'

describe('#Service', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  })

  test('should create stream when call getFileStream method', async () => {
    const service = new Service()
    const filename = config.pages.home
    const typeExpected = ".html"
    const mockFileStream = TestUtil.generateReadableStream(['data'])
    jest.spyOn(fs, 'createReadStream')
      .mockReturnValue(mockFileStream)

    const stream = await service.getFileStream(filename)

    expect(stream).toEqual({
      stream: mockFileStream,
      type: typeExpected
    })
  })
})