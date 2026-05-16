package fit.iuh.dtcllshopbe.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import fit.iuh.dtcllshopbe.dto.request.AccountRequest;
import fit.iuh.dtcllshopbe.entity.Account;
import fit.iuh.dtcllshopbe.enums.Role;
import fit.iuh.dtcllshopbe.repository.AccountRepository;

@Configuration
@Slf4j
public class ApplicationInitConfig {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(AccountRepository accountRepository) {
        return args -> {
            if (!accountRepository.existsByUsername("admin")) {
                Account account = Account.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN)
                        .build();
                accountRepository.save(account);
                log.warn("admin user has been created with username: admin and password: admin");
            }
        };
    }
}