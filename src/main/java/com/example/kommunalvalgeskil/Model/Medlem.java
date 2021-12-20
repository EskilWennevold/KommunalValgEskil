package com.example.kommunalvalgeskil.Model;

import javax.persistence.*;

@Entity
@Table(name = "medlemmer")
public class Medlem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "navn")
    private String navn;

    @Column(name = "parti")
    private String parti;

    @Column(name = "stemmer")
    private int stemmer;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNavn() {
        return navn;
    }

    public void setNavn(String navn) {
        this.navn = navn;
    }

    public String getParti() {
        return parti;
    }

    public void setParti(String parti) {
        this.parti = parti;
    }

    public int getStemmer() {
        return stemmer;
    }

    public void setStemmer(int stemmer) {
        this.stemmer = stemmer;
    }
}
