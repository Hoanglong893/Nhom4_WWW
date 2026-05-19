package fit.iuh.dtcllshopbe.mapper;

import fit.iuh.dtcllshopbe.dto.response.InvoiceResponse;
import fit.iuh.dtcllshopbe.entities.Invoice;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    InvoiceResponse toInvoiceMapper(Invoice invoice);

}
