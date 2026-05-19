package fit.iuh.dtcllshopbe.repository;

import fit.iuh.dtcllshopbe.entities.Account;
import fit.iuh.dtcllshopbe.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByAccount(Account account);
}
