package fit.iuh.dtcllshopbe.mapper;

import fit.iuh.dtcllshopbe.dto.response.OrderDetailResponse;
import fit.iuh.dtcllshopbe.entities.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    @Mapping(target = "orderId", expression = "java(orderDetail.getOrder() != null ? orderDetail.getOrder().getId() : 0)")
    @Mapping(target = "productId", expression = "java(orderDetail.getProduct() != null ? orderDetail.getProduct().getId() : 0)")
    OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail);
}
