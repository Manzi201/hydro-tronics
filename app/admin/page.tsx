"use client";

export const dynamic = "force-dynamic";

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
  products?: {
    image_url: string;
    title: string;
  }
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
    
    if (error) console.error("Error fetching products:", error);
    if (data) setProducts(data);
  }

  async function fetchConsultations() {
    const { data, error } = await supabase
      .from('consultations')
      .select('*, products(image_url, title)')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching consultations:", error);
    if (data) setConsultations(data as unknown as Consultation[]);
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
          <span>Hydro-Tronics</span>
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
            <div className="avatar">HT</div>
            <span>Hydro-Tronics Eng</span>
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
                      <td className="font-bold">
                        <div className="flex items-center gap-2">
                           {c.products?.image_url && (
                             <Image 
                               src={c.products.image_url} 
                               alt="" 
                               className="mini-thumb" 
                               width={38} 
                               height={38} 
                             />
                           )}
                           {c.client_name}
                        </div>
                      </td>
                      <td>{c.project_type}</td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                      <td><span className={`status-pill ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span></td>
                      <td><ChevronRight size={18} className="text-light" /></td>
                    </tr>
                  ))}
                  {consultations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-cell">
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
                          {c.products?.image_url && (
                            <Image 
                              src={c.products.image_url} 
                              alt="" 
                              className="mini-thumb" 
                              width={38} 
                              height={38} 
                            />
                          )}
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
        :root {
          --glass-bg: rgba(255, 255, 255, 0.8);
          --glass-border: rgba(0, 0, 0, 0.08);
          --accent-blue: #2563eb;
          --accent-cyan: #0891b2;
          --text-main: #1e293b;
          --text-dim: #64748b;
          --danger: #ef4444;
          --success: #10b981;
          --warning: #f59e0b;
          --sidebar-bg: #ffffff;
        }
        .mini-thumb {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .admin-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          background-image: radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.05), transparent 25%),
                            radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.05), transparent 25%);
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--text-main);
          position: relative;
          overflow: hidden;
        }
        .sidebar {
          width: 280px;
          background: #ffffff;
          border-right: 1px solid #f1f5f9;
          color: #1e293b;
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 20;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.02);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 3.5rem;
          color: var(--accent-blue);
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
          padding: 1rem 1.25rem;
          color: #64748b;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
          border: none;
          width: 100%;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .side-nav button:hover {
          color: var(--accent-blue);
          background: #f8fafc;
          transform: translateX(5px);
        }
        .side-nav button.active {
          background: #eff6ff;
          color: var(--accent-blue);
          box-shadow: inset 4px 0 0 var(--accent-blue);
        }
        .main-content {
          flex: 1;
          padding: 2.5rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 10;
          overflow-y: auto;
        }
        .admin-watermark {
          position: fixed;
          top: 50%;
          left: 55%; 
          transform: translate(-50%, -50%);
          opacity: 0.1;
          pointer-events: none;
          z-index: -1;
          filter: blur(8px);
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }
        .search-bar {
          background: white;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          width: 400px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }
        .search-bar:focus-within {
          border-color: var(--accent-blue);
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.1);
          width: 450px;
        }
        .search-bar input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
          background: transparent;
          color: var(--text-main);
        }
        .search-bar input::placeholder {
          color: var(--text-dim);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
          background: white;
          padding: 0.5rem 1rem 0.5rem 0.5rem;
          border-radius: 50px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          background: white;
          padding: 2.25rem;
          border-radius: 32px;
          display: flex;
          align-items: center;
          gap: 2rem;
          border: 1px solid #f1f5f9;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
        }
        .stat-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.07);
          border-color: rgba(var(--primary-rgb), 0.2);
        }
        .icon {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .icon.blue { background: #eff6ff; color: #2563eb; }
        .icon.orange { background: #fff7ed; color: #d97706; }
        .icon.green { background: #f0fdf4; color: #059669; }
        .stat-card h3 { font-size: 2.2rem; font-weight: 800; margin: 0; }
        .stat-card p { font-size: 0.95rem; margin-bottom: 0.2rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px; }
        .form-group input, .form-group select, .form-group textarea {
          padding: 1rem 1.25rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-family: inherit;
          background: white;
          color: var(--text-main);
          transition: all 0.3s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: var(--accent-blue);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05);
          background: white;
        }
        .status-select {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          border: 1px solid #e2e8f0;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          background: white;
          color: var(--text-main);
          outline: none;
        }
        .status-select.pending { color: var(--warning); border-color: #fef3c7; background: #fffcf0; }
        .status-select.in-progress { color: var(--accent-cyan); border-color: #e0f7fa; background: #f0fdff; }
        .status-select.completed { color: var(--success); border-color: #dcfce7; background: #f0fdf4; }
        .status-select option { background: white; color: var(--text-main); }
        .msg-cell { max-width: 250px; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .admin-product-list { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .admin-product-item {
          background: white;
          padding: 1.25rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .admin-product-item:hover {
          transform: translateX(8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.06);
          border-color: var(--accent-blue);
        }
        .product-img { 
          width: 72px; 
          height: 72px; 
          background: #f8fafc; 
          border-radius: 16px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          overflow: hidden; 
          border: 1px solid #eee;
        }
        .product-img img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
        .product-info-admin { flex: 1; }
        .product-info-admin h4 { margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 600; }
        .product-info-admin p { margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--text-dim); }
        .wa-icon {
          background: #25d366;
          color: white;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 900;
          box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
        }
        .type-tag {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .type-tag.wa { background: rgba(37, 211, 102, 0.15); color: #4ade80; border: 1px solid rgba(37, 211, 102, 0.2); }
        .type-tag.form { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
        .product-actions { display: flex; gap: 0.75rem; }
        .edit-btn, .delete-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid transparent;
        }
        .edit-btn { background: rgba(59, 130, 246, 0.1); color: var(--accent-blue); }
        .edit-btn:hover { background: var(--accent-blue); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
        .delete-btn { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .delete-btn:hover { background: var(--danger); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239,68,68,0.3); }
        .glass {
          background: white;
          padding: 2.5rem;
          border-radius: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
          border: 1px solid #f1f5f9;
          color: var(--text-main);
        }
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .list-header h3 { font-size: 1.4rem; font-weight: 700; }
        .btn-text { background: none; border: none; color: var(--accent-blue); font-weight: 700; cursor: pointer; transition: color 0.3s; }
        .btn-text:hover { color: #60a5fa; }
        table { width: 100%; border-collapse: separate; border-spacing: 0; }
        th { text-align: left; padding: 1.25rem 1rem; color: var(--text-dim); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--glass-border); }
        td { padding: 1.25rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; }
        tr:hover td { background: #f8fafc; }
        .status-pill { padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.5px; border: 1px solid transparent; }
        .status-pill.pending { background: rgba(245, 158, 11, 0.1); color: var(--warning); border-color: rgba(245,158,11,0.2); }
        .status-pill.completed { background: rgba(16, 185, 129, 0.1); color: var(--success); border-color: rgba(16,185,129,0.2); }
        .status-pill.in-progress { background: rgba(6, 182, 212, 0.1); color: var(--accent-cyan); border-color: rgba(6,182,212,0.2); }
        .nav-badge { background: var(--danger); color: white; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; margin-left: auto; font-weight: 800; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
        .nav-badge.pulse { animation: pulseIcon 2s infinite; }
        @keyframes pulseIcon {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .sidebar-footer {
          margin-top: auto;
          padding: 1.5rem 0 0;
          border-top: 1px solid var(--glass-border);
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .logout-btn:hover {
          background: var(--danger);
          color: white;
          box-shadow: 0 4px 15px rgba(239,68,68,0.4);
        }
        .notification-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .notification-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          border-radius: 20px;
          background: white;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
        }
        .notification-item:hover { transform: translateX(5px); background: #f8fafc; }
        .notification-item.unread { border-left: 4px solid var(--danger); background: rgba(239,68,68,0.05); }
        .icon-box { width: 48px; height: 48px; border-radius: 14px; background: rgba(239,68,68,0.15); color: var(--danger); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(239,68,68,0.2); box-shadow: 0 0 15px rgba(239,68,68,0.2); }
        .notif-content { flex: 1; }
        .notif-time { font-size: 0.85rem; color: var(--text-dim); display: block; margin-top: 0.4rem; }
        .empty-notif { text-align: center; padding: 5rem 2rem; color: var(--text-dim); }
        .empty-cell { text-align: center; padding: 2rem; color: var(--text-dim); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .stock-badge { 
          background: #eff6ff; 
          padding: 6px 14px; 
          border-radius: 50px; 
          font-size: 0.75rem; 
          color: #2563eb; 
          display: inline-block; 
          margin-top: 8px; 
          font-weight: 700; 
          border: 1px solid #dbeafe; 
        }
        .btn-primary { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border: none; border-radius: 12px; padding: 1rem; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(37,99,235,0.4); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37,99,235,0.5); }
        .btn-outline { background: white; color: var(--text-main); border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .btn-outline:hover { background: #f8fafc; border-color: #cbd5e1; }

        /* ===== ADMIN RESPONSIVE REFINED ===== */
        @media (max-width: 1100px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
          .search-bar { width: 300px; }
        }

        @media (max-width: 900px) {
          .admin-container { flex-direction: column; }
          .sidebar { 
            width: 100%; 
            height: auto;
            flex-direction: column; 
            padding: 1.5rem; 
            border-right: none; 
            border-bottom: 1px solid #f1f5f9; 
            position: sticky;
            top: 0;
            background: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          }
          .brand { margin-bottom: 2rem; justify-content: center; }
          .side-nav { 
            flex-direction: row; 
            overflow-x: auto; 
            padding-bottom: 0.5rem; 
            gap: 0.5rem;
            scrollbar-width: none;
          }
          .side-nav::-webkit-scrollbar { display: none; }
          .side-nav button { 
            padding: 0.75rem 1.25rem; 
            width: auto; 
            white-space: nowrap; 
            font-size: 0.85rem; 
          }
          .side-nav button.active { 
            box-shadow: inset 0 -3px 0 var(--accent-blue);
          }
          .sidebar-footer { display: none; }
          .main-content { padding: 1.5rem; }
          .top-bar { flex-direction: column; gap: 1.5rem; margin-bottom: 2.5rem; }
          .search-bar { width: 100%; }
          .user-profile { align-self: flex-end; }
        }

        @media (max-width: 640px) {
          .stats { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .stat-card { padding: 1.5rem; gap: 1.25rem; }
          .stat-card h3 { font-size: 1.75rem; }
          .icon { width: 56px; height: 56px; }
          .glass { padding: 1.5rem; border-radius: 20px; }
          .list-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          table { display: block; overflow-x: auto; white-space: nowrap; }
          .admin-product-item { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .product-actions { width: 100%; justify-content: flex-end; }
          .product-img { width: 100%; height: 200px; } /* Mobile grid style */
        }
      `}</style>
    </div>
  );
}

