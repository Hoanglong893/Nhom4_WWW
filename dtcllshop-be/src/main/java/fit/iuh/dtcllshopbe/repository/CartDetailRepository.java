package fit.iuh.dtcllshopbe.repository;

import fit.iuh.dtcllshopbe.entities.Cart;
import fit.iuh.dtcllshopbe.entities.CartDetail;
import fit.iuh.dtcllshopbe.entities.Product;
import fit.iuh.dtcllshopbe.entities.SizeDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {
    List<CartDetail> findByCart(Cart cart);
    CartDetail findByCartAndProduct(Cart cart, Product product);
    CartDetail findByCartAndProductAndSizeDetail(Cart cart, Product product, SizeDetail sizeDetail);
    List<CartDetail> findByIsSelectedAndCart(boolean isSelected, Cart cart);
}