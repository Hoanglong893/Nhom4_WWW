package fit.iuh.dtcllshopbe.dto.request;

import fit.iuh.dtcllshopbe.enums.PaymentMethod;
import fit.iuh.dtcllshopbe.enums.StatusPayment;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInvoiceRequest {

    @NotNull(message = "Order ID là bắt buộc")
    private int orderId;

    @NotNull(message = "Phương thức thanh toán là bắt buộc")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Trạng thái thanh toán là bắt buộc")
    private StatusPayment paymentStatus;
}