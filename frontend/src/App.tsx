import { Divider } from './components/divider'

export function App() {
  return (
    <>
      <div className="bg-blue-600 min-h-screen text-white">

        <div>
          <p>Sección 1</p>

          <Divider className="my-6 w-full" />

          <p>Sección 2</p>
        </div>
      </div>

    </>
  )
}
