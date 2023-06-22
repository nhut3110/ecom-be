import { Cart } from '../cart.entity';
import { CartItem, CartOutput } from '../interfaces/card-output.interface';

export const createCartResponse = (list: Cart[]): CartOutput => {
  const cartList: { [productId: string]: CartItem } = {};
  const cartValue = list.reduce((total, item) => {
    cartList[item.productId] = {
      quantity: item.quantity,
      product: item.product,
    };
    return total + item.quantity * item.product.price;
  }, 0);

  const fixedCartValue = Number(cartValue.toFixed(2));

  const output: CartOutput = {
    cartValue: fixedCartValue,
    cartList: cartList,
  };

  return output;
};
