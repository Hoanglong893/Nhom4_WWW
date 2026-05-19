package fit.iuh.dtcllshopbe.mapper;

import fit.iuh.dtcllshopbe.dto.response.CartDetailResponse;
import fit.iuh.dtcllshopbe.entities.CartDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartDetailMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "sizeDetail.size.nameSize", target = "sizeName")
    @Mapping(source = "sizeDetail.id", target = "sizeDetailId")
    @Mapping(source = "product.imageUrlFront", target = "productImage")
    @Mapping(source = "price_at_time", target = "priceAtTime")
    @Mapping(source = "selected", target = "isSelected")
    CartDetailResponse toCartDetailResponse(CartDetail cartDetail);


}
