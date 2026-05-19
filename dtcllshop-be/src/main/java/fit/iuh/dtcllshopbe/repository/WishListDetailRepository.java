package fit.iuh.dtcllshopbe.repository;

import fit.iuh.dtcllshopbe.entities.WishListDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishListDetailRepository extends JpaRepository<WishListDetail, Integer> {
    List<WishListDetail> findByWishlist_Id(Integer wishlistId);


    boolean existsByWishlist_IdAndProduct_Id(Integer wishlistId, Integer productId);

    void deleteByWishlist_IdAndProduct_Id(Integer wishlistId, Integer productId);
}
