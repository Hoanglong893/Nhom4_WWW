package fit.iuh.dtcllshopbe.repository;

import fit.iuh.dtcllshopbe.entities.Account;
import fit.iuh.dtcllshopbe.entities.Order;
import fit.iuh.dtcllshopbe.enums.StatusOrdering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    int countOrderByOrderDate(Date date);
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate BETWEEN :start AND :end")
    int countOrderByOrderDateBetween(@Param("start") Date start, @Param("end") Date end);

    @Query("""
        SELECT o.orderCode,
               c.receiverName,
               i.totalAmount,
               i.paymentMethod,
               o.statusOrder,
               o.orderDate,
               SIZE(o.orderDetails)
        FROM Order o
        JOIN o.customerTrading c
        JOIN o.invoice i
    """)
    List<Object[]> getDetailedOrders();

    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    long countByStatusOrder(StatusOrdering statusOrder);

    List<Order> findByAccount(Account account);

    // ── Dùng cho ChatController: load kèm orderDetails và invoice để tránh LazyInit ──
    @Query("""
        SELECT DISTINCT o FROM Order o
        LEFT JOIN FETCH o.orderDetails od
        LEFT JOIN FETCH o.invoice
        LEFT JOIN FETCH o.customerTrading
        WHERE o.account = :account
        ORDER BY o.orderDate DESC
    """)
    List<Order> findByAccountWithDetails(@Param("account") Account account);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    java.util.Optional<Order> findByIdWithPessimisticLock(@Param("id") int id);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.invoice")
    List<Order> findAllWithInvoice();

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.invoice LEFT JOIN FETCH o.orderDetails WHERE o.orderDate BETWEEN :start AND :end")
    List<Order> findByOrderDateBetweenWithDetails(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}

