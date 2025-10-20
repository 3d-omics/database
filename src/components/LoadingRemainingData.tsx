import React from 'react'

const LoadingRemainingData = () => {
  return (
    <div data-cy='loading-remaining-data' className='h-screen w-screen fixed top-0 left-0 flex items-center justify-center z-30 bg-neutral-400/25 '>
      <div className='flex backdrop-blur-[1.5px] pb-2 pt-4 px-4 rounded-lg'>
        <p className='text-neutral-500 text-xl -mt-2 font-black mr-2 '>Loading remaining data</p>
        <div className='loading loading-dots loading-md text-neutral-500' />
      </div>
    </div>
  )
}

export default LoadingRemainingData