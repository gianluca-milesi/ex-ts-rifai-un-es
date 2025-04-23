import { useReducer } from "react"


type Product = {
  name: string,
  price: number
}

type CartProduct = Product & {
  quantity: number
}

type Action =
  | { type: "ADD_ITEM", payload: Product }
  | { type: "UPDATE_QUANTITY", payload: { name: string, quantity: number } }
  | { type: "REMOVE_ITEM", payload: string }


function cartReducer(addedProducts: CartProduct[], action: Action): CartProduct[] {
  switch (action.type) {
    case 'ADD_ITEM':
      const addedProduct = addedProducts.find(p => p.name === action.payload.name)
      if (addedProduct) {
        return addedProducts.map(p =>
          p.name === action.payload.name
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        return [...addedProducts, { ...action.payload, quantity: 1 }]
      }
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity < 1 || isNaN(action.payload.quantity)) {
        return addedProducts
      } else {
        return addedProducts.map(p => p.name === action.payload.name ? { ...p, quantity: action.payload.quantity } : p)
      }

    case 'REMOVE_ITEM':
      return addedProducts.filter(p => p.name !== action.payload)
    default:
      return addedProducts;
  }
}


function App(): JSX.Element {

  const products: Product[] = [
    { name: 'Mela', price: 0.5 },
    { name: 'Pane', price: 1.2 },
    { name: 'Latte', price: 1.0 },
    { name: 'Pasta', price: 0.7 },
  ]

  const [addedProducts, dispatchCart] = useReducer(cartReducer, [])
  const totalPrice = addedProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0)


  return (
    <>
      <section className="products-list" >
        <h1>Lista Prodotti </h1>
        <ul>
          {
            products.map((p, i) => (
              <li key={i} >
                <div className="list-body" >
                  <h3>{p.name} </h3>
                  < p > {p.price.toFixed(2)}€</p>
                </div>
                < button onClick={() => dispatchCart({ type: "ADD_ITEM", payload: p })}> Aggiungi al carrello </button>
              </li>
            ))
          }
        </ul>
      </section>

      {
        addedProducts.length > 0 && (
          <section className="cart" >
            <h1>Carrello </h1>
            <ul>
              {
                addedProducts.map((p, i) => (
                  <li key={i} >
                    <div className="list-body" >
                      <h4>{p.name} </h4>
                      < p > {p.price.toFixed(2)}€</p>
                      < input type="number"
                        value={p.quantity}
                        onChange={e => {
                          const quantity = parseInt(e.target.value)
                          dispatchCart({
                            type: "UPDATE_QUANTITY",
                            payload: { name: p.name, quantity: isNaN(quantity) ? 0 : quantity }
                          })
                        }} />
                    </div>
                    < button onClick={() => dispatchCart({ type: "REMOVE_ITEM", payload: p.name })}> Rimuovi </button>
                  </li>
                ))}
            </ul>
            < h3 > Totale da pagare: {totalPrice.toFixed(2)}€</h3>
          </section>
        )}
    </>
  )
}

export default App