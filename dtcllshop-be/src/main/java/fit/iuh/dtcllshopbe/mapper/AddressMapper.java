package fit.iuh.dtcllshopbe.mapper;

import fit.iuh.dtcllshopbe.dto.response.AddressResponse;
import fit.iuh.dtcllshopbe.entities.Address;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressResponse toAddressResponse(Address address);
}
