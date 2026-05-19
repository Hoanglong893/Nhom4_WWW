package fit.iuh.dtcllshopbe.repository;

import fit.iuh.dtcllshopbe.entities.Product;
import fit.iuh.dtcllshopbe.entities.Size;
import fit.iuh.dtcllshopbe.entities.SizeDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SizeDetailRepository extends JpaRepository<SizeDetail, Integer> {
    SizeDetail findSizeDetailByProductAndSize(Product product, Size size);

}