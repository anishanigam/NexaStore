import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10 ;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search ,setSearch] = useState('');
    const [showSearch , setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState({});
    const [products , setProducts] = useState([]);
    const [token,setToken] = useState('')
    const navigate  = useNavigate ()

    const addToCart = async (itemId, size) => {
        if (!size) {
          toast.error('Please select a size');
          return;
        }
      
        // Clone the current cart
        const updatedCart = { ...cartItems };
      
        // If item already exists
        if (updatedCart[itemId]) {
          if (updatedCart[itemId][size]) {
            updatedCart[itemId][size] += 1;
          } else {
            updatedCart[itemId][size] = 1;
          }
        } else {
          updatedCart[itemId] = {};
          updatedCart[itemId][size] = 1;
        }
      
        // Update state
        setCartItems(updatedCart);
      
        // Sync with backend
        if (token) {
          try {
            await axios.post(
              backendUrl + '/api/cart/add',
              { itemId, size },
              { headers: { token } }
            );
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        }
      };
      
   
      const getCartCount = () => {
        let totalCount = 0;
    
        for (const itemId in cartItems) {
            const sizes = cartItems[itemId];
            
            if (typeof sizes === 'object') {
                for (const size in sizes) {
                    try {
                        const quantity = sizes[size];
                        if (typeof quantity === 'number' && quantity > 0) {
                            totalCount += quantity;
                        }
                    } catch (error) {
                        console.error(`Error counting item ${itemId} with size ${size}:`, error);
                    }
                }
            }
        }
    
        return totalCount;
    };
    


    const updateQuantity =  async (itemId , size , quantity) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] = quantity;
            }
        }
        setCartItems(cartData);

        if(token) {
            try{
                await axios.post(backendUrl + '/api/cart/update' , {itemId , size , quantity} , {headers : {token}})    
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }


    }

    const getCartAmount = () => {
        let totalAmount = 0 ;
        for(const items in cartItems){
            const itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;
            for(const item in cartItems[items]){
                
                   if(cartItems[items][item] > 0){
                    totalAmount += itemInfo.price * cartItems[items][item];
                    
                }
                
            }
           
        }
        return totalAmount;
    }


    const getProductsData = async () => {
        try {
            console.log("Backend URL being used:", backendUrl);
            const response = await axios.get(backendUrl + '/api/product/list')
            if(response.data.success){
                setProducts(response.data.products)
                console.log("Fetched products:", response.data.products);
            }else {
                toast.error(response.data.message)
                console.error("API responded with error:", response.data.message);
            }
        } catch (error) {
            console.log("Error fetching products:",  error.response ? error.response.data : error.message);
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.get(
                backendUrl + '/api/cart/get',
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Standard way of sending tokens
                        'token': token // If your backend explicitly needs 'token'
                    }
                }
            );
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    

    useEffect(() => {
        getProductsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        console.log("Updated products:", products);
    }, [products]);

    
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    


    const value ={
        products , currency , delivery_fee ,search , setSearch , showSearch , setShowSearch,cartItems,addToCart, getCartCount,updateQuantity , getCartAmount,navigate, backendUrl,setToken,token,setCartItems,getUserCart,getProductsData,
    }



    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
 export default ShopContextProvider;