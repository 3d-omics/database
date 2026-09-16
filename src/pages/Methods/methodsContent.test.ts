import { describe, it, expect } from 'vitest'
import { menus } from 'components/Navbar/MenuItems'
import { methods } from './methodsContent'

const textOf = (method: typeof methods[number]) => {
  const subsectionParagraphs = Object.values(method.subsections ?? {})
    .flatMap((subsections) => subsections?.flatMap(({ paragraphs }) => paragraphs) ?? [])
  return [...method.intro, ...method.laboratory, ...method.bioinformatics, ...subsectionParagraphs].join(' ')
}

describe('methodsContent', () => {
  it('has a page for every Methods menu link, and a menu link for every page', () => {
    const menuLocations = menus
      .find((menu) => menu.sectionTitle === 'Methods')
      ?.subMenus?.map((subMenu) => subMenu.location)
    const pageLocations = methods.map((method) => `/methods/${method.slug}`)
    expect(menuLocations).toEqual(pageLocations)
  })

  it('gives every method an introduction', () => {
    methods.forEach((method) => {
      expect(method.intro.length).toBeGreaterThan(0)
    })
  })

  it('provides the complete metabolomics workflow from extraction to annotation', () => {
    const metabolomics = methods.find(({ slug }) => slug === 'metabolomics')
    expect(metabolomics?.laboratory).not.toHaveLength(0)
    expect(metabolomics?.subsections?.laboratory?.map(({ heading }) => heading))
      .toEqual(['LC–MS analyses'])
    expect(metabolomics?.subsections?.bioinformatics?.map(({ heading }) => heading)).toEqual([
      'Peak picking and alignment',
      'Data preprocessing, drift correction and quality control',
      'Metabolite annotation',
    ])
    expect(metabolomics?.references).toHaveLength(6)
  })

  it('gives every reference of a method its own citation label', () => {
    methods.forEach((method) => {
      const cites = method.references.map((reference) => reference.cite)
      expect(new Set(cites).size).toBe(cites.length)
    })
  })

  // In-text citations only become links when they match a label exactly
  it('cites every reference in the text, and lists every author-year citation', () => {
    methods.forEach((method) => {
      const text = textOf(method)
      const cites = method.references.map((reference) => reference.cite)
      cites.forEach((cite) => expect(text).toContain(cite))
      const authorYearCitations = text.match(/[A-Z][\p{L}-]+(?: et al\.| & [A-Z][\p{L}-]+)?, \d{4}/gu) ?? []
      authorYearCitations.forEach((citation) => expect(cites).toContain(citation))
    })
  })
})
