package com.pharmacy.dto;

import java.math.BigDecimal;

public class OrderItemResponseDto {
    private String medicineName;
    private int quantity;
    private BigDecimal price;

    // Getters and Setters
    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}