package fit.iuh.dtcllshopbe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private int orderId;
    private double totalAmount;
    private Integer invoiceId;
    private String invoiceCode;
}
