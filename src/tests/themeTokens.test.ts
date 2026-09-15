import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sourceRoot = resolve(__dirname, '..')
const tokenPattern = /(?:bg|text|border|divide|ring)-(?:white|black|gray|neutral|slate|zinc|stone)(?:-\d{2,3})?(?:\/\d+)?\b|bg-\[#/g

const allowedRawTokens = new Set([
  'bg-black',
  'text-neutral-50',
  'text-white',
])

describe('theme tokens', () => {
  it('does not introduce raw neutral colour utilities outside intentional fixed fills', () => {
    const sourceFiles = globSync('**/*.tsx', { cwd: sourceRoot }).filter((file) => (
      !file.endsWith('.test.tsx')
      && !file.startsWith('assets/')
      && file !== 'components/LoadingRemainingData.tsx'
    ))
    const violations = sourceFiles.flatMap((file) => {
      const source = readFileSync(resolve(sourceRoot, file), 'utf8')
      const matches = source.match(tokenPattern) ?? []
      return matches
        .filter((token) => !allowedRawTokens.has(token.replace(/\/\d+$/, '')))
        .map((token) => `${file}: ${token}`)
    })

    expect(violations).toEqual([])
  })
})
