import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";


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

    const addToCart = async (itemId , size) =>{

       if(!size){
        toast.error('Please select a size');
        return;
       }

       let cartData = structuredClone(cartItems);
       if(cartData[itemId]){
        
            if(cartData[itemId][size]){
                cartData[itemId][size] +=1;
            }
            else{
                cartData[itemId][size] = 1;
            }

        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] =1 ;
        }
        setCartItems(cartData);

        if(token){
            try {
                await axios.post(backendUrl + '/api/cart/add' , {itemId , size} , {headers : {token}})
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
       }
   
    const getCartCount = () => {
        let totalCount = 0 ;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                   if(cartItems[items][item] > 0){
                    totalCount += cartItems[items][item];
                   } 
                } catch (error) {
                    console.log(error);
                toast.error(error.message)
            
                }
                
            }
           
        }
        return totalCount;
    }


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

    const getUserCart = useCallback(async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get' , {} , {headers : {token}})
            if(response.data.success){
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }, [backendUrl]);

    useEffect(() => {
        getProductsData();
    }, );


    useEffect(() => {
        console.log("Updated products:", products);
    }, [products]);

    
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
        }
    }, [getUserCart, token]);
    


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