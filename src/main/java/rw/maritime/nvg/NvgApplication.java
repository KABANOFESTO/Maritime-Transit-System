package rw.maritime.nvg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"rw.maritime.nvg.model"})
@EnableJpaRepositories(basePackages = {"rw.maritime.nvg.repository"})
public class NvgApplication {

	public static void main(String[] args) {
		SpringApplication.run(NvgApplication.class, args);
	}

}
