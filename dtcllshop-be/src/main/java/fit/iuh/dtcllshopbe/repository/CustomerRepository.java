package fit.iuh.dtcllshopbe.repository;

import fit.iuh.dtcllshopbe.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    Customer findByEmail(String email);
    boolean existsByEmail(String email);
    Customer findById(int id);
}
