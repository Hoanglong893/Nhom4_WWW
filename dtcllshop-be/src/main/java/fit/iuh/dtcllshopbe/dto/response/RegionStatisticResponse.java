package fit.iuh.dtcllshopbe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionStatisticResponse {
    private String name;
    private long orders;
    private double revenue;
    private double growth;
}
