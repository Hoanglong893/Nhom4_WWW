// src/main/java/fit/iuh/dtcllshopbe/dto/response/WishlistDetailResponse.java
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
public class WishListDetailResponse {
    private Integer id;
    private String note;
    private Date created_at;
    private Integer wishlistId;
    private Integer productId;
    private String productName;
    private String productImage;
    private Double productPrice;
    private Integer discountAmount;
}