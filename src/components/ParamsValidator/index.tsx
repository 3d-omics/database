import Loading from 'components/Loading'
import NotFound from 'pages/NotFound'

interface ParamsValidatorProps {
  validating: boolean
  notFound: boolean
  children: React.ReactNode
}

const ParamsValidator = ({ validating, notFound, children }: ParamsValidatorProps) => {
  if (validating) {
    return (
      <div className='h-[calc(100dvh-var(--navbar-height))]'>
        <Loading />
      </div>
    )
  }

  if (notFound) {
    return <NotFound />
  }

  return <>{children}</>
}

export default ParamsValidator