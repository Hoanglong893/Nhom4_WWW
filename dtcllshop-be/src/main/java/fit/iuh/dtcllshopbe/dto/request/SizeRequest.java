package fit.iuh.dtcllshopbe.dto.request;

import fit.iuh.dtcllshopbe.enums.SizeName;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SizeRequest {
    @Enumerated(EnumType.STRING)
    private SizeName nameSize;
}
