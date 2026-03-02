import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartPage } from '../pages/Cart/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/Home/HomePage';
import { OrderConfirmedPage } from '../pages/Order/Confirmed/OrderConfirmedPage';
import { OrdersPage } from '../pages/OrdersPage';
import { PaymentPage } from '../pages/Payments/PaymentPage';
import { ProductDetailPage } from '../pages/ProducDetail/ProductDetailPage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
      <Route path="/orders" element={<OrdersPage />} />
    </Routes>
  </BrowserRouter>
);
