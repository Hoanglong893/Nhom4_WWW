package fit.iuh.dtcllshopbe.dto.response;

import fit.iuh.dtcllshopbe.enums.Role;
import fit.iuh.dtcllshopbe.enums.StatusLogin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AccountResponse {
    int id;
    CustomerResponse customer;
    String username;
    Role role;
    Date createAt;
    Date updateAt;
    StatusLogin statusLogin;
}