import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { purchaseOrder } from "../redux/purchaseSlice";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const PaymentUpdation = () => {
  const [isUpdated, setIsUpdated] = useState(false);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user).user;
  const dispatch = useDispatch();
  const router = useRouter();

  const updateProductState = async (cart, user) => {
    const purchasedOrder = [];
    let grandTotal = 0;

    for (const product of cart) {
      try {
        const { data } = await axios.post(
          "http://localhost:3000/api/users/purchase",
          {
            products: JSON.parse(JSON.stringify(cart)),
            userId: user.id,
            totalCost: product.price * product.quantity,
            admin_id: product.admin_id,
          }
        );
        setIsUpdated(true);

        const orderItem = {
          user: data.purchasedOrder.userId,
          quantity: data.purchasedOrder.quantity,
          purchaseOrder: JSON.parse(data.purchasedOrder.productsBrought),
          adminId: data.purchasedOrder.adminId,
          orderStatus: data.purchasedOrder.orderStatus,
        };
        purchasedOrder.push(orderItem);
        grandTotal += product.price * product.quantity;
        console.log(purchasedOrder);

        dispatch(
          purchaseOrder({
            user: user.id,
            totalCost: grandTotal,
            purchaseOrder: purchasedOrder,
            quantity: cart.map((product) => ({
              id: product.id,
              quantity: product.quantity,
            })),
            productState: "pending",
          })
        );
      } catch (error) {
        console.log(`Error purchasing product ${product.id}:`, error);
      }
    }
  };
  useEffect(() => {
    if (cart.length > 0) {
      updateProductState(cart, user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, user]);

  useEffect(() => {
    if (isUpdated) {
      setTimeout(() => {
        router.push("/success");
      }, 3000);
    }
  }, [isUpdated, router]);

  return (
    <>
      <Navbar />
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2d8659] rounded-full animate-spin"></div>
          <p className="font-poppins text-gray-700">Loading...</p>
        </div>
      </div>
    </>
  );
};
export default PaymentUpdation;
