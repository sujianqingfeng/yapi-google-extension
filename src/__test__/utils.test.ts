import { describe, expect, test } from 'vitest'

import { removeJsonStringQuotes } from '../utils'

describe('removeJsonStringQuotes ', () => {
  test('1', () => {
    const str = JSON.stringify({ aaa: '111' }) 
    const ans =  removeJsonStringQuotes(str)
    expect(ans).toMatchInlineSnapshot('"{aaa:\\"111\\"}"')
  })
})
