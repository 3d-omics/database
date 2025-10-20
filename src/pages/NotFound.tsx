import { Link } from "react-router-dom"
const NotFound = () => {

  return (
    <div className='min-h-[calc(100vh-var(--navbar-height))] flex items-center justify-center'>
      <main className="text-center">
        <h1 className="text-9xl font-black mb-6 text-burgundy font-jakarta">404</h1>
        <h2 className="text-2xl mb-2 font-semibold font-jakarta">The page you were looking for doesn't exist</h2>
        <h3 className="mb-6">You may have mistyped the address or the page may have moved.</h3>
        <Link to='/' className='underline link'>Back to home</Link>
      </main>
    </div>
  )
}

export default NotFound