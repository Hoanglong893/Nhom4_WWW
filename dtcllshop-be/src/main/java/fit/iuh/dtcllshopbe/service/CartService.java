package fit.iuh.dtcllshopbe.service;

import fit.iuh.dtcllshopbe.dto.request.CartUpdateRequest;
import fit.iuh.dtcllshopbe.dto.request.CartRequest;
import fit.iuh.dtcllshopbe.dto.response.CartResponse;
import fit.iuh.dtcllshopbe.entities.Account;
import fit.iuh.dtcllshopbe.entities.Cart;
import fit.iuh.dtcllshopbe.mapper.CartMapper;
import fit.iuh.dtcllshopbe.repository.AccountRepository;
import fit.iuh.dtcllshopbe.repository.AccountRepository;
import fit.iuh.dtcllshopbe.mapper.CartMapper;
import fit.iuh.dtcllshopbe.repository.CartDetailRepository;
import fit.iuh.dtcllshopbe.repository.CartRepository;
import fit.iuh.dtcllshopbe.repository.CustomerRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor

public class CartService {
    CartRepository cartRepository;
    private final CustomerRepository customerRepository;
    AccountRepository accountRepository;
    CartDetailRepository cartDetailRepository;
    CartMapper cartMapper;

    public Cart saveCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart getCartByAccountId(int accountId) {
        Account account = accountRepository.findById(accountId).orElse(null);

        return cartRepository.findByAccount(account);
    }

    public CartResponse updateCart(int cartId, CartRequest cartRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        cart.setTotalQuantity(cart.getTotalQuantity() + cartRequest.getQuantity());
        cart.setTotalAmount(cart.getTotalAmount() + cartRequest.getTotalAmount());
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    public CartResponse updateCartIncrease(int cartId, CartUpdateRequest cartPriceRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        cart.setTotalQuantity(cart.getTotalQuantity() + 1);
        cart.setTotalAmount(cart.getTotalAmount() + cartPriceRequest.getPrice());
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    public CartResponse updateCartDecrease(int cartId, CartUpdateRequest cartPriceRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        cart.setTotalQuantity(cart.getTotalQuantity() - 1);
        if (cart.getTotalQuantity() > 0) {
            cart.setTotalAmount(cart.getTotalAmount() - cartPriceRequest.getPrice());
        } else {
            cart.setTotalQuantity(0);
        }
        cart.setTotalAmount(cart.getTotalAmount() - cartPriceRequest.getPrice());
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    public CartResponse updateCartDelete(int cartId, CartUpdateRequest cartPriceRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        int totalQuantity = Math.max(0, cart.getTotalQuantity() - cartPriceRequest.getQuantity());
        double totalAmount = Math.max(0, cart.getTotalAmount() - cartPriceRequest.getPrice());
        cart.setTotalQuantity(totalQuantity);
        cart.setTotalAmount(totalQuantity == 0 ? 0 : totalAmount);
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }
}