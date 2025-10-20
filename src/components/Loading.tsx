import React from 'react'

const Loading = () => {
  return (
    <div
      data-cy='loading'
      data-testid='loading-dots'
      className='h-screen w-full fixed top-0 left-0 flex items-center justify-center'
    >
      <div className='loading loading-dots loading-lg' />
    </div>
  )
}

export default Loading