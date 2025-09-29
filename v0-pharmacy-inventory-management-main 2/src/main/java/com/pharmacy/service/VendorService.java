package com.pharmacy.service;

import com.pharmacy.entity.Vendor;
import com.pharmacy.exception.ResourceNotFoundException;
import com.pharmacy.repository.VendorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    // ADD THIS METHOD
    public Vendor createVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    public Vendor updateVendor(Long id, Vendor vendorDetails) {
        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));

        existingVendor.setName(vendorDetails.getName());
        existingVendor.setEmail(vendorDetails.getEmail());
        existingVendor.setPhone(vendorDetails.getPhone());
        existingVendor.setAddress(vendorDetails.getAddress());
        existingVendor.setContactPerson(vendorDetails.getContactPerson());

        return vendorRepository.save(existingVendor);
    }
}