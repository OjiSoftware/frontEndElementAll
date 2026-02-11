
import './App.css'
import ProductCard from './components/productCard'
import type { Product } from './types/product.types'
function App() {

  const MOCK_PRODUCTS: Product[] = [
    {
      id: '1',
      name: 'BLATTANEX ULTRA GEL CUCAX10GRS',
      description: 'X 24 unidades',
      price: 4157.42,
      imageUrl: 'https://th.bing.com/th/id/R.808126c5373f61331138c4e6b7e7db49?rik=0Hrc7EDsZPGpnw&riu=http%3a%2f%2fthumbs.dreamstime.com%2fz%2finsecticide-sprays-9933366.jpg&ehk=szbBCl5Wk3TVn8MqO39P3b%2bp%2fDlzANWXn1vOYWHIrdw%3d&risl=&pid=ImgRaw&r=0',
      category: 'Cebos'
    },
  ];
  return (
    <>

      <div>

        <ProductCard key={MOCK_PRODUCTS[0].id} product={MOCK_PRODUCTS[0]} />
      </div>
    </>
  )
}

export default App
