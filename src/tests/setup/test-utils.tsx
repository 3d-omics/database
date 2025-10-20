import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

const TestRouter = ({ children }: { children: ReactNode }) => {
  return (
    <MemoryRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {children}
    </MemoryRouter>
  )
}

export default TestRouter;