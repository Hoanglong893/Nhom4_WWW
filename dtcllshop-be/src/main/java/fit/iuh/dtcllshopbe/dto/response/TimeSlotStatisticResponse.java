package fit.iuh.dtcllshopbe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlotStatisticResponse {
    private String time;
    private long orders;
    private double revenue;
}
