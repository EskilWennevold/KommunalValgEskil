package com.example.kommunalvalgeskil.Repository;

import com.example.kommunalvalgeskil.Model.Medlem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedlemRepo extends JpaRepository<Medlem, Long> {

    List<Medlem> findAllByParti(String parti);

}
