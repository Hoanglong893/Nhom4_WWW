package fit.iuh.dtcllshopbe.dto.response;

import lombok.*;

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
