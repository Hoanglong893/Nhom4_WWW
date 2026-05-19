package fit.iuh.dtcllshopbe.repository;

import fit.iuh.dtcllshopbe.entities.Account;
import fit.iuh.dtcllshopbe.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Cart findByAccount(Account account);

}