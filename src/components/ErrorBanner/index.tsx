import React from 'react'

const ErrorBanner = ({ children }: { children: string | null }) => {
  return (
    <div className='bg-rose-200 border-l-4 border-rose-600 h-fit rounded-r-lg pl-4 pr-6 py-3 flex gap-3 mb-6'>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#555" strokeWidth="2" fill="none" />
        <line x1="12" y1="7" x2="12" y2="14" stroke="#555" strokeWidth="2" />
        <circle cx="12" cy="17" r="1.5" fill="#555" />
      </svg>
      <div className=''>
        <p className='font-semibold'>Error! Something went wrong. Please try again.</p>
        <p className='text-sm mt-1'>{children}</p>
      </div>
    </div>
  )
}

export default ErrorBanner