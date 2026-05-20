package fit.iuh.dtcllshopbe.service;

import fit.iuh.dtcllshopbe.dto.request.CartDetailRequest;
import fit.iuh.dtcllshopbe.dto.response.CartDetailResponse;
import fit.iuh.dtcllshopbe.entities.Cart;
import fit.iuh.dtcllshopbe.entities.CartDetail;
import fit.iuh.dtcllshopbe.entities.Product;
import fit.iuh.dtcllshopbe.entities.SizeDetail;
import fit.iuh.dtcllshopbe.exception.AppException;
import fit.iuh.dtcllshopbe.exception.ErrorCode;
import fit.iuh.dtcllshopbe.mapper.CartDetailMapper;
import fit.iuh.dtcllshopbe.repository.CartDetailRepository;
import fit.iuh.dtcllshopbe.repository.CartRepository;
import fit.iuh.dtcllshopbe.repository.ProductRepository;
import fit.iuh.dtcllshopbe.repository.SizeDetailRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CartDetailService {
    CartDetailRepository cartDetailRepository;
    CartDetailMapper cartDetailMapper;
    ProductRepository productRepository;
    CartRepository cartRepository;
    SizeDetailRepository sizeDetailRepository;

    @Transactional
    public CartDetailResponse addCartDetail(CartDetailRequest cartDetailRequest) {
        Product product = productRepository.findById(cartDetailRequest.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        Cart cart = cartRepository.findById(cartDetailRequest.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        SizeDetail sizeDetail = sizeDetailRepository.findById(cartDetailRequest.getSizeDetailId())
                .orElseThrow(() -> new AppException(ErrorCode.SIZE_DETAIL_NOT_FOUND));
        CartDetail existing = cartDetailRepository.findByCartAndProductAndSizeDetail(cart, product, sizeDetail);

        if (existing != null) {
            int newQuantity = existing.getQuantity() + cartDetailRequest.getQuantity();
            existing.setQuantity(newQuantity);
            existing.setSubtotal(existing.getPrice_at_time() * newQuantity);
            existing.setUpdateAt(new Date());
            CartDetail updated = cartDetailRepository.save(existing);
            return cartDetailMapper.toCartDetailResponse(updated);
        }
        CartDetail cartDetail = new CartDetail();
        double priceAtTime = product.getCostPrice() > 0 ? product.getCostPrice() : product.getPrice();
        cartDetail.setProduct(product);
        cartDetail.setCart(cart);
        cartDetail.setSizeDetail(sizeDetail);
        cartDetail.setQuantity(cartDetailRequest.getQuantity() > 0 ? cartDetailRequest.getQuantity() : 1);
        cartDetail.setSelected(false);
        cartDetail.setUpdateAt(null);
        cartDetail.setCreateAt(new Date());
        cartDetail.setSubtotal(priceAtTime * cartDetail.getQuantity());
        cartDetail.setPrice_at_time(priceAtTime);

        CartDetail saved = cartDetailRepository.save(cartDetail);

        return cartDetailMapper.toCartDetailResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CartDetailResponse> getCartDetailListByCardId(int cartId){
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        List<CartDetail> cartDetailList = cartDetailRepository.findByCart(cart);

        return cartDetailList
                .stream()
                .map(cartDetailMapper::toCartDetailResponse)
                .toList();
    }

    @Transactional
    public CartDetailResponse updateCartDetailSelected(int cartDetailId, boolean selected) {
        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("CartDetail not found"));
        cartDetail.setSelected(selected);
        cartDetail.setUpdateAt(new Date());
        CartDetail updated = cartDetailRepository.save(cartDetail);
        return cartDetailMapper.toCartDetailResponse(updated);
    }

    @Transactional
    public CartDetailResponse updateCartDetailIncreaseQuantity(int cartDetailId){
        CartDetail cartDetail = cartDetailRepository
                .findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("CartDetail not found"));
        cartDetail.setQuantity(cartDetail.getQuantity() + 1);
        cartDetail.setSubtotal(cartDetail.getPrice_at_time() * cartDetail.getQuantity());
        cartDetail.setUpdateAt(new Date());
        CartDetail updated = cartDetailRepository.save(cartDetail);
        return cartDetailMapper.toCartDetailResponse(updated);
    }

    @Transactional
    public CartDetailResponse updateCartDetailDecreaseQuantity(int cartDetailId){
        CartDetail cartDetail = cartDetailRepository
                .findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("CartDetail not found"));
        cartDetail.setQuantity(cartDetail.getQuantity() - 1);
//        if(cartDetail.getQuantity() <= 0){
//            deleteCartDetail(cartDetailId);
//            return null;
//        }
        cartDetail.setSubtotal(cartDetail.getPrice_at_time() * cartDetail.getQuantity());
        cartDetail.setUpdateAt(new Date());
        CartDetail updated = cartDetailRepository.save(cartDetail);
        return cartDetailMapper.toCartDetailResponse(updated);
    }

    @Transactional
    public void deleteCartDetail(int cartDetailId) {
        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("CartDetail not found"));
        Cart cart = cartDetail.getCart();
        int totalQuantity = Math.max(0, cart.getTotalQuantity() - cartDetail.getQuantity());
        double totalAmount = Math.max(0, cart.getTotalAmount() - cartDetail.getSubtotal());

        cart.setTotalQuantity(totalQuantity);
        cart.setTotalAmount(totalQuantity == 0 ? 0 : totalAmount);
        cartRepository.save(cart);
        cartDetailRepository.delete(cartDetail);
    }

    @Transactional(readOnly = true)
    public List<CartDetailResponse> getCartDetailIsSelected(int cartId){
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        List<CartDetail> selectedList = cartDetailRepository.findByIsSelectedAndCart(true, cart);
        return selectedList.stream()
                .map(cartDetailMapper::toCartDetailResponse)
                .toList();
    }
}
