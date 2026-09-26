import React, { createContext, useContext, useState } from 'react';

const InventoryContext = createContext();

// Default Registered Accounts Database
const initialRegisteredUsers = [
  {
    id: 'user-mgr-1',
    name: 'Raghul S (Team Lead)',
    email: 'manager@stocksense.io',
    password: 'manager123',
    role: 'Inventory Manager',
    assignedWarehouse: 'All Warehouses',
    avatar: 'RM'
  },
  {
    id: 'user-staff-1',
    name: 'Alex Rivera (Staff)',
    email: 'staff@stocksense.io',
    password: 'staff123',
    role: 'Warehouse Staff',
    assignedWarehouse: 'WH/Stock1',
    avatar: 'AR'
  }
];

// Initial Mock Data
const initialProducts = [
  {
    id: 'prod-1',
    name: 'Steel Rods',
    sku: 'STL-RD-001',
    category: 'Raw Materials',
    uom: 'kg',
    minReorder: 30,
    maxReorder: 200,
    locations: {
      'WH/Main': 60,
      'Production Floor': 40,
      'WH/Stock1': 0
    },
    totalStock: 100,
    unitPrice: 45.0
  },
  {
    id: 'prod-2',
    name: 'Ergonomic Office Chair',
    sku: 'FURN-CHR-08',
    category: 'Furniture',
    uom: 'units',
    minReorder: 15,
    maxReorder: 100,
    locations: {
      'WH/Main': 25,
      'WH/Stock1': 10
    },
    totalStock: 35,
    unitPrice: 120.0
  },
  {
    id: 'prod-3',
    name: 'Aluminum Sheet 2mm',
    sku: 'ALU-SH-002',
    category: 'Raw Materials',
    uom: 'kg',
    minReorder: 20,
    maxReorder: 150,
    locations: {
      'WH/Main': 8,
      'Rack A': 4
    },
    totalStock: 12,
    unitPrice: 85.0
  },
  {
    id: 'prod-4',
    name: 'Microcontroller Unit V2',
    sku: 'ELEC-MCU-99',
    category: 'Components',
    uom: 'pcs',
    minReorder: 50,
    maxReorder: 500,
    locations: {
      'WH/Main': 120,
      'Rack B': 80
    },
    totalStock: 200,
    unitPrice: 15.5
  },
  {
    id: 'prod-5',
    name: 'Industrial Bolts 10mm',
    sku: 'HARD-BLT-10',
    category: 'Hardware',
    uom: 'boxes',
    minReorder: 10,
    maxReorder: 80,
    locations: {
      'WH/Stock1': 5
    },
    totalStock: 5,
    unitPrice: 22.0
  }
];

const initialWarehouses = [
  { id: 'wh-1', code: 'WH/Main', name: 'Main Distribution Center', manager: 'Raghul S', capacity: 10000, active: true },
  { id: 'wh-2', code: 'WH/Stock1', name: 'Stock Storage Alpha', manager: 'Sarah Chen', capacity: 5000, active: true },
  { id: 'wh-3', code: 'WH/Prod', name: 'Production Floor', manager: 'Alex Rivera', capacity: 3000, active: true },
  { id: 'wh-4', code: 'WH/RackA', name: 'Rack A - Raw Storage', manager: 'Sarah Chen', capacity: 1500, active: true },
  { id: 'wh-5', code: 'WH/RackB', name: 'Rack B - Component Bay', manager: 'Alex Rivera', capacity: 1500, active: true }
];

const initialOperations = [
  {
    id: 'op-1',
    ref: 'WH/IN/0001',
    type: 'Receipt',
    from: 'Vendor - Apex Steel Inc.',
    to: 'WH/Main',
    contact: 'Apex Steel Inc.',
    scheduledDate: '2026-09-26',
    status: 'Ready',
    items: [{ productId: 'prod-1', productName: 'Steel Rods', qty: 50, uom: 'kg' }],
    notes: 'Incoming raw material shipment'
  },
  {
    id: 'op-2',
    ref: 'WH/OUT/0001',
    type: 'Delivery',
    from: 'WH/Stock1',
    to: 'Customer - Azure Interior',
    contact: 'Azure Interior',
    scheduledDate: '2026-09-26',
    status: 'Ready',
    items: [{ productId: 'prod-2', productName: 'Ergonomic Office Chair', qty: 10, uom: 'units' }],
    notes: 'Urgent office furniture delivery'
  },
  {
    id: 'op-3',
    ref: 'WH/OUT/0002',
    type: 'Delivery',
    from: 'WH/Stock1',
    to: 'Customer - Azure Interior',
    contact: 'Azure Interior',
    scheduledDate: '2026-09-27',
    status: 'Waiting',
    items: [{ productId: 'prod-2', productName: 'Ergonomic Office Chair', qty: 5, uom: 'units' }],
    notes: 'Second installment shipment'
  },
  {
    id: 'op-4',
    ref: 'WH/INT/0001',
    type: 'Internal',
    from: 'WH/Main',
    to: 'Production Floor',
    contact: 'Internal Operation',
    scheduledDate: '2026-09-26',
    status: 'Ready',
    items: [{ productId: 'prod-1', productName: 'Steel Rods', qty: 20, uom: 'kg' }],
    notes: 'Transfer raw steel to production rack'
  },
  {
    id: 'op-5',
    ref: 'WH/ADJ/0001',
    type: 'Adjustment',
    from: 'WH/Main',
    to: 'Inventory Difference',
    contact: 'Quality Check Team',
    scheduledDate: '2026-09-25',
    status: 'Done',
    items: [{ productId: 'prod-3', productName: 'Aluminum Sheet 2mm', qty: -2, uom: 'kg' }],
    notes: 'Damaged material written off during count'
  }
];

const initialMoveHistory = [
  {
    id: 'm-1',
    ref: 'WH/IN/0000',
    date: '2026-09-24 14:30',
    type: 'Receipt',
    productName: 'Steel Rods',
    sku: 'STL-RD-001',
    qty: 100,
    uom: 'kg',
    from: 'Vendor - Apex Steel',
    to: 'WH/Main',
    user: 'Raghul S'
  },
  {
    id: 'm-2',
    ref: 'WH/INT/0000',
    date: '2026-09-25 09:15',
    type: 'Internal Transfer',
    productName: 'Steel Rods',
    sku: 'STL-RD-001',
    qty: 40,
    uom: 'kg',
    from: 'WH/Main',
    to: 'Production Floor',
    user: 'Alex Rivera'
  }
];

export const InventoryProvider = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState(initialRegisteredUsers);
  const [products, setProducts] = useState(initialProducts);
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [operations, setOperations] = useState(initialOperations);
  const [moveHistory, setMoveHistory] = useState(initialMoveHistory);
  
  // Current logged in user state
  const [currentUser, setCurrentUser] = useState({
    name: 'Raghul S (Manager)',
    email: 'manager@stocksense.io',
    role: 'Inventory Manager',
    assignedWarehouse: 'All Warehouses',
    permissions: ['Full Access', 'Create Products', 'Reorder Rules', 'Add Warehouses', 'CSV Export', 'AI Copilot'],
    avatar: 'RM',
    isLoggedIn: true
  });

  // Global filters
  const [filters, setFilters] = useState({
    docType: 'All',
    status: 'All',
    warehouse: 'All',
    category: 'All',
    searchQuery: ''
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Register New User in Database
  const registerNewAccount = (userData) => {
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      addToast(`Account with email ${userData.email} already exists! Please Sign In.`, 'error');
      return false;
    }

    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
      avatar: userData.name.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U'
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    addToast(`Account created for ${newUser.name} (${newUser.role})! You can now log in.`, 'success');
    return newUser;
  };

  // Authenticate User with strict Email, Password, and Role matching
  const authenticateUser = (email, password, requiredRole) => {
    const user = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      addToast(`Account with email "${email}" not found! Please Create Account first.`, 'error');
      return { success: false, reason: 'not_found' };
    }

    if (user.password !== password) {
      addToast(`Invalid password for ${email}! Please check your credentials.`, 'error');
      return { success: false, reason: 'invalid_password' };
    }

    if (user.role !== requiredRole) {
      addToast(`Role Mismatch! Account "${user.email}" is registered as "${user.role}". Please switch to the ${user.role} login tab!`, 'error');
      return { success: false, reason: 'role_mismatch', actualRole: user.role };
    }

    const isManager = user.role === 'Inventory Manager';
    const loggedUser = {
      ...user,
      permissions: isManager 
        ? ['Full Access', 'Create Products', 'Reorder Rules', 'Add Warehouses', 'CSV Export', 'AI Copilot'] 
        : ['Pick & Pack', 'Scan Barcodes', 'Physical Count', 'Validate Operations'],
      isLoggedIn: true
    };

    setCurrentUser(loggedUser);
    addToast(`Welcome back ${user.name}! Logged in as ${user.role}.`, 'success');
    return { success: true, user: loggedUser };
  };

  // Helper: Create/Update Product
  const saveProduct = (productData) => {
    if (productData.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? { ...p, ...productData } : p))
      );
      addToast(`Product ${productData.name} updated successfully!`);
    } else {
      const newProd = {
        ...productData,
        id: `prod-${Date.now()}`,
        locations: productData.locations || { 'WH/Main': Number(productData.initialStock || 0) },
        totalStock: Number(productData.initialStock || 0)
      };
      setProducts((prev) => [newProd, ...prev]);
      addToast(`New product ${newProd.name} created!`);
    }
  };

  // Helper: Create Operation
  const createOperation = (opData) => {
    const newRefNumber = Math.floor(1000 + Math.random() * 9000);
    let prefix = 'WH/IN/';
    if (opData.type === 'Delivery') prefix = 'WH/OUT/';
    if (opData.type === 'Internal') prefix = 'WH/INT/';
    if (opData.type === 'Adjustment') prefix = 'WH/ADJ/';

    const newOp = {
      ...opData,
      id: `op-${Date.now()}`,
      ref: opData.ref || `${prefix}${newRefNumber}`,
      status: opData.status || 'Ready',
      scheduledDate: opData.scheduledDate || new Date().toISOString().split('T')[0]
    };

    setOperations((prev) => [newOp, ...prev]);
    addToast(`Operation ${newOp.ref} (${newOp.type}) created!`);
    return newOp;
  };

  // Helper: Update Operation Status & Stock Logic
  const updateOperationStatus = (opId, newStatus) => {
    const op = operations.find((o) => o.id === opId);
    if (!op) return;

    if (newStatus === 'Done' && op.status !== 'Done') {
      op.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId || p.name === item.productName);
        if (!prod) return;

        const qty = Number(item.qty);
        let updatedLocations = { ...prod.locations };
        let newTotal = prod.totalStock;

        if (op.type === 'Receipt') {
          const loc = op.to || 'WH/Main';
          updatedLocations[loc] = (updatedLocations[loc] || 0) + qty;
          newTotal += qty;
        } else if (op.type === 'Delivery') {
          const loc = op.from || 'WH/Main';
          updatedLocations[loc] = Math.max(0, (updatedLocations[loc] || 0) - qty);
          newTotal = Math.max(0, newTotal - qty);
        } else if (op.type === 'Internal') {
          const fromLoc = op.from;
          const toLoc = op.to;
          updatedLocations[fromLoc] = Math.max(0, (updatedLocations[fromLoc] || 0) - qty);
          updatedLocations[toLoc] = (updatedLocations[toLoc] || 0) + qty;
        } else if (op.type === 'Adjustment') {
          const loc = op.from || 'WH/Main';
          if (op.isPhysicalCount) {
            const diff = qty - (updatedLocations[loc] || 0);
            updatedLocations[loc] = qty;
            newTotal += diff;
          } else {
            updatedLocations[loc] = (updatedLocations[loc] || 0) + qty;
            newTotal += qty;
          }
        }

        setProducts((prev) =>
          prev.map((p) =>
            p.id === prod.id
              ? { ...p, locations: updatedLocations, totalStock: Math.max(0, newTotal) }
              : p
          )
        );

        const ledgerEntry = {
          id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          ref: op.ref,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: op.type,
          productName: prod.name,
          sku: prod.sku,
          qty: op.type === 'Delivery' || (op.type === 'Adjustment' && qty < 0) ? -Math.abs(qty) : Math.abs(qty),
          uom: item.uom || prod.uom,
          from: op.from,
          to: op.to,
          user: currentUser.name
        };

        setMoveHistory((prev) => [ledgerEntry, ...prev]);
      });

      addToast(`Operation ${op.ref} validated & stock updated!`);
    }

    setOperations((prev) =>
      prev.map((o) => (o.id === opId ? { ...o, status: newStatus } : o))
    );
  };

  // Helper: Perform Physical Stock Adjustment
  const processStockAdjustment = (productId, location, countedQty, reason) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const currentQty = prod.locations[location] || 0;
    const diff = countedQty - currentQty;

    const opRef = `WH/ADJ/${Math.floor(1000 + Math.random() * 9000)}`;

    const newOp = {
      id: `op-${Date.now()}`,
      ref: opRef,
      type: 'Adjustment',
      from: location,
      to: 'Inventory Difference',
      contact: 'Stock Audit',
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'Done',
      items: [{ productId: prod.id, productName: prod.name, qty: diff, uom: prod.uom }],
      notes: reason || 'Physical count adjustment'
    };

    setOperations((prev) => [newOp, ...prev]);

    const updatedLocations = { ...prod.locations, [location]: countedQty };
    const newTotal = Object.values(updatedLocations).reduce((a, b) => a + b, 0);

    setProducts((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, locations: updatedLocations, totalStock: newTotal } : p))
    );

    const ledgerEntry = {
      id: `m-${Date.now()}`,
      ref: opRef,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'Adjustment',
      productName: prod.name,
      sku: prod.sku,
      qty: diff,
      uom: prod.uom,
      from: location,
      to: 'Inventory Difference',
      user: currentUser.name
    };

    setMoveHistory((prev) => [ledgerEntry, ...prev]);
    addToast(`Adjusted ${prod.name} in ${location} to ${countedQty} ${prod.uom} (Diff: ${diff > 0 ? '+' : ''}${diff})`);
  };

  // Add new Warehouse
  const addWarehouse = (whData) => {
    const newWh = {
      ...whData,
      id: `wh-${Date.now()}`,
      active: true
    };
    setWarehouses((prev) => [...prev, newWh]);
    addToast(`Warehouse ${newWh.name} added!`);
  };

  return (
    <InventoryContext.Provider
      value={{
        registeredUsers,
        registerNewAccount,
        authenticateUser,
        products,
        warehouses,
        operations,
        moveHistory,
        currentUser,
        setCurrentUser,
        filters,
        setFilters,
        toasts,
        addToast,
        saveProduct,
        createOperation,
        updateOperationStatus,
        processStockAdjustment,
        addWarehouse
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
