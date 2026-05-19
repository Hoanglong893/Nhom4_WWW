package fit.iuh.dtcllshopbe.dto.request;

import fit.iuh.dtcllshopbe.enums.StatusOrdering;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateOrderStatusRequest {
    private StatusOrdering statusOrder;
}

