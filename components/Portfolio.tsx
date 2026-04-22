"use client";

import { ArrowRight, Box, ShoppingCart, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

// Types for our data
interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  price?: string;
  stock_quantity?: number;
}

export default function Portfolio() {
  const [products, setProducts] = useState<ProjectItem[]>([]);
  const [flagshipProjects, setFlagshipProjects] = useState<ProjectItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProjectItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

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

  // Auto-scroll: move one card every 3 seconds, loop back at the end
  useEffect(() => {
    if (products.length === 0 || isPaused) return;

    autoScrollTimer.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;

        if (isAtEnd) {
          // Loop back to start smoothly
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const scrollAmount = 432;
          scrollRef.current.scrollTo({ 
            left: scrollLeft + scrollAmount, 
            behavior: "smooth" 
          });
        }
      }
    }, 3000);

    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [products, isPaused]);

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
    async function fetchData() {
      // Fetch Products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (productsError) console.error("Error fetching products:", productsError);
      else if (productsData) {
        setProducts(productsData.map(p => ({
          id: p.id,
          title: p.title || "Untitled Product",
          category: p.category || "General",
          description: p.description || "No description available",
          image_url: p.image_url || "/product-1.png",
          price: p.price || "Contact for price",
          stock_quantity: p.stock_quantity || 0
        })));
      }

      // Fetch Flagship Projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) console.error("Error fetching projects:", projectsError);
      else if (projectsData) {
        setFlagshipProjects(projectsData.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category || "Engineering",
          description: p.description || "",
          image_url: p.image_url || "/portfolio-1.png",
          price: "Project Consult"
        })));
      }
    }

    fetchData();
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
          {flagshipProjects.map((item, i) => (
            <div key={i} className="card portfolio-card">
              <div className="card-image">
                <Image className="card-img-element" src={item.image_url} alt={item.title} width={600} height={400} />
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
          {flagshipProjects.length === 0 && (
            <div className="empty-state">
               <p>Our portfolio is coming soon. Stay tuned!</p>
            </div>
          )}
        </div>

        <h3 className="sub-title mt-20">Premium Products</h3>
        <div 
          className="carousel-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
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
                <Image 
                  className="card-image-main"
                  src={item.image_url || '/product-1.png'}
                  alt={item.title}
                  width={600}
                  height={400}
                />
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
                        trackOrder(item.title, item.price || "Contact for Price", item.id);
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
                    <Image 
                      className="modal-image zoom-image" 
                      src={selectedItem.image_url}
                      alt={selectedItem.title}
                      width={800}
                      height={800}
                    />
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
                            trackOrder(selectedItem.title, selectedItem.price || "Contact for Price", selectedItem.id || "");
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
        .card-img-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .card-image-main {
          height: 350px;
          width: 100%;
          object-fit: contain;
          background-color: #f8fafc;
          border-radius: 12px;
          display: block;
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
          object-fit: contain;
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

        /* ===== TABLET (max 1024px) ===== */
        @media (max-width: 1024px) {
          .modal-content { max-width: 90%; }
          .portfolio-grid { grid-template-columns: 1fr 1fr; }
          .product-card-modern { min-width: 340px; }
        }

        /* ===== SMALL TABLET / LARGE PHONE (max 868px) ===== */
        @media (max-width: 868px) {
          .carousel-btn { display: none; }
          .product-card-modern { min-width: 280px; padding: 1.5rem; }
          .card-image-main { height: 220px; }
          .card-top h3 { font-size: 1.4rem; }
          .modal-body { grid-template-columns: 1fr; }
          .modal-image-container { height: 300px; min-height: 300px; }
          .modal-text { padding: 2rem; }
          .modal-text h2 { font-size: 1.8rem; }
        }

        /* ===== PHONE (max 768px) ===== */
        @media (max-width: 768px) {
          .portfolio-grid { grid-template-columns: 1fr; }
          .section-header h2 { font-size: 2rem; }
          .sub-title { font-size: 1.5rem; }
          .card-image { height: 220px; }
          .card-content { padding: 1.5rem; }
          .card-content h3 { font-size: 1.2rem; }
          .modal-overlay { padding: 1rem; }
          .modal-content { max-width: 100%; border-radius: 20px; }
        }

        /* ===== SMALL PHONE (max 480px) ===== */
        @media (max-width: 480px) {
          .section-header h2 { font-size: 1.6rem; }
          .sub-title { font-size: 1.2rem; padding-left: 1rem; }
          .product-card-modern { min-width: 260px; padding: 1.2rem; }
          .card-image-main { height: 180px; }
          .card-top h3 { font-size: 1.2rem; }
          .card-footer { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .price { font-size: 1rem; }
          .modal-text { padding: 1.25rem; }
          .modal-text h2 { font-size: 1.4rem; }
          .modal-price { font-size: 1.2rem; }
          .description { font-size: 0.95rem; }
          .modal-actions { flex-direction: column; }
          .modal-actions button { width: 100%; }
          .modal-image-container { height: 240px; min-height: 240px; }
          .zoom-image:hover { transform: scale(1.2); }
          .mt-20 { margin-top: 3rem; }
        }
      `}</style>
    </section>
  );
}

