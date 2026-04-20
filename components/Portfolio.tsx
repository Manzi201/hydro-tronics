"use client";

import { ArrowRight, Box, ShoppingCart, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const works: ProjectItem[] = [
  {
    id: "w1",
    title: "Eco-Residential Hub",
    category: "Modern Plumbing",
    description: "Full-scale water management for a 20-unit sustainable housing project.",
    image_url: "/portfolio-1.png",
    price: "Project Consult"
  },
  {
    id: "w2",
    title: "Industrial Pressure Plant",
    category: "Engineering",
    description: "High-pressure valve and pipe synchronization for a chemical processing facility.",
    image_url: "/portfolio-2.png",
    price: "Project Consult"
  }
];

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  price: string;
  stock_quantity?: number;
}

export default function Portfolio() {
  const [products, setProducts] = useState<ProjectItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProjectItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 432; // Card width + gap
      const scrollTo = direction === "left" 
        ? scrollRef.current.scrollLeft - scrollAmount 
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const trackOrder = async (title: string, price: string, productId?: string) => {
    try {
      await supabase.from('consultations').insert([{
        client_name: "WhatsApp Client",
        email: "whatsapp-inquiry@hydro-tronics.com",
        project_type: "WhatsApp Order",
        message: `Ordered: ${title} (${price})`,
        product_id: productId,
        status: 'Pending'
      }]);
    } catch (err) {
      console.error("Tracking error:", err);
    }
  };

  useEffect(() => {
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      checkScroll();
    }
    return () => current?.removeEventListener('scroll', checkScroll);
  }, [products]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        const processed: ProjectItem[] = data.map(p => ({
          id: p.id,
          title: p.title || "Untitled Product",
          category: p.category || "General",
          description: p.description || "No description available",
          image_url: p.image_url || "/product-1.png",
          price: p.price || "Contact for price",
          stock_quantity: p.stock_quantity || 0
        }));
        setProducts(processed);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container">
        <div className="section-header">
          <span className="badge">Showcase</span>
          <h2>Our Recent <span className="text-primary">Works & Products</span></h2>
        </div>

        <h3 className="sub-title">Flagship Projects</h3>
        <div className="grid portfolio-grid">
          {works.map((item, i) => (
            <div key={i} className="card portfolio-card">
              <div className="card-image" style={{ '--bg-image': `url(${item.image_url})` } as React.CSSProperties}>
                <div className="card-overlay">
                  <span className="cat">{item.category}</span>
                </div>
              </div>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button 
                  onClick={() => setSelectedItem(item)} 
                  className="link-btn"
                >
                  View Details <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="sub-title mt-20">Premium Products</h3>
        <div className="carousel-container">
          {canScrollLeft && (
            <button className="carousel-btn left" onClick={() => scroll("left")} aria-label="Scroll left">
              <ChevronLeft size={30} />
            </button>
          )}
          
          <div className="product-grid" ref={scrollRef}>
            {products.map((item, i) => (
              <div key={i} className="card product-card-modern">
                <div className="card-top">
                  <span className="label">Frequently searched</span>
                  <h3>{item.title}</h3>
                </div>
                <div 
                  className="card-image-main"
                  style={{ 
                    '--product-image': `url(${item.image_url || '/product-1.png'})`
                  } as React.CSSProperties}
                ></div>
                <div className="card-footer">
                  <div className="price-info">
                    <span className="price">{item.price}</span>
                    {item.stock_quantity !== undefined && (
                      <span className={`stock-tag ${item.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {item.stock_quantity > 0 ? `${item.stock_quantity} in stock` : 'Out of Stock'}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-primary btn-sm" 
                      disabled={item.stock_quantity !== undefined && item.stock_quantity <= 0}
                      onClick={() => {
                        const origin = window.location.origin;
                        const fullImageUrl = item.image_url.startsWith('http') ? item.image_url : `${origin}${item.image_url}`;
                        trackOrder(item.title, item.price, item.id);
                        // Clean message format for better WhatsApp preview
                        const message = encodeURIComponent(`📸 *Product Photo:* ${fullImageUrl}\n\n*Product:* ${item.title}\n*Price:* ${item.price}\n\nHello Hydro-Tronics Eng, I'm interested in this product.`);
                        window.open(`https://wa.me/250780592673?text=${message}`, '_blank');
                      }}
                    >
                      {item.stock_quantity !== undefined && item.stock_quantity <= 0 ? 'Sold Out' : 'Order'}
                    </button>
                    <button className="btn btn-text btn-sm" onClick={() => setSelectedItem(item)}>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button className="carousel-btn right" onClick={() => scroll("right")} aria-label="Scroll right">
              <ChevronRight size={30} />
            </button>
          )}
        </div>

        {/* Details Modal */}
        {selectedItem && (
          <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
            <div className="modal-content glass" onClick={e => e.stopPropagation()}>
              <button 
                className="close-btn" 
                onClick={() => setSelectedItem(null)}
                aria-label="Close modal"
                title="Close"
              >
                <X size={24} />
              </button>
              <div className="modal-body">
                <div className="modal-image-container">
                    <div 
                      className="modal-image zoom-image" 
                      style={{ '--modal-bg': `url(${selectedItem.image_url})` } as React.CSSProperties}
                    ></div>
                </div>
                <div className="modal-text">
                  <span className="cat">{selectedItem.category}</span>
                  <h2>{selectedItem.title}</h2>
                    <div className="modal-meta-row">
                      {selectedItem.price && <span className="modal-price">{selectedItem.price}</span>}
                      {selectedItem.stock_quantity !== undefined && (
                        <span className={`stock-tag ${selectedItem.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {selectedItem.stock_quantity > 0 ? `${selectedItem.stock_quantity} available` : 'Out of Stock'}
                        </span>
                      )}
                    </div>
                  <p className="description">{selectedItem.description}</p>
                  
                  <div className="features">
                    <h4>Key Highlights</h4>
                    <ul>
                      <li>Premium Material Engineering</li>
                      <li>Standard Compliance (RSB/ISO)</li>
                      <li>Sustainable Water Management</li>
                    </ul>
                  </div>

                  <div className="modal-actions">
                    {selectedItem.price ? (
                      <>
                        <button 
                          className="btn btn-success" 
                          disabled={selectedItem.stock_quantity !== undefined && selectedItem.stock_quantity <= 0}
                          onClick={() => {
                            const origin = window.location.origin;
                            const fullImageUrl = selectedItem.image_url.startsWith('http') ? selectedItem.image_url : `${origin}${selectedItem.image_url}`;
                            trackOrder(selectedItem.title, selectedItem.price, selectedItem.id || "");
                            const message = encodeURIComponent(`📸 *Product Photo:* ${fullImageUrl}\n\n*Product:* ${selectedItem.title}\n*Price:* ${selectedItem.price}\n\nHello Hydro-Tronics Eng, I want to order this product.`);
                            window.open(`https://wa.me/250780592673?text=${message}`, '_blank');
                          }}
                        >
                          {selectedItem.stock_quantity !== undefined && selectedItem.stock_quantity <= 0 ? 'Out of Stock' : 'Order via WhatsApp'}
                        </button>
                        <button className="btn btn-primary" onClick={() => {
                          setSelectedItem(null);
                          const contactSection = document.getElementById('contact');
                          contactSection?.scrollIntoView({ behavior: 'smooth' });
                        }}>
                          Use Contact Form
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary w-full" onClick={() => setSelectedItem(null)}>
                        Close Project View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .portfolio-section { background: var(--bg-main); }
        .section-header { text-align: center; margin-bottom: 4rem; }
        .sub-title { font-size: 2rem; margin-bottom: 2rem; border-left: 5px solid var(--primary); padding-left: 1.5rem; }
        .mt-20 { margin-top: 5rem; }
        
        .grid { display: grid; gap: 2.5rem; }
        .portfolio-grid { grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); }
        .carousel-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: white;
          border: 1px solid var(--border-color);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s;
          color: #333;
        }
        .carousel-btn:hover {
          background: var(--primary);
          color: white;
          border-color: transparent;
        }
        .carousel-btn.left { left: -30px; }
        .carousel-btn.right { right: -30px; }
        
        .product-grid { 
          display: flex;
          overflow-x: auto;
          gap: 2rem;
          padding: 2rem 5px;
          scrollbar-width: none;
          scroll-snap-type: x mandatory;
          width: 100%;
        }
        .product-grid::-webkit-scrollbar { display: none; }

        .product-card-modern {
          min-width: 400px;
          flex: 0 0 auto;
          background: white;
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          scroll-snap-align: start;
        }
        .card-top .label {
          font-size: 0.85rem;
          color: #666;
          font-weight: 700;
          display: block;
          margin-bottom: 0.5rem;
        }
        .card-top h3 {
          font-size: 1.8rem;
          font-weight: 900;
          color: #111;
        }
        .card-image { background-image: var(--bg-image); }
        .card-image-main {
          height: 350px;
          background-image: var(--product-image);
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-color: #f8fafc;
          border-radius: 12px;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        @media (max-width: 868px) {
          .carousel-btn { display: none; }
          .product-card-modern { min-width: 320px; padding: 1.5rem; }
          .card-image-main { height: 250px; }
        }

        .card { 
          border-radius: 24px; 
          overflow: hidden; 
          background: var(--card-bg); 
          box-shadow: var(--shadow);
          transition: transform 0.3s ease;
          border: 1px solid var(--border-color);
        }
        .card:hover { transform: translateY(-10px); }

        .card-image { 
          height: 300px; 
          background-size: cover; 
          background-position: center; 
          position: relative;
        }

        .card-overlay {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
        }

        .cat {
          background: var(--primary);
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .card-content { padding: 2rem; }
        .card-content h3 { margin-bottom: 0.5rem; font-size: 1.5rem; }
        
        .price { 
          color: var(--primary); 
          font-weight: 700; 
          font-size: 1.2rem; 
        }
        .price-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .stock-tag {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
        }
        .stock-tag.in-stock {
          background: #e6fffa;
          color: #2c7a7b;
        }
        .stock-tag.out-of-stock {
          background: #fff5f5;
          color: #c53030;
        }

        .modal-meta-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .link { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          color: var(--primary); 
          font-weight: 600; 
          margin-top: 1rem;
          text-decoration: none;
        }

        .btn-sm { padding: 0.6rem 1.5rem; font-size: 0.9rem; }
        .mr-2 { margin-right: 0.5rem; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .w-full { width: 100%; }

        @media (max-width: 768px) {
          .portfolio-grid { grid-template-columns: 1fr; }
        }
        .link-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          backdrop-filter: blur(5px);
        }
        .modal-content {
          background: white;
          width: 100%;
          max-width: 1000px;
          border-radius: 32px;
          overflow: hidden;
          position: relative;
          animation: modalSlide 0.4s ease-out;
        }
        @keyframes modalSlide {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 10;
        }
        .modal-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-height: 85vh;
          overflow-y: auto;
        }
        .modal-image-container {
          position: relative;
          overflow: hidden;
          background: #f8fafc;
          height: 100%;
          max-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .zoom-image {
          height: 100%;
          width: 100%;
          background-image: var(--modal-bg);
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          transition: transform 0.5s ease;
          cursor: zoom-in;
        }
        .zoom-image:hover {
          transform: scale(1.5);
        }
        .modal-text {
          padding: 3.5rem;
        }
        .modal-text h2 {
          font-size: 2.5rem;
          margin: 1rem 0;
        }
        .modal-price {
          display: inline-block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 2rem;
        }
        .description {
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }
        .features {
          margin-bottom: 2.5rem;
        }
        .features h4 {
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }
        .features ul {
          list-style: none;
        }
        .features li {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-light);
        }
        .features li::before {
          content: "✓";
          color: var(--primary);
          font-weight: bold;
        }
        .modal-actions {
          display: flex;
          gap: 1rem;
        }
        
        /* Better Mobile Responsiveness */
        @media (max-width: 1024px) {
          .modal-content { max-width: 90%; }
        }
        @media (max-width: 868px) {
          .modal-body { grid-template-columns: 1fr; }
          .modal-image-container { height: 350px; min-height: 350px; }
          .modal-text { padding: 2rem; }
          .modal-text h2 { font-size: 1.8rem; }
        }
        @media (max-width: 480px) {
          .section-title h2 { font-size: 2rem; }
          .tab-btn { padding: 0.6rem 1.2rem; font-size: 0.9rem; }
          .modal-text { padding: 1.5rem; }
          .modal-actions { flex-direction: column; }
          .modal-actions button { width: 100%; }
        }
        .btn-success { background: #25d366; color: white; border: none; padding: 0.7rem 1.8rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .btn-sm { padding: 0.5rem 1rem; font-size: 0.85rem; }
        .btn-text { background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; }
        .flex { display: flex; }
        .gap-2 { gap: 0.75rem; }
        .flex-1 { flex: 1; }
        .w-full { width: 100%; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mr-2 { margin-right: 0.5rem; }
      `}</style>
    </section>
  );
}

