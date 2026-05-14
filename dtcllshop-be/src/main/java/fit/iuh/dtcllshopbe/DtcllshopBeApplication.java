package fit.iuh.dtcllshopbe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
        "fit.iuh.dtcllshopbe",
        "fit.iuh.dtcllshopbe"
})
@EnableJpaRepositories(basePackages = {
        "fit.iuh.dtcllshopbe.repository",
        "fit.iuh.dtcllshopbe.repository"
})
@EntityScan(basePackages = {
        "fit.iuh.dtcllshopbe.entities",
        "fit.iuh.dtcllshopbe.entities"
})
public class DtcllshopBeApplication {
    public static void main(String[] args) {
        SpringApplication.run(DtcllshopBeApplication.class, args);
    }
}
