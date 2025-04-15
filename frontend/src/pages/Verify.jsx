import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const verifyPayment = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        toast.success('Payment Verified Successfully!');
        navigate('/orders');
      } else {
        toast.error('Payment verification failed!');
        navigate('/cart');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during verification.');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token, verifyPayment]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? (
        <div className="text-lg font-semibold text-gray-700">
          Verifying your payment...
        </div>
      ) : null}
    </div>
  );
};

export default Verify;
