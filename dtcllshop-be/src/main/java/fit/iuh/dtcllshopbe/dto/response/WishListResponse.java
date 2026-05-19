
package fit.iuh.dtcllshopbe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishListResponse {
    private Integer id;
    private String name;
    private String description;
    private Date created_at;
    private Date updated_at;
    private String username;
    private Integer itemCount;
}