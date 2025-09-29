package com.pharmacy.controller;

import com.pharmacy.dto.OrderRequestDto;
import com.pharmacy.dto.OrderResponseDto;
import com.pharmacy.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponseDto> getAllOrders() {
        return orderService.getAllOrders();
    }
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        try {
            OrderResponseDto newOrderDto = orderService.placeOrder(orderRequestDto);
            return new ResponseEntity<>(newOrderDto, HttpStatus.CREATED);
        } catch (Exception e) {
            // Return the specific error message (e.g., "Not enough stock...")
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}