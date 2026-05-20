package fit.iuh.dtcllshopbe.mapper;

import fit.iuh.dtcllshopbe.dto.response.SizeDetailResponse;
import fit.iuh.dtcllshopbe.entities.SizeDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SizeDetailMapper {
    SizeDetailResponse toSizeDetailMapper(SizeDetail sizeDetail);
}
