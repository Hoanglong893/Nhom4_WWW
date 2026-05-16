package fit.iuh.dtcllshopbe.repository;

import fit.iuh.dtcllshopbe.entities.Size;
import fit.iuh.dtcllshopbe.enums.SizeName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Integer> {
    Optional<Size> findByNameSize(SizeName nameSize);
}