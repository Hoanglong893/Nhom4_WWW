package fit.iuh.dtcllshopbe.dto.request;

import fit.iuh.dtcllshopbe.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    private int accountId;
    private String receiverName;
    private String receiverPhone;
    private String receiverEmail;
    private String receiverAddress;
    private String note;
    private PaymentMethod paymentMethod;
    private List<CheckoutItemRequest> items;
}
