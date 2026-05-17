package fit.iuh.dtcllshopbe.repository;

import fit.iuh.dtcllshopbe.entities.Account;
import fit.iuh.dtcllshopbe.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import fit.iuh.dtcllshopbe.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    boolean existsByUsername(String username);

    Optional<Account> findByUsername(String username);

    Optional<Account> findByCustomer_Email(String email);

    List<Account> findByRole(Role role);

}