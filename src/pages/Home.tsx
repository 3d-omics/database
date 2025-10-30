import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import tablesData from 'assets/data/airtable/_index.json'

const Home = () => {

  const tables = tablesData.tables

  return (
    <div>
      <section
        className='px-28 pt-14 text-neutral-50 bg-prism h-[350px]
        max-md:px-16 max-sm:px-4 max-sm:pt-8'
        style={{ clipPath: 'polygon(100% 0, 100% 82%, 50% 100%, 0 82%, 0 0)' }}
      >

        <div className='w-max'>
          <h1
            className='main_header text-5xl mb-2 text-light_mustard 
            animate-typing overflow-hidden whitespace-nowrap pr-5
            max-md:text-4xl max-[400px]:text-3xl'
            style={{
              animation: 'typing 0.9s steps(30, end), blink-caret 0.5s step-end infinite',
              borderRight: '4px solid white',
              animationFillMode: 'forwards',
            }}
            onAnimationEnd={(e) => {
              (e.target as HTMLElement).style.borderRight = 'none';
            }}
          >
            3D'omics Data Portal
          </h1>
        </div>

        <p className='mb-5 max-[400px]:text-sm'>
          <Link to={"http://www.3domics.eu/index.html"} className='link' target='_blank'>
            3D'omics Project&nbsp;<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </Link>
        </p>
        <h1 className='font-semibold mb-1 max-[400px]:leading-tight'>Generating 3D omics landscapes, achieving reconstructions of intestinal host-microbiota ecosystems.</h1>
        <p className='text-sm max-w-[62rem] font-extralight max-sm:text-xs max-[400px]:text-2xs'>
          The world's population continues to grow - but the Earth's surface does not.
          <br />
          This urges us all to ensure that the associated need for increased food production is performed in a sustainable fashion, because optimising food production is of critical importance for biodiversity and ultimately humanity.
        </p>
      </section>

      <div className='h-16 max-lg:h-1.5'></div>

      <div className='pb-20 flex justify-center max-lg:pb-2'>
        <ul className='flex flex-col gap-2 
          [&_li]:bg-neutral-100 [&_li]:w-[32rem] [&_li]:p-5
            max-xl:[&_li]:w-[30rem]
            max-lg:[&_li]:h-[240px] max-lg:[&_li]:w-[calc(100vw-20px)]
            max-lg:[&_li]:flex max-lg:[&_li]:justify-center max-lg:[&_li]:items-center
          hover:[&_li]:bg-neutral-200
          [&_li:hover_h2]:text-mustard
          [&_h2]:main_header [&_h2]:text-3xl [&_h2]:mb-1
            max-lg:[&_h2]:text-2xl max-lg:[&_h2]:mt-4
            max-lg:[&_p]:text-sm
          [&_svg]:w-[32rem] [&_svg]:text-2xl
            max-lg:[&_svg]:hidden
          [&>div]:flex [&>div]:items-stretch [&>div]:gap-6
            max-lg:[&>div]:flex-col max-lg:[&>div]:gap-2
          [&_li_p]:text-sm
          [&_li_p>span]:font-bold
        '>

          <div>
            <div className='max-lg:clip-arrow max-lg:-mt-14 flex-1'>
              <Link to={"/animal-trial-experiment"}>
                <li className='bg-texture h-full flex flex-col'>
                  <div>
                    <h2>Animal&nbsp;Trial/Experiment</h2>
                    <p>
                      <span>{tables.filter((table) => table.name === 'AnimalTrialExperiment')[0].recordCount}</span>&nbsp;records
                      <br />
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </li>
              </Link>
            </div>

            <div className="flex items-center max-lg:hidden">
              <FontAwesomeIcon icon={faCaretRight} className="!w-6" /> {/* !w-6 is for safari browser */}
            </div>

            <div className='max-lg:clip-arrow max-lg:-mt-14 flex-1'>
              <Link to={"/genome-catalogues"}>
                <li className='bg-diagonal  h-full flex flex-col'>
                  <div className='max-lg:px-8'>
                    <h2>
                      Genome Catalogues
                      <span className='hidden max-lg:inline font-light text-sm'>
                        &nbsp;(Animal Trial/Experiment)</span>
                    </h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo nulla, dictum quis facilisis ac. </p>
                  </div>
                </li>
              </Link>
            </div>
          </div>


          <FontAwesomeIcon icon={faCaretDown} />


          <div className='max-lg:clip-arrow max-lg:-mt-14'>
            <Link to={"/animal-specimen"}>
              <li className='bg-texture'>
                <div>
                  <h2>Animal&nbsp;Specimen</h2>
                  <p>
                    <span>{tables.filter((table) => table.name === 'AnimalSpecimen')[0].recordCount}</span>&nbsp;records
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </li>
            </Link>
          </div>


          <FontAwesomeIcon icon={faCaretDown} />

          <div>
            <div className='max-lg:clip-arrow max-lg:-mt-14'>
              <Link to={"/macrosample"}>
                <li className='bg-texture  h-full flex flex-col'>
                  <div>
                    <h2>Macrosample</h2>
                    <p>
                      <span>{tables.filter((table) => table.name === 'Macrosample')[0].recordCount}</span>&nbsp;records
                      <br />
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </li>
              </Link>
            </div>


            <div className="flex items-center max-lg:hidden">
              <FontAwesomeIcon icon={faCaretRight} className="!w-6" /> {/* !w-6 is for safari browser */}
            </div>


            <div className='max-lg:clip-arrow max-lg:-mt-14 '>
              <Link to={"/macrosample-composition"}>
                <li className='bg-diagonal  h-full flex flex-col'>
                  <div className='max-lg:px-8'>
                    <h2>
                      Genome Composition
                      <span className='hidden max-lg:inline font-light text-sm'>
                        &nbsp;(Macrosample)</span>
                    </h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo nulla, dictum quis facilisis ac. </p>
                  </div>
                </li>
              </Link>
            </div>
          </div>


          <FontAwesomeIcon icon={faCaretDown} />


          <div>
            <div className='max-lg:clip-arrow max-lg:-mt-14'>
              <Link to={"/intestinal-section-sample"}>
                <li className='bg-texture  h-full flex flex-col'>
                  <div>
                    <h2>Intestinal&nbsp;Section&nbsp;Sample</h2>
                    <p>
                      <span>{tables.filter((table) => table.name === 'IntestinalSectionSample')[0].recordCount}</span>&nbsp;records
                      <br />
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </li>
              </Link>
            </div>

            <div className="flex items-center max-lg:hidden">
              <FontAwesomeIcon icon={faCaretRight} className="!w-6" /> {/* !w-6 is for safari browser */}
            </div>

            <div className='max-lg:clip-arrow max-lg:-mt-14 '>
              <Link to={"/metabolomics"}>
                <li className='bg-diagonal  h-full flex flex-col'>
                  <div className='max-lg:px-8'>
                    <h2>
                      Metabolomics
                      <span className='hidden max-lg:inline font-light text-sm'>
                        &nbsp;(Intestinal Section Sample)</span>
                    </h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo nulla, dictum quis facilisis ac. </p>
                  </div>
                </li>
              </Link>
            </div>
          </div>


          <FontAwesomeIcon icon={faCaretDown} />


          <div className='max-lg:clip-arrow max-lg:-mt-14'>
            <Link to={"/cryosection"}>
              <li className='bg-texture'>
                <div>
                  <h2>Cryosection</h2>
                  <p>
                    <span>{tables.filter((table) => table.name === 'Cryosection')[0].recordCount}</span>&nbsp;records
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </li>
            </Link>
          </div>


          <FontAwesomeIcon icon={faCaretDown} />


          <div>
            <div className='max-lg:clip-arrow max-lg:-mt-14'>
              <Link to={"/microsample"}>
                <li className='bg-texture h-full flex flex-col'>
                  <div>
                    <h2>Microsample</h2>
                    <p>
                      <span>{tables.filter((table) => table.name === 'Microsample')[0].recordCount}</span>&nbsp;records
                      <br />
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </li>
              </Link>
            </div>

            <div className="flex items-center max-lg:hidden">
              <FontAwesomeIcon icon={faCaretRight} className="!w-6" /> {/* !w-6 is for safari browser */}
            </div>

            <div className='max-lg:clip-arrow-last max-lg:-mt-14'>
              <Link to={"/microsample-composition"}>
                <li className='bg-diagonal h-full flex flex-col'>
                  <div className='max-lg:px-8'>
                    <h2>
                      Genome Composition
                      <span className='hidden max-lg:inline font-light text-sm'>&nbsp;(Microsample)</span>
                    </h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo nulla, dictum quis facilisis ac. </p>
                  </div>
                </li>
              </Link>
            </div>
          </div>


        </ul>
      </div >

    </div >
  )
}

export default Home

