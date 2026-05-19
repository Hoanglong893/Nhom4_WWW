package fit.iuh.dtcllshopbe.mapper;

import fit.iuh.dtcllshopbe.dto.response.CustomerTradingResponse;
import fit.iuh.dtcllshopbe.entities.CustomerTrading;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerTradingMapper {
    CustomerTradingResponse toCustomerTradingMapper(CustomerTrading customerTrading);
}
