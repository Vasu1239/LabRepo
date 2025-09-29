package com.pharmacy.service;

import com.pharmacy.dto.MedicineDto;
import com.pharmacy.dto.MedicineRequestDto;
import com.pharmacy.entity.Category;
import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.Vendor;
import com.pharmacy.exception.ResourceNotFoundException;
import com.pharmacy.repository.CategoryRepository;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.VendorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;
    private final VendorRepository vendorRepository;

    public MedicineService(MedicineRepository medicineRepository, CategoryRepository categoryRepository, VendorRepository vendorRepository) {
        this.medicineRepository = medicineRepository;
        this.categoryRepository = categoryRepository;
        this.vendorRepository = vendorRepository;
    }

    public List<MedicineDto> getAllMedicines() {
        return medicineRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Medicine createMedicine(MedicineRequestDto medicineRequest) {
        Category category = categoryRepository.findById(medicineRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + medicineRequest.getCategoryId()));

        Vendor vendor = vendorRepository.findById(medicineRequest.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + medicineRequest.getVendorId()));

        Medicine medicine = new Medicine();
        medicine.setName(medicineRequest.getName());
        medicine.setDescription(medicineRequest.getDescription());
        medicine.setManufacturer(medicineRequest.getManufacturer());
        medicine.setPrice(medicineRequest.getPrice());
        medicine.setStock(medicineRequest.getStock());
        medicine.setExpiryDate(medicineRequest.getExpiryDate());
        medicine.setCategory(category);
        medicine.setVendor(vendor);

        return medicineRepository.save(medicine);
    }

    private MedicineDto convertToDto(Medicine medicine) {
        MedicineDto dto = new MedicineDto();
        dto.setId(medicine.getId());
        dto.setName(medicine.getName());
        dto.setDescription(medicine.getDescription());
        dto.setManufacturer(medicine.getManufacturer());
        dto.setPrice(medicine.getPrice());
        dto.setStock(medicine.getStock());
        dto.setExpiryDate(medicine.getExpiryDate());

        if (medicine.getCategory() != null) {
            dto.setCategoryName(medicine.getCategory().getName());
        }
        if (medicine.getVendor() != null) {
            dto.setVendorName(medicine.getVendor().getName());
        }
        
        return dto;
    }
}