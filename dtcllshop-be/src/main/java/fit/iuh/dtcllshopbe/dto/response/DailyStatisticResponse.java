package fit.iuh.dtcllshopbe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyStatisticResponse {
    private String date;
    private long revenue;
    private long orders;
    private long customers;
    private long products;
}
