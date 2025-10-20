import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SocialIcons from '../SocialIcons'
import EUflag from 'src/assets/images/eu-flag.jpeg'


const Footer = () => {

  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      document.documentElement.style.setProperty(
        '--footer-height',
        `${footerRef.current.offsetHeight}px`
      );
    }
  }, []);

  return (
    <footer className='bg-burgundy bg-prism text-neutral-50 px-24 pt-12 pb-10 text-sm flex gap-72 items-center max-xl:gap-16 max-xl:px-8 max-lg:block max-lg:pb-8 max-sm:px-6 max-sm:pt-8' ref={footerRef}>
      <div className=''>
        <div className='flex items-center gap-6 mb-12 max-lg:px-16 max-lg:text-center max-lg:mb-8 max-md:px-8 max-md:gap-2 max-sm:flex-col max-sm:gap-6 max-sm:px-0'>
          <img src={EUflag} alt='EU flag' className='h-16' />
          <p className='max-md:text-sm max-md:leading-snug'>This project has received funding from the European Union's Horizon 2020 Research and Innovation programme under grant agreement number No. 101000309.</p>
        </div>

        <ul className='flex text-center [&>li]:mb-1 max-lg:justify-center max-lg:mb-12 max-md:block'>
          <li>Coordinator:
            <span className='link ml-1 whitespace-nowrap'><Link to={'https://www.alberdilab.dk/'}>Antton Alberdi (UCPH)</Link></span>
          </li>
          <span className='mx-4 font-semibold max-md:hidden'>|</span>
          <li>Contact:
            <span className='link ml-1 whitespace-nowrap'><Link to={'mailto:3d-omics@sund.ku.dk'}>3d-omics@sund.ku.dk</Link></span>
          </li>
          <span className='mx-4 font-semibold max-md:hidden'>|</span>
          <li>
            <span className='link whitespace-nowrap'><Link to={'https://www.3domics.eu/privacy.html'}>Data and privacy policy</Link></span>
          </li>
        </ul>
      </div>

      <SocialIcons
        ulClassName='flex gap-8 mx-auto w-fit [&_svg]:text-3xl [&>a>li>svg]:text-white [&>li:hover_svg]:text-custom_black max-lg:[&_svg]:text-2xl'
      />
    </footer>
  )
}

export default Footer



