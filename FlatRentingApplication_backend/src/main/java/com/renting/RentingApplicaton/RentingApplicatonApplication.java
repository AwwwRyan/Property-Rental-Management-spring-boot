package com.renting.RentingApplicaton;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.renting.RentingApplicaton.entity")
@EnableJpaRepositories(basePackages = "com.renting.RentingApplicaton.repository")
public class RentingApplicatonApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentingApplicatonApplication.class, args);
	}

}
