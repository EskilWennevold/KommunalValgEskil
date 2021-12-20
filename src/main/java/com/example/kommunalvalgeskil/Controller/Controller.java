package com.example.kommunalvalgeskil.Controller;


import com.example.kommunalvalgeskil.Model.Medlem;
import com.example.kommunalvalgeskil.Repository.MedlemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/kommunalvalg")
public class Controller {

    @Autowired
    MedlemRepo medlemRepo;

    @GetMapping
    public ResponseEntity<List<Medlem>> findAll(){
        List<Medlem> medlemmer = new ArrayList<>();
        medlemRepo.findAll().forEach(medlemmer::add);
        return ResponseEntity.status(HttpStatus.OK).body(medlemmer);
    }
    @GetMapping("/{parti}")
    public ResponseEntity<List<Medlem>> findAllByParti(@PathVariable String parti){
        List<Medlem> medlemmer = new ArrayList<>();
        medlemRepo.findAllByParti(parti).forEach(medlemmer::add);
        return ResponseEntity.status(HttpStatus.OK).body(medlemmer);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Optional<Medlem>>findById(@PathVariable Long id){
        Optional<Medlem> optionalMedlem = medlemRepo.findById(id);
        if(optionalMedlem.isPresent()){
            return ResponseEntity.status(HttpStatus.OK).body(optionalMedlem);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(optionalMedlem);
        }
    }

    @PostMapping
    public ResponseEntity<Medlem> create(@RequestBody Medlem medlem) {

        Medlem newMedlem = medlemRepo.save(medlem);

        return ResponseEntity.status(HttpStatus.CREATED).body(newMedlem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medlem> edit(@RequestBody Medlem medlem, @PathVariable Long id) {
        Optional<Medlem> optionalMedlem = medlemRepo.findById(id);
        if(optionalMedlem.isPresent()) {
            medlemRepo.save(medlem);
            return ResponseEntity.status(HttpStatus.OK).body(medlem);
        } else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(medlem);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Medlem> delete(@PathVariable Long id){
        Optional<Medlem> optionalMedlem = medlemRepo.findById(id);
        if (optionalMedlem.isPresent()){
            medlemRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }



}
