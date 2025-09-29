package com.pharmacy.controller;

import com.pharmacy.dto.MedicineDto;
import com.pharmacy.dto.MedicineRequestDto;
import com.pharmacy.entity.Medicine;
import com.pharmacy.service.MedicineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*") 
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    public List<MedicineDto> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @PostMapping
    public ResponseEntity<Medicine> createMedicine(@RequestBody MedicineRequestDto medicineRequest) {
        Medicine newMedicine = medicineService.createMedicine(medicineRequest);
        return new ResponseEntity<>(newMedicine, HttpStatus.CREATED);
    }
}