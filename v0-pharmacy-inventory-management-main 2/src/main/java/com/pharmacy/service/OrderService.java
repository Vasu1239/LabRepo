package com.pharmacy.service;

import com.pharmacy.dto.OrderItemResponseDto;
import com.pharmacy.dto.OrderRequestDto;
import com.pharmacy.dto.OrderResponseDto;
import com.pharmacy.dto.OrderItemRequestDto;
import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.Order;
import com.pharmacy.entity.OrderItem;
import com.pharmacy.entity.User;
import com.pharmacy.exception.ResourceNotFoundException;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.OrderRepository;
import com.pharmacy.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, MedicineRepository medicineRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.medicineRepository = medicineRepository;
    }

    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::convertToDto) // Reuse our helper method to convert each order
                .collect(Collectors.toList());
    }

    @Transactional
    // FIX #1: The return type is now correctly set to OrderResponseDto
    public OrderResponseDto placeOrder(OrderRequestDto orderRequestDto) {
        // 1. Find the customer
        User customer = userRepository.findById(orderRequestDto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + orderRequestDto.getCustomerId()));

        // 2. Create the main Order object
        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setShippingAddress(orderRequestDto.getShippingAddress());
        order.setPaymentMethod(orderRequestDto.getPaymentMethod());

        BigDecimal totalAmount = BigDecimal.ZERO;

        // 3. Process each item in the cart
        for (OrderItemRequestDto itemDto : orderRequestDto.getItems()) {
            Medicine medicine = medicineRepository.findById(itemDto.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + itemDto.getMedicineId()));

            // 4. Check stock
            if (medicine.getStock() < itemDto.getQuantity()) {
                throw new IllegalStateException("Not enough stock for medicine: " + medicine.getName());
            }

            // 5. Update stock
            medicine.setStock(medicine.getStock() - itemDto.getQuantity());

            // 6. Create the OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMedicine(medicine);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(medicine.getPrice());

            order.getItems().add(orderItem);

            // 7. Add to total amount
            totalAmount = totalAmount.add(medicine.getPrice().multiply(new BigDecimal(itemDto.getQuantity())));
        }

        order.setTotalAmount(totalAmount);

        // 8. Save the order and get the persisted entity back
        Order savedOrder = orderRepository.save(order);

        // FIX #2: Convert the 'savedOrder' to a DTO before returning
        return convertToDto(savedOrder);
    }
    
    // ... inside OrderService.java

private OrderResponseDto convertToDto(Order order) {
    OrderResponseDto dto = new OrderResponseDto();
    dto.setId(order.getId());
    dto.setOrderDate(order.getOrderDate());
    dto.setStatus(order.getStatus());
    dto.setTotalAmount(order.getTotalAmount());

    // ADD THESE TWO LINES TO POPULATE CUSTOMER INFO
    if (order.getCustomer() != null) {
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getName());
    }

    List<OrderItemResponseDto> itemDtos = order.getItems().stream().map(item -> {
        OrderItemResponseDto itemDto = new OrderItemResponseDto();
        itemDto.setMedicineName(item.getMedicine().getName());
        itemDto.setQuantity(item.getQuantity());
        itemDto.setPrice(item.getPrice());
        return itemDto;
    }).collect(Collectors.toList());

    dto.setItems(itemDtos);
    return dto;
}
}