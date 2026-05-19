package fit.iuh.dtcllshopbe.dto.request;

import lombok.Data;

@Data
public class CartRequest {
    private int quantity;
    private double totalAmount;
}
