package fit.iuh.dtcllshopbe.mapper;

import fit.iuh.dtcllshopbe.dto.request.CustomerRequest;
import fit.iuh.dtcllshopbe.dto.response.CustomerResponse;
import fit.iuh.dtcllshopbe.entities.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValueCheckStrategy;

@Mapper(componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface CustomerMapper {
    Customer toCustomer(CustomerRequest customerRequest);
    void updateCustomerFromRequest(CustomerRequest customerRequest, @MappingTarget Customer customer);

    @Mapping(source = "account.id", target = "accountId")
    CustomerResponse toCustomerResponse(Customer customer);
}
