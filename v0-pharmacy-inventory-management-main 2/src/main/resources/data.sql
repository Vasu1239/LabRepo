-- Insert demo users with plain text passwords (FOR DEVELOPMENT ONLY!)
-- Passwords are 'demo123'
INSERT INTO USERS (name, email, password, user_type) VALUES
('Customer Demo', 'customer@demo.com', 'demo123', 'CUSTOMER'),
('Admin Demo', 'admin@demo.com', 'demo123', 'ADMIN'),
('Vendor Demo', 'vendor@demo.com', 'demo123', 'VENDOR');

-- Insert demo vendors
INSERT INTO VENDORS (name, email, phone, address, contact_person) VALUES
('PharmaCorp Ltd', 'contact@pharmacorp.com', '+1-555-0101', '123 Medical St', 'John Smith'),
('MediSupply Inc', 'sales@medisupply.com', '+1-555-0102', '456 Health Ave', 'Sarah Johnson'),
('Global Pharma', 'info@globalpharma.com', '+1-555-0103', '789 Wellness Blvd', 'Mike Davis');

-- Insert demo categories
INSERT INTO CATEGORIES (name, description) VALUES
('Pain Relief', 'Medications for pain management'),
('Antibiotics', 'Bacterial infection treatments'),
('Vitamins', 'Nutritional supplements'),
('Cold & Flu', 'Common cold and flu remedies'),
('Digestive Health', 'Stomach and digestive aids');

-- Insert demo medicines
-- Note: category_id and vendor_id correspond to the IDs of the items we inserted above (1, 2, 3...)
INSERT INTO MEDICINES (name, description, manufacturer, price, stock, expiry_date, category_id, vendor_id) VALUES
('Aspirin 500mg', 'Effective pain reliever and anti-inflammatory', 'PharmaCorp', 12.99, 150, '2025-12-31', 1, 1),
('Amoxicillin 250mg', 'Broad-spectrum antibiotic for bacterial infections', 'MediSupply', 24.99, 75, '2025-08-15', 2, 2),
('Vitamin D3 1000IU', 'Essential vitamin for bone health', 'Global Pharma', 15.99, 200, '2026-03-20', 3, 3),
('Cough Syrup', 'Soothing relief for persistent cough', 'PharmaCorp', 8.99, 90, '2025-10-10', 4, 1),
('Antacid Tablets', 'Fast relief from heartburn and indigestion', 'MediSupply', 6.99, 120, '2025-11-30', 5, 2),
('Ibuprofen 400mg', 'Non-steroidal anti-inflammatory drug', 'Global Pharma', 14.99, 85, '2025-09-25', 1, 3);