import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cart');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      setCartItems(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      const apiUrl = `http://localhost:8000/api/cart/${itemId}`;
      console.log('API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        console.error(
          'Failed to update quantity in the database:',
          response.status,
          response.statusText
        );
      } else {
        console.log('Quantity updated in the database successfully!');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await Promise.all(
        cartItems.map(async (item) => {
          await fetch(`http://localhost:8000/api/cart/${item.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: 0 }),
          });
        })
      );

      await fetchCartItems();
    } catch (error) {
      console.error('Failed to clear the cart in the database:', error);
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="cartItem">
          {cartItems.map((item) => (
            <li key={item.id}>
              <span className="item-name">
                {item.menuItem.name || 'Unknown Item'}
              </span>{' '}
              - Quantity:{' '}
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="cart-buttons">
        <button className="clear-cart-button" onClick={handleClearCart}>
          Clear Cart
        </button>
        <button className="checkout-button">Checkout</button>
        <Link to="/">
          <button className="return-button">Return to Menu</button>
        </Link>
        
      </div>
    </div>
  );
};

export default Cart;

