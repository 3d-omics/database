import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import tablesData from 'assets/data/airtable/_metadata.json'
import pigImage from 'assets/images/pig.png'
import chickenImage from 'assets/images/chicken.png'
import turkeyImage from 'assets/images/turkey.png'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'

// Fisher-Yates: a fresh order of the experiments on every visit
const shuffle = <T,>(items: T[]): T[] => {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const Home = () => {

  const tables = tablesData.tables

  const getRecordCount = (tableName: string) =>
    tables.find(table => table.name === tableName)?.recordCount

  const animalTrialsMenu = useMemo(() => shuffle(
    (animalTrialExperimentData ?? []).map((experiment: any) => {
      const experimentName = experiment.fields?.Name || experiment.Name
      const animalImage = experimentName?.includes('swine') ? pigImage :
        experimentName?.includes('chicken') ? chickenImage :
          experimentName?.includes('turkey') ? turkeyImage : null
      return {
        title: experimentName,
        link: `/animal-trials/${encodeURIComponent(experimentName || '')}`,
        image: animalImage,
        altText: `silhouette of ${animalImage}`,
      }
    })
  ), [])

  // The carousel is a native scroll container, so touch swipes work for free;
  // the arrows page through it and wrap around at either end.
  const carouselRef = useRef<HTMLUListElement>(null)

  const slideCarousel = (direction: 1 | -1) => {
    const track = carouselRef.current
    if (!track) return
    const maxScroll = track.scrollWidth - track.clientWidth
    const atEnd = direction === 1 && track.scrollLeft >= maxScroll - 1
    const atStart = direction === -1 && track.scrollLeft <= 1
    const left = atEnd ? 0
      : atStart ? maxScroll
        : Math.max(0, Math.min(maxScroll, track.scrollLeft + direction * track.clientWidth))
    track.scrollTo?.({ left, behavior: 'smooth' })
  }

  const navItems = [
    {
      type: 'row',
      items: [
        {
          title: 'Animal Trials',
          link: '/animal-trials',
          recordCount: getRecordCount('AnimalTrialExperiment'),
          description: 'Trials conducted in experimental farms',
          bgClass: 'bg-texture',
        },
      ],
      subItems: [
        {
          title: 'MAG Catalogues',
          titleMobile: '(Animal Trials)',
          link: '/mag-catalogues',
          description: 'Metagenome-assembled genome catalogues reconstructed for each trial',
          bgClass: 'bg-diagonal',
        }
      ],
      arrow: 'right'
    },
    { type: 'arrow', direction: 'down' },
    {
      type: 'single',
      item: {
        title: 'Animal Specimens',
        link: '/animal-specimens',
        recordCount: getRecordCount('AnimalSpecimen'),
        description: 'Individual animal specimens used for experimentation',
        bgClass: 'bg-texture',
      }
    },
    { type: 'arrow', direction: 'down' },
    {
      type: 'row',
      items: [
        {
          title: 'Macrosamples',
          link: '/macrosamples',
          recordCount: getRecordCount('IntestinalSectionSample'),
          description: 'Conventional macro-scale samples employed for molecular analyses',
          bgClass: 'bg-texture',
        }
      ],
      subItems: [
        {
          title: 'Metagenomics',
          titleMobile: '(Macrosamples)',
          link: '/macrosample-compositions',
          description: 'Community compositions profiled from macro-scale conventional samples',
          bgClass: 'bg-diagonal',
        },
        {
          title: 'Metabolomics',
          titleMobile: '(Macrosamples)',
          link: '/metabolomics',
          description: 'Metabolite landscapes profiled from macro-scale conventional samples',
          bgClass: 'bg-diagonal',
        }
      ]
    },
    { type: 'arrow', direction: 'down' },
    {
      type: 'single',
      item: {
        title: 'Cryosections',
        link: '/cryosections',
        recordCount: getRecordCount('Cryosection'),
        description: 'Thin intestinal cross-cuts used for laser microdissection',
        bgClass: 'bg-texture',
      }
    },
    { type: 'arrow', direction: 'down' },
    {
      type: 'single',
      item: {
        title: 'Microsamples',
        link: '/microsamples',
        recordCount: getRecordCount('Microsample'),
        description: 'Micro-scale sample used for molecular analysis collected through laser microdissection',
        bgClass: 'bg-texture',
      }
    }
  ]

  // Reusable nav item component
  const NavItem = ({ item, showMobileTitle = false }: { item: any, showMobileTitle?: boolean }) => (
    <Link to={item.link}>
      <li className={`${item.bgClass} h-full flex flex-col`}>
        <div className={`${item.bgClass === 'bg-diagonal' ? 'max-lg:px-8' : ''} max-lg:text-center`}>
          <h2>
            {item.title}
            <br />
            {showMobileTitle && item.titleMobile && (
              <span className='hidden max-lg:block font-light text-sm'>
                {item.titleMobile}
              </span>
            )}
          </h2>
          <p>
            {item.recordCount && (
              <>
                <span>{item.recordCount}</span>&nbsp;records<br />
              </>
            )}
            {item.description}
          </p>
        </div>
      </li>
    </Link>
  )

  return (
    <div>
      <section className='px-28 py-16 flex flex-col items-center gap-6 bg-prism text-neutral-50 max-md:px-16 max-sm:px-4'>
        <h1 className='main_header text-5xl text-light_mustard whitespace-nowrap pr-5 max-md:text-4xl max-[400px]:text-3xl'>
          3D'omics Data Portal
        </h1>
        <p className='text-sm max-w-4xl max-sm:text-xs max-[400px]:text-2xs text-center'>
          Welcome to the 3D'omics Data Portal.<br />
          This website provides access to all the molecular data
          and associated metadata generated in the H2020 project 3D'omics (2021-2025).
          The project aimed to develop, optimise and implement new molecular approaches to identify
          biomolecular interactions at the micro-scale in the context of animal production.
          The Data Portal contains hierarchically organised information, from experimental trials to
          microsamples.
        </p>
      </section>

      <main className='mb-16 bg-surface_subtle bg-texture'>
        <div className='flex items-center'>
          <button
            type='button'
            aria-label='Previous experiments'
            onClick={() => slideCarousel(-1)}
            className='shrink-0 px-3 py-6 text-ink hover:text-mustard max-sm:px-2'
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <ul
            ref={carouselRef}
            aria-label='Animal trial experiments'
            className='flex flex-nowrap grow overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth'
          >
            {animalTrialsMenu.map((item, index) => (
              <li
                key={index}
                className='shrink-0 basis-1/4 snap-start hover:bg-surface_strong/50 hover:text-mustard py-3 px-4 max-xl:basis-1/3 max-lg:basis-1/2 max-sm:basis-full max-md:px-4'
              >
                <Link to={item.link}>
                  <div className='flex items-center gap-0.5 max-sm:justify-center'>
                    <div
                      className='w-[52px] h-[52px] shrink-0 bg-ink'
                      style={{
                        maskImage: `url(${item.image})`,
                        WebkitMaskImage: `url(${item.image})`,
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                      }}
                      aria-label={item.altText}
                    />
                    <div>
                      <h2 className='font-light tracking-tight text-sm'>{item.title}</h2>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <button
            type='button'
            aria-label='Next experiments'
            onClick={() => slideCarousel(1)}
            className='shrink-0 px-3 py-6 text-ink hover:text-mustard max-sm:px-2'
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </main>

      <div className='pb-20 flex justify-center max-lg:pb-2'>
        <ul className='flex flex-col gap-2 [&_li]:bg-surface_muted [&_li]:w-[32rem] [&_li]:p-5 [&_li]:justify-center max-xl:[&_li]:w-[30rem] max-lg:[&_li]:h-[240px] max-lg:[&_li]:w-[calc(100dvw-10px)] max-lg:[&_li]:flex max-lg:[&_li]:justify-center max-lg:[&_li]:items-center hover:[&_li]:bg-surface_strong [&_li:hover_h2]:text-mustard [&_h2]:main_header [&_h2]:text-3xl [&_h2]:mb-1 max-lg:[&_h2]:text-2xl max-lg:[&_h2]:mt-4 max-lg:[&_p]:text-sm [&_svg]:w-[32rem] [&_svg]:text-2xl max-lg:[&_svg]:hidden [&>div]:flex [&>div]:items-stretch [&>div]:gap-6 max-lg:[&>div]:flex-col max-lg:[&>div]:gap-2 [&_li_p]:text-[13px] [&_li_p>span]:font-bold'>
          {navItems.map((section, idx) => {
            if (section.type === 'arrow') {
              return (
                <FontAwesomeIcon
                  key={idx}
                  icon={section.direction === 'down' ? faCaretDown : faCaretRight}
                />
              )
            }

            if (section.type === 'single') {
              return (
                <div key={idx} className={`${section.item?.title === 'Microsamples' ? 'max-lg:clip-arrow-last' : 'max-lg:clip-arrow'} max-lg:-mt-14`}>
                  <NavItem item={section.item} />
                </div>
              )
            }

            if (section.type === 'row') {
              return (
                <div key={idx}>
                  {section.items?.map((item: any, itemIdx: number) => (
                    <div key={itemIdx}>
                      <div className={`${item.title === 'Animal Trials' ? 'max-lg:clip-arrow-first' : 'max-lg:clip-arrow'} max-lg:-mt-14 flex-1 h-full max-lg:h-auto`}>
                        <NavItem item={item} showMobileTitle={true} />
                      </div>
                      {itemIdx < section.items.length - 1 && (
                        <div className='flex items-center max-lg:hidden'>
                          <FontAwesomeIcon icon={faCaretRight} className='!w-6' />
                        </div>
                      )}
                    </div>
                  ))}

                  {section.subItems && (
                    <div className='flex flex-col gap-4 max-lg:gap-2'>
                      {section.subItems.map((subitem: any, subIdx: number) => (
                        <section key={subIdx} className='flex gap-6 flex-1'>
                          <div className='flex items-center max-lg:hidden'>
                            <FontAwesomeIcon icon={faCaretRight} className='!w-6' />
                          </div>
                          <div className='max-lg:clip-arrow max-lg:-mt-14'>
                            <NavItem item={subitem} showMobileTitle={true} />
                          </div>
                        </section>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return null
          })}
        </ul>
      </div>

      <div className='flex justify-center mb-20 mt-8'>
        <Link
          to={'/database-schema'}
          className='px-6 py-3 bg-texture hover:text-mustard main_header text-xl bg-surface_muted hover:bg-surface_strong'
        >
          Download Database Schema
        </Link>
      </div>
    </div>
  )
}

export default Home
