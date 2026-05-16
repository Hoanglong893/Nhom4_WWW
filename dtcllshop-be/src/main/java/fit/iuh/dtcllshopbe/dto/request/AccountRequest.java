package fit.iuh.dtcllshopbe.dto.request;

import fit.iuh.dtcllshopbe.enums.Role;
import fit.iuh.dtcllshopbe.enums.StatusLogin;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequest {
    @Size(min = 3, message = "Username_Error")
    private String username;
    @Size(min = 6, message = "Password_Error")
    private String password;

    private CustomerRequest customer;
    @Enumerated(EnumType.STRING)
    private Role role;
    private StatusLogin statusLogin;

}