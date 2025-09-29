"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Package, LogOut, Plus, Edit, Trash2, Eye, CreditCard } from "lucide-react"

export default function PharmacyInventorySystem() {
  const [currentUser, setCurrentUser] = useState(null)
  const [userType, setUserType] = useState("")
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", userType: "customer" })

  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "card",
  })

  const [editingMedicine, setEditingMedicine] = useState(null)
  const [editingVendor, setEditingVendor] = useState(null)
  const [previewItem, setPreviewItem] = useState(null)

  const [categories, setCategories] = useState([
    "Pain Relief",
    "Antibiotic",
    "Vitamin",
    "Antiseptic",
    "Cough & Cold",
    "Digestive",
    "Heart & Blood Pressure",
  ])
  const [newCategory, setNewCategory] = useState("")

  // Sample data
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Paracetamol",
      category: "Pain Relief",
      price: 5.99,
      stock: 100,
      vendor: "MedSupply Co",
      vendorPrice: 3.5,
      description: "Effective pain relief and fever reducer",
      expiryDate: "2025-12-31",
      manufacturer: "PharmaCorp Ltd",
    },
    {
      id: 2,
      name: "Amoxicillin",
      category: "Antibiotic",
      price: 12.99,
      stock: 50,
      vendor: "PharmaCorp",
      vendorPrice: 8.0,
      description: "Broad-spectrum antibiotic for bacterial infections",
      expiryDate: "2025-08-15",
      manufacturer: "MediCore Inc",
    },
    {
      id: 3,
      name: "Ibuprofen",
      category: "Pain Relief",
      price: 7.99,
      stock: 75,
      vendor: "MedSupply Co",
      vendorPrice: 4.5,
      description: "Anti-inflammatory pain reliever",
      expiryDate: "2025-10-20",
      manufacturer: "HealthPlus Ltd",
    },
    {
      id: 4,
      name: "Aspirin",
      category: "Pain Relief",
      price: 4.99,
      stock: 120,
      vendor: "HealthPlus",
      vendorPrice: 2.8,
      description: "Blood thinner and pain reliever",
      expiryDate: "2025-11-30",
      manufacturer: "CardioMed Inc",
    },
  ])

  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: "MedSupply Co",
      contact: "contact@medsupply.com",
      phone: "+1-555-0101",
      address: "123 Medical St, Health City",
    },
    {
      id: 2,
      name: "PharmaCorp",
      contact: "sales@pharmacorp.com",
      phone: "+1-555-0102",
      address: "456 Pharma Ave, Med Town",
    },
    {
      id: 3,
      name: "HealthPlus",
      contact: "orders@healthplus.com",
      phone: "+1-555-0103",
      address: "789 Wellness Blvd, Care City",
    },
  ])

  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "John Doe",
      items: [{ medicine: "Paracetamol", quantity: 2, price: 5.99 }],
      total: 11.98,
      status: "Completed",
      date: "2024-01-15",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      items: [{ medicine: "Amoxicillin", quantity: 1, price: 12.99 }],
      total: 12.99,
      status: "Pending",
      date: "2024-01-16",
    },
  ])

  const [cart, setCart] = useState([])
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    vendor: "",
    vendorPrice: "",
    description: "",
    expiryDate: "",
    manufacturer: "",
  })

  const handleLogin = (e) => {
    e.preventDefault()
    // Simulate login - in real app, this would call your Spring Boot API
    if (loginForm.email && loginForm.password) {
      const user = { name: loginForm.email.split("@")[0], email: loginForm.email }
      setCurrentUser(user)
      // Determine user type based on email domain (demo purposes)
      if (loginForm.email.includes("admin")) setUserType("admin")
      else if (loginForm.email.includes("vendor")) setUserType("vendor")
      else setUserType("customer")
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    // Simulate registration - in real app, this would call your Spring Boot API
    if (registerForm.name && registerForm.email && registerForm.password) {
      const user = { name: registerForm.name, email: registerForm.email }
      setCurrentUser(user)
      setUserType(registerForm.userType)
    }
  }

  const addToCart = (medicine) => {
    const existingItem = cart.find((item) => item.id === medicine.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }])
    }
  }

  const removeFromCart = (medicineId) => {
    setCart(cart.filter((item) => item.id !== medicineId))
  }

  const handleCheckout = (e) => {
    e.preventDefault()
    const newOrder = {
      id: orders.length + 1,
      customerName: checkoutForm.name,
      items: cart.map((item) => ({
        medicine: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "Processing",
      date: new Date().toISOString().split("T")[0],
      shippingAddress: `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.zipCode}`,
      paymentMethod: checkoutForm.paymentMethod,
    }
    setOrders([...orders, newOrder])
    setCart([])
    setCheckoutForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      paymentMethod: "card",
    })
    alert("Order placed successfully!")
  }

  const addMedicine = (e) => {
    e.preventDefault()
    const medicine = {
      id: medicines.length + 1,
      name: newMedicine.name,
      category: newMedicine.category,
      price: Number.parseFloat(newMedicine.price),
      stock: Number.parseInt(newMedicine.stock),
      vendor: newMedicine.vendor,
      vendorPrice: Number.parseFloat(newMedicine.vendorPrice),
      description: newMedicine.description,
      expiryDate: newMedicine.expiryDate,
      manufacturer: newMedicine.manufacturer,
    }
    setMedicines([...medicines, medicine])
    setNewMedicine({
      name: "",
      category: "",
      price: "",
      stock: "",
      vendor: "",
      vendorPrice: "",
      description: "",
      expiryDate: "",
      manufacturer: "",
    })
  }

  const handleEditMedicine = (medicine) => {
    setEditingMedicine({ ...medicine })
  }

  const saveEditMedicine = () => {
    setMedicines(medicines.map((med) => (med.id === editingMedicine.id ? editingMedicine : med)))
    setEditingMedicine(null)
  }

  const deleteMedicine = (medicineId) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      setMedicines(medicines.filter((med) => med.id !== medicineId))
    }
  }

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const updateStock = (medicineId, newStock) => {
    setMedicines(medicines.map((med) => (med.id === medicineId ? { ...med, stock: newStock } : med)))
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Pharmacy Management System</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign In
                  </Button>
                  <div className="text-sm text-gray-600 mt-4">
                    <p>
                      <strong>Demo Accounts:</strong>
                    </p>
                    <p>Admin: admin@pharmacy.com</p>
                    <p>Vendor: vendor@supplier.com</p>
                    <p>Customer: customer@email.com</p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userType">Account Type</Label>
                    <Select
                      value={registerForm.userType}
                      onValueChange={(value) => setRegisterForm({ ...registerForm, userType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Pharmacy Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="capitalize">
                {userType}
              </Badge>
              <span className="text-sm text-gray-700">Welcome, {currentUser.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentUser(null)
                  setUserType("")
                  setCart([])
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userType === "customer" && (
          <Tabs defaultValue="medicines" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="medicines">Browse Medicines</TabsTrigger>
              <TabsTrigger value="cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cart.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="medicines">
              <Card>
                <CardHeader>
                  <CardTitle>Available Medicines</CardTitle>
                  <CardDescription>Browse and add medicines to your cart</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {medicines.map((medicine) => (
                      <Card key={medicine.id} className="border">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg">{medicine.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{medicine.category}</p>
                          <p className="text-sm text-gray-500 mb-3">{medicine.description}</p>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-green-600">${medicine.price}</span>
                            <Badge variant={medicine.stock > 10 ? "default" : "destructive"}>
                              Stock: {medicine.stock}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => addToCart(medicine)}
                              className="flex-1"
                              disabled={medicine.stock === 0}
                            >
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setPreviewItem(medicine)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cart">
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Cart</CardTitle>
                  <CardDescription>Review your selected items</CardDescription>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold">
                            Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                          </span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Proceed to Checkout
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Checkout</DialogTitle>
                              <DialogDescription>Complete your order details</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCheckout} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="checkout-name">Full Name</Label>
                                  <Input
                                    id="checkout-name"
                                    value={checkoutForm.name}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="checkout-email">Email</Label>
                                  <Input
                                    id="checkout-email"
                                    type="email"
                                    value={checkoutForm.email}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="checkout-phone">Phone</Label>
                                <Input
                                  id="checkout-phone"
                                  value={checkoutForm.phone}
                                  onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="checkout-address">Address</Label>
                                <Textarea
                                  id="checkout-address"
                                  value={checkoutForm.address}
                                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="checkout-city">City</Label>
                                  <Input
                                    id="checkout-city"
                                    value={checkoutForm.city}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="checkout-zip">ZIP Code</Label>
                                  <Input
                                    id="checkout-zip"
                                    value={checkoutForm.zipCode}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, zipCode: e.target.value })}
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="payment-method">Payment Method</Label>
                                <Select
                                  value={checkoutForm.paymentMethod}
                                  onValueChange={(value) => setCheckoutForm({ ...checkoutForm, paymentMethod: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                                    <SelectItem value="paypal">PayPal</SelectItem>
                                    <SelectItem value="cash">Cash on Delivery</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button type="submit" className="w-full">
                                Place Order - $
                                {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {userType === "admin" && (
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Medicine Inventory</CardTitle>
                    <CardDescription>Manage your pharmacy stock</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medicine
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Medicine</DialogTitle>
                        <DialogDescription>Enter the details for the new medicine</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={addMedicine} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="med-name">Medicine Name</Label>
                            <Input
                              id="med-name"
                              value={newMedicine.name}
                              onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="med-category">Category</Label>
                            <Select
                              value={newMedicine.category}
                              onValueChange={(value) => setNewMedicine({ ...newMedicine, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="med-price">Selling Price</Label>
                            <Input
                              id="med-price"
                              type="number"
                              step="0.01"
                              value={newMedicine.price}
                              onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="med-stock">Stock Quantity</Label>
                            <Input
                              id="med-stock"
                              type="number"
                              value={newMedicine.stock}
                              onChange={(e) => setNewMedicine({ ...newMedicine, stock: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="med-vendor">Vendor</Label>
                            <Select
                              value={newMedicine.vendor}
                              onValueChange={(value) => setNewMedicine({ ...newMedicine, vendor: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
                              </SelectTrigger>
                              <SelectContent>
                                {vendors.map((vendor) => (
                                  <SelectItem key={vendor.id} value={vendor.name}>
                                    {vendor.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="med-vendor-price">Vendor Price</Label>
                            <Input
                              id="med-vendor-price"
                              type="number"
                              step="0.01"
                              value={newMedicine.vendorPrice}
                              onChange={(e) => setNewMedicine({ ...newMedicine, vendorPrice: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="med-expiry">Expiry Date</Label>
                            <Input
                              id="med-expiry"
                              type="date"
                              value={newMedicine.expiryDate}
                              onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="med-manufacturer">Manufacturer</Label>
                            <Input
                              id="med-manufacturer"
                              value={newMedicine.manufacturer}
                              onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="med-description">Description</Label>
                          <Textarea
                            id="med-description"
                            value={newMedicine.description}
                            onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Add Medicine
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Vendor Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicines.map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell>{medicine.category}</TableCell>
                          <TableCell>${medicine.price}</TableCell>
                          <TableCell>
                            <Badge variant={medicine.stock > 10 ? "default" : "destructive"}>{medicine.stock}</Badge>
                          </TableCell>
                          <TableCell>{medicine.vendor}</TableCell>
                          <TableCell>${medicine.vendorPrice}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => setPreviewItem(medicine)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEditMedicine(medicine)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 bg-transparent"
                                onClick={() => deleteMedicine(medicine.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Medicine Categories</CardTitle>
                  <CardDescription>Manage medicine categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    <Input
                      placeholder="Enter new category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button onClick={addCategory}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {categories.map((category, index) => (
                      <Badge key={index} variant="outline" className="p-2 justify-center">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ... existing code for orders and vendors tabs ... */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Orders</CardTitle>
                  <CardDescription>Manage customer orders and fulfillment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.medicine} x{item.quantity}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>${order.total}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === "Completed" ? "default" : "secondary"}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => setPreviewItem(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vendors">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Management</CardTitle>
                  <CardDescription>Manage your medicine suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Contact Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-medium">{vendor.name}</TableCell>
                          <TableCell>{vendor.contact}</TableCell>
                          <TableCell>{vendor.phone}</TableCell>
                          <TableCell>{vendor.address}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => setPreviewItem(vendor)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setEditingVendor(vendor)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {userType === "vendor" && (
          <Card>
            <CardHeader>
              <CardTitle>Vendor Dashboard</CardTitle>
              <CardDescription>Manage your medicine supplies and orders from pharmacies</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="products" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="products">My Products</TabsTrigger>
                  <TabsTrigger value="orders">Pharmacy Orders</TabsTrigger>
                  <TabsTrigger value="categories">Add Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Products I Supply</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>Add a new medicine to your catalog</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={addMedicine} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="vendor-med-name">Medicine Name</Label>
                                <Input
                                  id="vendor-med-name"
                                  value={newMedicine.name}
                                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="vendor-med-category">Category</Label>
                                <Select
                                  value={newMedicine.category}
                                  onValueChange={(value) => setNewMedicine({ ...newMedicine, category: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="vendor-price">Your Price</Label>
                                <Input
                                  id="vendor-price"
                                  type="number"
                                  step="0.01"
                                  value={newMedicine.vendorPrice}
                                  onChange={(e) => setNewMedicine({ ...newMedicine, vendorPrice: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="vendor-stock">Available Stock</Label>
                                <Input
                                  id="vendor-stock"
                                  type="number"
                                  value={newMedicine.stock}
                                  onChange={(e) => setNewMedicine({ ...newMedicine, stock: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <Button type="submit" className="w-full">
                              Add Product
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medicine Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>My Price</TableHead>
                          <TableHead>Available Stock</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {medicines
                          .filter((med) => med.vendor === "MedSupply Co")
                          .map((medicine) => (
                            <TableRow key={medicine.id}>
                              <TableCell>{medicine.name}</TableCell>
                              <TableCell>{medicine.category}</TableCell>
                              <TableCell>${medicine.vendorPrice}</TableCell>
                              <TableCell>{medicine.stock}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => setPreviewItem(medicine)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleEditMedicine(medicine)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="orders">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Orders from Pharmacies</h3>
                    <div className="text-center py-8 text-gray-500">No pending orders from pharmacies</div>
                  </div>
                </TabsContent>

                <TabsContent value="categories">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Manage Categories</h3>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                      <Button onClick={addCategory}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="p-2 justify-center">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      {previewItem && (
        <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{previewItem.name || `Order #${previewItem.id}` || previewItem.customerName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {previewItem.category && (
                <>
                  <div>
                    <strong>Category:</strong> {previewItem.category}
                  </div>
                  <div>
                    <strong>Price:</strong> ${previewItem.price}
                  </div>
                  <div>
                    <strong>Stock:</strong> {previewItem.stock}
                  </div>
                  <div>
                    <strong>Vendor:</strong> {previewItem.vendor}
                  </div>
                  <div>
                    <strong>Description:</strong> {previewItem.description}
                  </div>
                  <div>
                    <strong>Expiry Date:</strong> {previewItem.expiryDate}
                  </div>
                  <div>
                    <strong>Manufacturer:</strong> {previewItem.manufacturer}
                  </div>
                </>
              )}
              {previewItem.contact && (
                <>
                  <div>
                    <strong>Contact:</strong> {previewItem.contact}
                  </div>
                  <div>
                    <strong>Phone:</strong> {previewItem.phone}
                  </div>
                  <div>
                    <strong>Address:</strong> {previewItem.address}
                  </div>
                </>
              )}
              {previewItem.items && (
                <>
                  <div>
                    <strong>Customer:</strong> {previewItem.customerName}
                  </div>
                  <div>
                    <strong>Total:</strong> ${previewItem.total}
                  </div>
                  <div>
                    <strong>Status:</strong> {previewItem.status}
                  </div>
                  <div>
                    <strong>Date:</strong> {previewItem.date}
                  </div>
                  <div>
                    <strong>Items:</strong>
                  </div>
                  {previewItem.items.map((item, index) => (
                    <div key={index} className="ml-4">
                      {item.medicine} x{item.quantity} - ${item.price}
                    </div>
                  ))}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingMedicine && (
        <Dialog open={!!editingMedicine} onOpenChange={() => setEditingMedicine(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Medicine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Medicine Name</Label>
                  <Input
                    value={editingMedicine.name}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={editingMedicine.category}
                    onValueChange={(value) => setEditingMedicine({ ...editingMedicine, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingMedicine.price}
                    onChange={(e) =>
                      setEditingMedicine({ ...editingMedicine, price: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={editingMedicine.stock}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, stock: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingMedicine.description}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, description: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={saveEditMedicine} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingMedicine(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
