import { describe, expect, test } from 'vitest'

const toTree = (arr: number[] ) => {
  
  let i = 0
  const result = []

  while (i < arr.length) {
    const val = arr[i]

    const item: any = {
      val
    }

    let nextIndex = i + 1
    while (val < arr[nextIndex]) {
      nextIndex++
    }

    if (nextIndex - i > 1) {
      item.children = toTree(arr.slice(i + 1, nextIndex))
    }
    
    result.push(item)
    i = nextIndex
  }
  return result
}

describe('level', () => {
  test('1', () => {
    const arr = [1, 2, 1]
    const result = toTree(arr)

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "val": 2,
            },
          ],
          "val": 1,
        },
        {
          "val": 1,
        },
      ]
    `)
  })
})