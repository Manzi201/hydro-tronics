"use client";

import { 
  BarChart3, 
  Package, 
  Users, 
  Bell, 
  Search, 
  Plus, 
  Trash2, 
  LogOut, 
  Edit,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  image_url: string;
  category: string;
  stock_quantity: number;
  created_at?: string;
}

interface Consultation {
  id: string;
  client_name: string;
  project_type: string;
  created_at: string;
  status: string;
  email: string;
  message: string;
  product_id?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
    image_url: "",
    category: "Plumbing",
    stock_quantity: 0
  });
  
  // Auth Check
  useEffect(() => {
    const isAuth = localStorage.getItem("isAdminAuthenticated");
    if (isAuth !== "true") {
      router.push("/admin/login");
    }
    fetchProducts();
    fetchConsultations();
  }, [router]);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
  }

  async function fetchConsultations() {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setConsultations(data);
  }

  const stats = {
    total: consultations.length,
    new: consultations.filter(c => c.status === "Pending").length,
    completed: consultations.filter(c => c.status === "Completed").length
  };

  async function uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      let finalImageUrl = newProduct.image_url;

      // Handle file upload if present
      const fileInput = document.getElementById('product-file') as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        finalImageUrl = await uploadImage(fileInput.files[0]);
      }

      if (isEditing && editId) {
        const { error } = await supabase
          .from('products')
          .update({ ...newProduct, image_url: finalImageUrl || newProduct.image_url })
          .eq('id', editId);
        
        if (error) throw error;
        alert("Product updated successfully!");
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{ ...newProduct, image_url: finalImageUrl }]);
        
        if (error) throw error;
        alert("Product added successfully!");
      }

      setNewProduct({ title: "", price: "", description: "", image_url: "", category: "Plumbing", stock_quantity: 0 });
      setIsEditing(false);
      setEditId(null);
      if (fileInput) fileInput.value = "";
      fetchProducts();
    } catch (err: unknown) {
      console.error("Save error details:", err);
      let message = "An unknown error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (err && typeof err === 'object' && 'message' in err) {
        message = String((err as { message: unknown }).message);
      } else {
        message = typeof err === 'object' ? JSON.stringify(err) : String(err);
      }
      alert("Error saving product: " + message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting product: " + error.message);
    } else {
      fetchProducts();
    }
  }

  function handleLogout() {
    localStorage.removeItem("isAdminAuthenticated");
    router.push("/admin/login");
  }

  const pendingCount = consultations.filter(c => c.status === "Pending").length;

  function handleEditProduct(product: Product) {
    setNewProduct({
      title: product.title,
      price: product.price,
      description: product.description,
      image_url: product.image_url,
      category: product.category || "Plumbing",
      stock_quantity: product.stock_quantity || 0
    });
    setEditId(product.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleUpdateStatus(id: string, newStatus: string) {
    // 1. Update Consultation Status
    const { error } = await supabase
      .from('consultations')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("Error updating status: " + error.message);
      return;
    }

    // 2. If Completed, deduct stock
    if (newStatus === "Completed") {
      const consultation = consultations.find(c => c.id === id);
      if (consultation?.product_id) {
        // Fetch current stock
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', consultation.product_id)
          .single();

        if (product && product.stock_quantity > 0) {
          await supabase
            .from('products')
            .update({ stock_quantity: product.stock_quantity - 1 })
            .eq('id', consultation.product_id);
          
          fetchProducts(); // Refresh products list
        }
      }
    }
    
    fetchConsultations();
  }

  async function trackOrder(title: string, price: string) {
    await supabase.from('consultations').insert([{
      client_name: "WhatsApp Client",
      email: "whatsapp-inquiry@hydro-tronics.com",
      project_type: "WhatsApp Order",
      message: `Ordered: ${title} (${price})`,
      status: "Pending"
    }]);
    fetchConsultations();
  }

  async function handleDeleteConsultation(id: string) {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting inquiry: " + error.message);
    } else {
      fetchConsultations();
    }
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <Logo size={32} />
          <span>Rwanda Water Resources</span>
        </div>
        <nav className="side-nav">
          <button 
            className={activeTab === "dashboard" ? "active" : ""} 
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart3 size={20} /> Dashboard
          </button>
          <button 
            className={activeTab === "products" ? "active" : ""} 
            onClick={() => setActiveTab("products")}
          >
            <Package size={20} /> Products
          </button>
          <button 
            className={activeTab === "consultations" ? "active" : ""} 
            onClick={() => setActiveTab("consultations")}
          >
            <Users size={20} /> Orders/Inquiries
            {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
          </button>
          <button className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>
            <Bell size={20} /> Notifications
            {pendingCount > 0 && <span className="nav-badge pulse">{pendingCount}</span>}
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="admin-watermark" aria-hidden="true">
          <Logo size={800} />
        </div>
        <header className="top-bar">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder={`Search ${activeTab}...`} />
          </div>
          <div className="user-profile">
            <div className="avatar">RWR</div>
            <span>Rwanda Water Resources</span>
          </div>
        </header>

        {activeTab === "dashboard" ? (
          <>
            <section className="stats">
              <div className="stat-card">
                <div className="icon blue"><Clock size={24} /></div>
                <div>
                  <p>Requested</p>
                  <h3>{stats.total}</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="icon orange"><Users size={24} /></div>
                <div>
                  <p>New Leads</p>
                  <h3>{stats.new}</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="icon green"><CheckCircle2 size={24} /></div>
                <div>
                  <p>Completed</p>
                  <h3>{stats.completed}</h3>
                </div>
              </div>
            </section>

            <section className="consultation-list glass">
              <div className="list-header">
                <h3>Recent Consultation Requests ({consultations.length})</h3>
                <button className="btn-text">View All</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map(c => (
                    <tr key={c.id}>
                      <td>#{c.id.substring(0, 4)}</td>
                      <td className="font-bold">{c.client_name}</td>
                      <td>{c.project_type}</td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                      <td><span className={`status-pill ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span></td>
                      <td><ChevronRight size={18} className="text-light" /></td>
                    </tr>
                  ))}
                  {consultations.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                        No consultation requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        ) : activeTab === "products" ? (
          <div className="products-view">
            <section className="add-product-card glass">
              <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
              <form onSubmit={handleAddProduct}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="product-title">Product Name</label>
                    <input 
                      type="text" 
                      id="product-title"
                      value={newProduct.title} 
                      onChange={e => setNewProduct({...newProduct, title: e.target.value})} 
                      placeholder="e.g. Smart Controller"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="product-price">Price (e.g. 50,000 RWF)</label>
                    <input 
                      type="text" 
                      id="product-price"
                      value={newProduct.price} 
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                      placeholder="Price"
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-grid mt-4">
                  <div className="form-group">
                    <label htmlFor="product-category">Category</label>
                    <select 
                      id="product-category"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      title="Product Category"
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Irrigation">Irrigation</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="product-stock">Stock Quantity</label>
                    <input 
                      type="number" 
                      id="product-stock"
                      value={newProduct.stock_quantity}
                      onChange={e => setNewProduct({...newProduct, stock_quantity: parseInt(e.target.value) || 0})}
                      placeholder="e.g. 50"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid mt-4">
                  <div className="form-group">
                    <label htmlFor="product-file">Product Image {isEditing && "(Leave empty to keep current)"}</label>
                    <input type="file" id="product-file" accept="image/*" />
                  </div>
                </div>

                <div className="form-grid mt-4">
                  <div className="form-group full-width">
                    <label htmlFor="product-description">Description</label>
                    <textarea 
                      id="product-description"
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Enter detailed description..." 
                      rows={4}
                      required
                      title="Product Description"
                    ></textarea>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                    {loading ? "Saving..." : (isEditing ? "Update Product" : "Add Product")}
                  </button>
                  {isEditing && (
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditId(null);
                        setNewProduct({ title: "", price: "", description: "", image_url: "", category: "Plumbing", stock_quantity: 0 });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="product-list-card glass mt-8">
              <h3>Product Inventory</h3>
              <div className="admin-product-list">
                {products.map(p => (
                  <div key={p.id} className="admin-product-item">
                    <div className="product-img">
                      <Image 
                        src={p.image_url || "/placeholder.png"} 
                        alt={p.title} 
                        width={60} 
                        height={60} 
                        unoptimized
                      />
                    </div>
                    <div className="product-info-admin">
                      <h4>{p.title}</h4>
                      <p>{p.category} • {p.price}</p>
                      <p className="stock-badge">Stock: {p.stock_quantity || 0}</p>
                    </div>
                    <div className="product-actions">
                      <button 
                        onClick={() => handleEditProduct(p)} 
                        className="edit-btn"
                        aria-label="Edit product"
                        title="Edit product"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)} 
                        className="delete-btn"
                        aria-label="Delete product"
                        title="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : activeTab === "notifications" ? (
          <div className="notifications-view">
            <section className="notifications-card glass">
              <h3>System Notifications</h3>
              <div className="notification-list">
                {consultations.filter(c => c.status === "Pending").map(c => (
                  <div key={c.id} className="notification-item unread">
                    <div className="icon-box pulse">
                      <Bell size={20} />
                    </div>
                    <div className="notif-content">
                      <p>New <strong>{c.project_type}</strong> inquiry from <strong>{c.client_name}</strong></p>
                      <span className="notif-time">{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <button className="btn btn-text" onClick={() => setActiveTab("consultations")}>View</button>
                  </div>
                ))}
                {pendingCount === 0 && (
                  <div className="empty-notif">
                    <Bell size={48} className="mb-4 opacity-20" />
                    <p>No new notifications. All clear! ✨</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="consultations-view">
            <section className="consultation-list glass">
              <div className="list-header">
                <h3>Customer Orders & Inquiries ({consultations.length})</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map(c => (
                    <tr key={c.id}>
                      <td className="font-bold">
                        <div className="flex items-center gap-2">
                          {c.project_type === "WhatsApp Order" && <span className="wa-icon">WA</span>}
                          {c.client_name}
                        </div>
                      </td>
                      <td>{c.email}</td>
                      <td>
                        <span className={`type-tag ${c.project_type === "WhatsApp Order" ? "wa" : "form"}`}>
                          {c.project_type}
                        </span>
                      </td>
                      <td className="msg-cell" title={c.message}>{c.message.substring(0, 30)}...</td>
                      <td>
                        <select 
                          className={`status-select ${c.status.toLowerCase()}`}
                          value={c.status}
                          onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                          title="Change Status"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteConsultation(c.id)}
                          title="Delete inquiry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background: var(--bg-main);
          font-family: inherit;
          color: var(--text-dark);
        }
        .sidebar {
          width: 280px;
          background: #001a33;
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4rem;
        }
        .side-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .side-nav button {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          color: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          transition: all 0.3s;
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          font-size: 1rem;
        }
        .side-nav button.active, .side-nav button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .main-content {
          flex: 1;
          padding: 2.5rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
          position: relative;
        }
        .admin-watermark {
          position: fixed;
          top: 50%;
          left: 55%; 
          transform: translate(-50%, -50%);
          opacity: 0.05;
          pointer-events: none;
          z-index: -1;
          filter: blur(2px) saturate(0.5);
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 10;
        }
        .search-bar {
          background: var(--card-bg);
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          width: 400px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
        }
        .search-bar input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.9rem;
          background: transparent;
          color: var(--text-dark);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
        }
        .avatar {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
        }
        .icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon.blue { background: rgba(0, 74, 153, 0.1); color: var(--primary); }
        .icon.orange { background: rgba(255, 152, 0, 0.1); color: #ff9800; }
        .icon.green { background: rgba(76, 175, 80, 0.1); color: #4caf50; }
        .stat-card h3 { font-size: 1.8rem; }
        .stat-card p { font-size: 0.9rem; margin-bottom: 0.2rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: #666; }
        .form-group input, .form-group select, .form-group textarea {
          padding: 0.8rem;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          font-family: inherit;
          background: var(--bg-main);
          color: var(--text-dark);
        }
        .status-select {
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          border: none;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .status-select.pending { background: #fff7ed; color: #c2410c; }
        .status-select.in-progress { background: #eff6ff; color: #1d4ed8; }
        .status-select.completed { background: #f0fdf4; color: #15803d; }
        .msg-cell { max-width: 200px; color: var(--text-light); }
        .admin-product-list { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .admin-product-item { background: #f8faff; padding: 1rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem; }
        .product-img { width: 50px; height: 50px; background: #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .product-img img { width: 100%; height: 100%; object-fit: cover; }
        .product-info-admin { flex: 1; }
        .product-info-admin h4 { margin: 0; font-size: 1rem; }
        .product-info-admin p { margin: 0; font-size: 0.8rem; }
        .wa-icon {
          background: #25d366;
          color: white;
          font-size: 0.6rem;
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 900;
        }
        .type-tag {
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .type-tag.wa {
          background: #e1faea;
          color: #128c7e;
        }
        .type-tag.form {
          background: #f0f4f8;
          color: #334e68;
        }
        .product-actions { display: flex; gap: 0.5rem; }
        .edit-btn, .delete-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .edit-btn { background: rgba(0, 74, 153, 0.1); color: var(--primary); }
        .edit-btn:hover { background: var(--primary); color: white; }
        .delete-btn { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
        .delete-btn:hover { background: #dc2626; color: white; }
        .consultation-list, .add-product-card, .product-list-card, .notifications-card {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 32px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
        }
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .btn-text { background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1rem; color: var(--text-light); font-size: 0.9rem; border-bottom: 1px solid var(--border-color); }
        td { padding: 1.2rem 1rem; border-bottom: 1px solid var(--border-color); font-size: 0.95rem; color: var(--text-dark); }
        .font-bold { font-weight: 700; }
        .status-pill { padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; }
        .status-pill.pending { background: #fff3e0; color: #ff9800; }
        .status-pill.completed { background: #e8f5e9; color: #4caf50; }
        .status-pill.in-progress { background: #e3f2fd; color: #2196f3; }
        .text-light { color: #ccc; }
        .nav-badge { background: #ef4444; color: white; font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; margin-left: auto; font-weight: 700; }
        .nav-badge.pulse { animation: pulseIcon 2s infinite; }
        @keyframes pulseIcon {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .sidebar-footer {
          margin-top: auto;
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background: #fecaca;
        }
        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .notification-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          border-radius: 16px;
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .notification-item.unread {
          border-left: 4px solid #ef4444;
          background: #fffcfc;
        }
        .icon-box {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          background: #fee2e2;
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .notif-content {
          flex: 1;
        }
        .notif-time {
          font-size: 0.85rem;
          color: #888;
          display: block;
          margin-top: 0.25rem;
        }
        .empty-notif {
          text-align: center;
          padding: 4rem 2rem;
          color: #888;
        }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .stock-badge {
          background: rgba(255,255,255,0.1);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #60a5fa;
          display: inline-block;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

