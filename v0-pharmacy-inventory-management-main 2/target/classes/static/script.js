// API Configuration
const API_BASE_URL = "/api";

// Global State
let currentUser = null;
let medicines = [];
let orders = [];
let vendors = [];
let categories = [];
let cart = [];

// DOM Elements
const authSection = document.getElementById("auth-section");
const mainApp = document.getElementById("main-app");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authSubmit = document.getElementById("auth-submit");
const authSwitchText = document.getElementById("auth-switch-text");
const authSwitchLink = document.getElementById("auth-switch-link");
const nameField = document.getElementById("name-field");
const userTypeField = document.getElementById("usertype-field");

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showMainApp();
  } else {
    showAuthSection();
  }
}

function setupEventListeners() {
  authSwitchLink.addEventListener("click", toggleAuthMode);
  authForm.addEventListener("submit", handleAuthSubmit);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document.querySelectorAll(".nav-tab").forEach(tab => tab.addEventListener("click", handleTabSwitch));
  document.getElementById("medicine-search").addEventListener("input", renderMedicines);
  document.getElementById("category-filter").addEventListener("change", renderMedicines);
  document.getElementById("add-medicine-btn").addEventListener("click", showAddMedicineModal);
  document.getElementById("add-vendor-btn").addEventListener("click", showAddVendorModal);
  document.getElementById("add-category-btn").addEventListener("click", showAddCategoryModal);
  document.getElementById("clear-cart-btn").addEventListener("click", clearCart);
  document.getElementById("checkout-btn").addEventListener("click", showCheckoutModal);
  document.getElementById("modal-overlay").addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });
   // Remove demo buttons as we are using real login now
   document.querySelector('.demo-accounts').style.display = 'none';
}

// --- Authentication Functions ---
function toggleAuthMode(e) {
    e.preventDefault();
    const isLogin = authTitle.textContent.includes("Login");
    const nameInput = document.getElementById('name'); // Get the name input element

    if (isLogin) {
        // Switch to Register mode
        authTitle.textContent = "Register for Pharmacy System";
        authSubmit.textContent = "Register";
        authSwitchText.textContent = "Already have an account?";
        authSwitchLink.textContent = "Login here";
        nameField.style.display = "block";
        userTypeField.style.display = "block";
        nameInput.required = true; // IMPORTANT: Make the name field required for registration
    } else {
        // Switch to Login mode
        authTitle.textContent = "Login to Pharmacy System";
        authSubmit.textContent = "Login";
        authSwitchText.textContent = "Don't have an account?";
        authSwitchLink.textContent = "Register here";
        nameField.style.display = "none";
        userTypeField.style.display = "none";
        nameInput.required = false; // IMPORTANT: Make the name field NOT required for login
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const formData = new FormData(authForm);
    const data = Object.fromEntries(formData.entries());
    const isLogin = authTitle.textContent.includes("Login");

    if (isLogin) {
        login(data.email, data.password);
    } else {
        register(data.name, data.email, data.password, data.userType);
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            currentUser = await response.json();
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            showMainApp();
        } else {
            showAlert("Invalid credentials", "error");
        }
    } catch (error) {
        console.error("Login failed:", error);
        showAlert("Login failed. Server may be down.", "error");
    }
}

async function register(name, email, password, userType) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, userType }),
    });

    if (response.ok) {
      showAlert("Registration successful! Please login.", "success");
      toggleAuthMode({ preventDefault: () => {} }); // Switch to login form
    } else {
      // THIS IS THE NEW, IMPROVED PART
      // It reads the specific error message from the backend response
      let errorMessage = "Registration failed.";
      try {
        const errorData = await response.json();
        // Spring validation errors are often in an "errors" or "message" field
        if (errorData.message) {
            errorMessage = errorData.message;
        } else if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).join(', ');
        }
      } catch (e) {
        // Fallback if the response is not JSON
        errorMessage = await response.text();
      }
      showAlert(`Error: ${errorMessage}`, "error");
    }
  } catch (error) {
    showAlert("Registration failed due to a network error.", "error");
  }
}

function handleLogout() {
    currentUser = null;
    cart = [];
    localStorage.removeItem("currentUser");
    showAuthSection();
}

// --- UI Functions ---
function showAuthSection() {
    authSection.style.display = "flex";
    mainApp.style.display = "none";
}

function showMainApp() {
    authSection.style.display = "none";
    mainApp.style.display = "block";
    updateUserInfo();
    setupUserInterface();
    loadData(); // Load real data from backend
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById("user-info").textContent = `${currentUser.name} (${currentUser.userType.toLowerCase()})`;
    }
}

function setupUserInterface() {
    const userType = currentUser.userType;
    document.getElementById("vendors-tab").style.display = userType === "ADMIN" ? "block" : "none";
    document.getElementById("categories-tab").style.display = userType === "ADMIN" ? "block" : "none";
    document.getElementById("cart-tab").style.display = userType === "CUSTOMER" ? "block" : "none";
    document.getElementById("add-medicine-btn").style.display = userType === "ADMIN" || userType === "VENDOR" ? "block" : "none";
    document.getElementById("add-vendor-btn").style.display = userType === "ADMIN" ? "block" : "none";
    document.getElementById("add-category-btn").style.display = userType === "ADMIN" ? "block" : "none";
    const ordersTab = document.getElementById("orders-tab");
    ordersTab.innerHTML = userType === "CUSTOMER" ? '<i class="fas fa-shopping-cart"></i> My Orders' : '<i class="fas fa-list"></i> Orders Management';
}

function handleTabSwitch(e) {
    const tabName = e.target.dataset.tab;

    document.querySelectorAll(".nav-tab").forEach(tab => tab.classList.remove("active"));
    e.target.classList.add("active");

    document.querySelectorAll(".content-section").forEach(section => section.classList.remove("active"));
    const activeSection = document.getElementById(`${tabName}-section`);
    if (activeSection) {
        activeSection.classList.add("active");
    }

    // This is the important part we are adding
    // It calls the correct render function when a tab is clicked
    switch (tabName) {
        case "cart":
            renderCart();
            break;
        case "orders":
            renderOrders();
            break;
        // Add other cases if needed
    }
}

// --- Data Loading and Rendering ---
async function loadData() {
    try {
        const [medicinesRes, categoriesRes, vendorsRes, ordersRes] = await Promise.all([
            fetch(`${API_BASE_URL}/medicines`),
            fetch(`${API_BASE_URL}/categories`),
            currentUser.userType === "ADMIN" ? fetch(`${API_BASE_URL}/vendors`) : Promise.resolve(null),
            fetch(`${API_BASE_URL}/orders`)
        ]);

        if (medicinesRes.ok) medicines = await medicinesRes.json();
        if (categoriesRes.ok) categories = await categoriesRes.json();
        if (vendorsRes && vendorsRes.ok) vendors = await vendorsRes.json();
        if (ordersRes.ok) orders = await ordersRes.json();

    } catch (error) {
        console.error("Failed to load data from backend:", error);
        showAlert("Could not load data from the server.", "error");
    }
    
    // Render all sections with the new data
    renderAll();
}

function renderAll() {
    renderMedicines();
    renderCategories();
    renderVendors();
    renderOrders();
    updateCategoryFilter();
}

function renderMedicines() {
    const grid = document.getElementById("medicines-grid");
    const filteredMedicines = getFilteredMedicines();

    if (filteredMedicines.length === 0) {
        grid.innerHTML = '<div class="loading">No medicines found</div>';
        return;
    }

    grid.innerHTML = filteredMedicines.map(medicine => `
        <div class="medicine-card">
            <div class="medicine-header">
                <div>
                    <div class="medicine-name">${medicine.name}</div>
                    <div class="medicine-category">${medicine.categoryName || 'N/A'}</div>
                </div>
            </div>
            <div class="medicine-details">
                <div class="medicine-price">$${medicine.price}</div>
                <div class="medicine-stock ${getStockClass(medicine.stock)}">
                    Stock: ${medicine.stock} units
                </div>
                <div class="medicine-description">${medicine.description || ""}</div>
                <div class="medicine-manufacturer">By ${medicine.manufacturer || ""}</div>
                <div class="medicine-expiry">Expires: ${medicine.expiryDate || ""}</div>
            </div>
            <div class="medicine-actions">
                ${currentUser.userType === "CUSTOMER" ? `
                    <button class="btn-small btn-success" onclick="addToCart(${medicine.id})" ${medicine.stock === 0 ? "disabled" : ""}>
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>` : ""}
                ${currentUser.userType === "ADMIN" || currentUser.userType === "VENDOR" ? `
                    <button class="btn-small btn-warning" onclick="editMedicine(${medicine.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-small btn-danger" onclick="deleteMedicine(${medicine.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>` : ""}
            </div>
        </div>
    `).join("");
}

function renderCategories() {
    const list = document.getElementById("categories-list");
    if (!list) return;
    if (categories.length === 0) {
        list.innerHTML = '<div class="loading">No categories found</div>';
        return;
    }
    list.innerHTML = categories.map(category => `
        <div class="category-card">
            <div class="category-name">${category.name}</div>
            <div class="category-description">${category.description || "No description"}</div>
            <div class="category-actions">
                <button class="btn-small btn-warning" onclick="editCategory(${category.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn-small btn-danger" onclick="deleteCategory(${category.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join("");
}

function renderVendors() {
    const list = document.getElementById("vendors-list");
    if (!list) return;
    if (vendors.length === 0) {
        list.innerHTML = '<div class="loading">No vendors found</div>';
        return;
    }
    list.innerHTML = vendors.map(vendor => `
         <div class="vendor-card">
            <div class="vendor-name">${vendor.name}</div>
            <div class="vendor-details">
                <div class="vendor-detail"><i class="fas fa-envelope"></i><span>${vendor.email}</span></div>
                <div class="vendor-detail"><i class="fas fa-phone"></i><span>${vendor.phone}</span></div>
                <div class="vendor-detail"><i class="fas fa-map-marker-alt"></i><span>${vendor.address}</span></div>
                <div class="vendor-detail"><i class="fas fa-user"></i><span>${vendor.contactPerson}</span></div>
            </div>
            <div class="vendor-actions">
                <button class="btn-small btn-warning" onclick="editVendor(${vendor.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn-small btn-danger" onclick="deleteVendor(${vendor.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join("");
}

function renderOrders() {
    const ordersList = document.getElementById("orders-list");
    if (!ordersList) return;

    let displayOrders = orders;

    // THIS IS THE CRITICAL PART WE ARE ADDING
    // If the current user is a customer, filter the list to show only their orders.
    if (currentUser && currentUser.userType === "CUSTOMER") {
        displayOrders = orders.filter(order => order.customerId === currentUser.id);
    }

    if (displayOrders.length === 0) {
        ordersList.innerHTML = '<div class="loading">No orders found.</div>';
        return;
    }

    ordersList.innerHTML = displayOrders.map(order => {
        // We use the same card for both admin and customer, since the data is the same
        const customerNameToDisplay = currentUser.userType === 'ADMIN' ?
            `<div class="order-detail-value">${order.customerName}</div>` : '';
        const customerLabelToDisplay = currentUser.userType === 'ADMIN' ?
            `<div class="order-detail-label">Customer</div>` : '';

        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-status status-${order.status.toLowerCase()}">${order.status}</div>
                </div>
                <div class="order-details">
                    ${currentUser.userType === 'ADMIN' ? `
                    <div class="order-detail">
                        ${customerLabelToDisplay}
                        ${customerNameToDisplay}
                    </div>
                    ` : ''}
                    <div class="order-detail">
                        <div class="order-detail-label">Date</div>
                        <div class="order-detail-value">${new Date(order.orderDate).toLocaleDateString()}</div>
                    </div>
                    <div class="order-detail">
                        <div class="order-detail-label">Total</div>
                        <div class="order-detail-value">$${order.totalAmount.toFixed(2)}</div>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="btn-small btn-info" onclick="previewOrder(${order.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function getFilteredMedicines() {
    const searchTerm = document.getElementById("medicine-search").value.toLowerCase();
    const categoryFilter = document.getElementById("category-filter").value;
    return medicines.filter(medicine => {
        const matchesSearch = medicine.name.toLowerCase().includes(searchTerm) ||
                              (medicine.description && medicine.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryFilter || medicine.categoryName === categoryFilter;
        return matchesSearch && matchesCategory;
    });
}

function updateCategoryFilter() {
    const categoryFilter = document.getElementById("category-filter");
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join("");
}



// --- Create, Delete, Edit ---

async function addMedicine(medicineData) {
  try {
    const response = await fetch(`${API_BASE_URL}/medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicineData),
    });

    if (response.ok) {
      const newMedicine = await response.json();
      closeModal();
      showAlert("Medicine added successfully!", "success");
      loadData(); // Reload all data from the backend to show the new medicine
    } else {
      // Show the real error from the backend
      const errorText = await response.text();
      showAlert(`Error: ${errorText}`, "error");
    }
  } catch (error) {
    console.error("Failed to add medicine:", error);
    showAlert("Failed to add medicine due to a network error.", "error");
  }
}

async function addVendor(vendorData) {
    try {
        const response = await fetch(`${API_BASE_URL}/vendors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendorData),
        });
        if (response.ok) {
            closeModal();
            showAlert('Vendor added successfully!', 'success');
            loadData();
        } else {
            const error = await response.json();
            showAlert(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        showAlert('Failed to add vendor.', 'error');
    }
}

async function addCategory(categoryData) {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData),
        });
        if (response.ok) {
            closeModal();
            showAlert('Category added successfully!', 'success');
            loadData();
        } else {
            const error = await response.json();
            showAlert(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        showAlert('Failed to add category.', 'error');
    }
}

async function deleteMedicine(id) {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showAlert('Medicine deleted successfully!', 'success');
            loadData();
        } else {
            showAlert('Failed to delete medicine.', 'error');
        }
    } catch (error) {
        showAlert('Failed to delete medicine.', 'error');
    }
}

async function deleteVendor(id) {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/vendors/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showAlert('Vendor deleted successfully!', 'success');
            loadData();
        } else {
            showAlert('Failed to delete vendor.', 'error');
        }
    } catch (error) {
        showAlert('Failed to delete vendor.', 'error');
    }
}

async function deleteCategory(id) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showAlert('Category deleted successfully!', 'success');
            loadData();
        } else {
            showAlert('Failed to delete category.', 'error');
        }
    } catch (error) {
        showAlert('Failed to delete category.', 'error');
    }
}

function editMedicine(id) { showAlert("Edit functionality is not yet implemented.", "info"); }
function editVendor(id) { showAlert("Edit functionality is not yet implemented.", "info"); }
function editCategory(id) { showAlert("Edit functionality is not yet implemented.", "info"); }


// --- Modal Functions ---

function showAddMedicineModal() {
  // CORRECT: Get vendor ID and Name
  const vendorOptions = vendors.map((v) => `<option value="${v.id}">${v.name}</option>`).join("");
  // CORRECT: Get category ID and Name
  const categoryOptions = categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");

  const content = `
        <form id="medicine-form">
            <div class="form-group">
                <label for="medicine-name">Medicine Name</label>
                <input type="text" id="medicine-name" name="name" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="medicine-category">Category</label>
                    <select id="medicine-category" name="categoryId" required> {/* <-- CORRECTED: name="categoryId" */}
                        <option value="">Select Category</option>
                        ${categoryOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="medicine-manufacturer">Manufacturer</label>
                    <input type="text" id="medicine-manufacturer" name="manufacturer">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="medicine-price">Price ($)</label>
                    <input type="number" id="medicine-price" name="price" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="medicine-stock">Stock</label>
                    <input type="number" id="medicine-stock" name="stock" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="medicine-expiry">Expiry Date</label>
                    <input type="date" id="medicine-expiry" name="expiryDate">
                </div>
                <div class="form-group">
                    <label for="medicine-vendor">Vendor</label>
                    <select id="medicine-vendor" name="vendorId" required>
                        <option value="">Select Vendor</option>
                        ${vendorOptions}
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="medicine-description">Description</label>
                <textarea id="medicine-description" name="description" rows="3"></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Add Medicine</button>
            </div>
        </form>
    `;

  showModal("Add New Medicine", content);

  document.getElementById("medicine-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addMedicine(Object.fromEntries(formData));
  });
}

// --- ADD VENDOR ---
// --- ADD VENDOR ---
function showAddVendorModal() {
    const content = `
        <form id="modal-form">
            <div class="form-group"><label>Vendor Name</label><input type="text" name="name" required></div>
            <div class="form-group"><label>Email</label><input type="email" name="email"></div>
            <div class="form-group"><label>Phone</label><input type="tel" name="phone"></div>
            <div class="form-group"><label>Address</label><input type="text" name="address"></div>
            <div class="form-group"><label>Contact Person</label><input type="text" name="contactPerson"></div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Add Vendor</button>
            </div>
        </form>`;
    showModal("Add New Vendor", content);
    document.getElementById("modal-form").addEventListener("submit", e => {
        e.preventDefault();
        addVendor(Object.fromEntries(new FormData(e.target)));
    });
}

async function addVendor(vendorData) {
    try {
        const response = await fetch(`${API_BASE_URL}/vendors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendorData),
        });
        if (response.ok) {
            closeModal();
            showAlert('Vendor added successfully!', 'success');
            loadData(); // Reload all data to show the new vendor
        } else {
            const errorText = await response.text();
            showAlert(`Error: ${errorText}`, 'error');
        }
    } catch (error) {
        showAlert('Failed to add vendor.', 'error');
    }
}


// --- ADD CATEGORY ---
function showAddCategoryModal() {
    const content = `
        <form id="modal-form">
            <div class="form-group"><label>Category Name</label><input type="text" name="name" required></div>
            <div class="form-group"><label>Description</label><textarea name="description" rows="3"></textarea></div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Add Category</button>
            </div>
        </form>`;
    showModal("Add New Category", content);
    document.getElementById("modal-form").addEventListener("submit", e => {
        e.preventDefault();
        addCategory(Object.fromEntries(new FormData(e.target)));
    });
}

async function addCategory(categoryData) {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData),
        });
        if (response.ok) {
            closeModal();
            showAlert('Category added successfully!', 'success');
            loadData(); // Reload all data to show the new category
        } else {
            const errorText = await response.text();
            showAlert(`Error: ${errorText}`, 'error');
        }
    } catch (error) {
        showAlert('Failed to add category.', 'error');
    }
}
// --- Other Utility Functions ---

function getStockClass(stock) {
    if (stock === 0) return "stock-out";
    if (stock < 20) return "stock-low";
    return "stock-high";
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

function showModal(title, content) {
    const modal = document.getElementById("modal-overlay");
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">${content}</div>
    `;
    modal.classList.add("active");
}

function closeModal() {
    document.getElementById("modal-overlay").classList.remove("active");
}
async function placeOrder(orderData) {
  // Build the payload that the backend expects
  const orderPayload = {
    customerId: currentUser.id,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    items: cart.map(item => ({
      medicineId: item.id,
      quantity: item.quantity
    }))
  };

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    if (response.ok) {
      const newOrder = await response.json();
      cart = []; // Clear the cart
      updateCartDisplay();
      closeModal();
      showAlert('Order placed successfully!', 'success');

      // Switch to orders tab to see the new order
      document.querySelector('[data-tab="orders"]').click();
      loadData(); // Reload data to get the new order in the list
    } else {
      const errorText = await response.text();
      showAlert(`Order failed: ${errorText}`, 'error');
    }
  } catch (error) {
    console.error('Failed to place order:', error);
    showAlert('Failed to place order due to a network error.', 'error');
  }
}

// NOTE: Cart and Order functions are simplified placeholders
// --- Cart Functions ---

function addToCart(medicineId) {
    const medicine = medicines.find((m) => m.id === medicineId);
    if (!medicine || medicine.stock === 0) {
        showAlert("This medicine is out of stock.", "error");
        return;
    }

    const existingItem = cart.find((item) => item.id === medicineId);

    if (existingItem) {
        // Don't add more than available stock
        if (existingItem.quantity < medicine.stock) {
            existingItem.quantity++;
            showAlert(`${medicine.name} quantity updated in cart!`, "success");
        } else {
            showAlert(`No more stock available for ${medicine.name}.`, "warning");
        }
    } else {
        cart.push({
            id: medicine.id,
            name: medicine.name,
            price: medicine.price,
            quantity: 1,
        });
        showAlert(`${medicine.name} added to cart!`, "success");
    }

    updateCartDisplay();
}

function updateCartQuantity(medicineId, newQuantity) {
    const medicine = medicines.find((m) => m.id === medicineId);
    const itemInCart = cart.find((item) => item.id === medicineId);

    if (!itemInCart) return;

    if (newQuantity <= 0) {
        removeFromCart(medicineId);
        return;
    }

    // Don't allow quantity to exceed stock
    if (newQuantity > medicine.stock) {
        showAlert(`Only ${medicine.stock} units available for ${medicine.name}.`, "warning");
        itemInCart.quantity = medicine.stock;
    } else {
        itemInCart.quantity = newQuantity;
    }
    
    renderCart(); // Re-render the cart view
    updateCartDisplay();
}

function removeFromCart(medicineId) {
    cart = cart.filter((item) => item.id !== medicineId);
    renderCart();
    updateCartDisplay();
}

function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        renderCart();
        updateCartDisplay();
        showAlert("Cart cleared!", "success");
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// --- Rendering and Modal Functions ---

function renderCart() {
    const cartItemsEl = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
    const cartSummaryEl = document.getElementById("cart-summary");

    updateCartDisplay();

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="loading">Your cart is empty</div>';
        cartSummaryEl.style.display = 'none';
        return;
    }

    cartSummaryEl.style.display = 'block';
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalEl.textContent = total.toFixed(2);

    cartItemsEl.innerHTML = cart.map((item) => {
        const medicineInStock = medicines.find(m => m.id === item.id);
        const maxStock = medicineInStock ? medicineInStock.stock : item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="btn-small btn-danger" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function showCheckoutModal() {
    if (cart.length === 0) {
        showAlert("Your cart is empty! Add items before checking out.", "error");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const content = `
        <form id="checkout-form">
            <h3>Order Summary</h3>
            <div class="checkout-items">
                ${cart.map((item) => `
                    <div class="checkout-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join("")}
            </div>
            <div class="checkout-total">
                <strong>Total: $${total.toFixed(2)}</strong>
            </div>
            
            <h3>Shipping Information</h3>
            <div class="form-group">
                <label for="shipping-address">Shipping Address</label>
                <textarea id="shipping-address" name="shippingAddress" rows="3" required></textarea>
            </div>
            
            <h3>Payment Information</h3>
            <div class="form-group">
                <label for="payment-method">Payment Method</label>
                <select id="payment-method" name="paymentMethod" required>
                    <option value="">Select Payment Method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Place Order</button>
            </div>
        </form>
    `;

    showModal("Checkout", content);

    document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // We already have the cart data, so we just need the form data.
        placeOrder(Object.fromEntries(formData)); 
    });

    function previewOrder(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
        showAlert("Order not found.", "error");
        return;
    }

    const itemsHtml = order.items.map(item => `
        <tr>
            <td>${item.medicineName}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
    `).join("");

    const content = `
        <div class="order-preview">
            <h3>Order #${order.id}</h3>
            <div class="preview-details">
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                <p><strong>Status:</strong> <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></p>
                <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            </div>
            <h4>Order Items:</h4>
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
        </div>
    `;
    showModal("Order Details", content);
}
function previewMedicine(medicineId) {
    const medicine = medicines.find((m) => m.id === medicineId);
    if (!medicine) return;

    const content = `
        <div class="medicine-preview">
            <h3>${medicine.name}</h3>
            <div class="preview-details">
                <p><strong>Category:</strong> ${medicine.categoryName || 'N/A'}</p>
                <p><strong>Price:</strong> $${medicine.price.toFixed(2)}</p>
                <p><strong>Stock:</strong> ${medicine.stock} units</p>
                <p><strong>Manufacturer:</strong> ${medicine.manufacturer || "N/A"}</p>
                <p><strong>Expiry Date:</strong> ${medicine.expiryDate || "N/A"}</p>
                <p><strong>Vendor:</strong> ${medicine.vendorName || "N/A"}</p>
                ${medicine.description ? `<p><strong>Description:</strong> ${medicine.description}</p>` : ""}
            </div>
        </div>
    `;
    showModal("Medicine Details", content);
}

function renderOrdersForAdmin() {
    const list = document.getElementById("ordersList");
    if (!list) return;

    if (orders.length === 0) {
        list.innerHTML = '<div>No orders found.</div>';
        return;
    }

    list.innerHTML = orders.map(order => `
        <div class="order-item">
            <span>Order #${order.id}</span>
            <span>CUSTOMER: ${order.customerName || 'N/A'}</span> <span>${new Date(order.orderDate).toLocaleDateString()}</span>
            <span>$${order.totalAmount.toFixed(2)}</span>
            <span class="status status-${order.status.toLowerCase()}">${order.status}</span>
             <div class="item-actions">
                <button onclick="previewOrder(${order.id})">View</button>
            </div>
        </div>
    `).join("");
}
async function updateOrderStatus(orderId, newStatus) {
    if (!confirm(`Are you sure you want to set this order to ${newStatus}?`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            showAlert(`Order #${orderId} has been ${newStatus.toLowerCase()}.`, 'success');
            loadData(); // Reload all data to show the updated status
        } else {
            const errorText = await response.text();
            showAlert(`Failed to update order: ${errorText}`, 'error');
        }
    } catch (error) {
        showAlert('An error occurred while updating the order status.', 'error');
    }
}
}