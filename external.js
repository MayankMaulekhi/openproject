
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true
        });

        // Sample menu data
        const menuData = [
            {
                id: 1,
                name: "Margherita Pizza",
                description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
                price: 12.99,
                category: "pizza",
                type: "veg",
                rating: 4.5,
                image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1fab9904-1cca-42dd-817c-8185310ec6b8.png"
            },
            {
                id: 2,
                name: "Pepperoni Pizza",
                description: "Delicious pizza with pepperoni and mozzarella cheese",
                price: 15.99,
                category: "pizza",
                type: "non-veg",
                rating: 4.7,
                image: "https://placehold.co/300x200"
            },
            {
                id: 3,
                name: "Classic Burger",
                description: "Juicy beef patty with lettuce, tomato, and special sauce",
                price: 9.99,
                category: "burgers",
                type: "non-veg",
                rating: 4.3,
                image: "https://placehold.co/300x200"
            },
            {
                id: 4,
                name: "Veggie Burger",
                description: "Plant-based patty with fresh vegetables and avocado",
                price: 11.99,
                category: "burgers",
                type: "veg",
                rating: 4.2,
                image: "https://placehold.co/300x200"
            },
            {
                id: 5,
                name: "Fresh Cola",
                description: "Refreshing cold cola drink",
                price: 2.99,
                category: "drinks",
                type: "veg",
                rating: 4.0,
                image: "https://placehold.co/300x200"
            },
            {
                id: 6,
                name: "Caesar Salad",
                description: "Crispy romaine lettuce with caesar dressing and parmesan",
                price: 8.99,
                category: "salads",
                type: "veg",
                rating: 4.4,
                image: "https://placehold.co/300x200"
            },
            {
                id: 7,
                name: "Chicken Salad",
                description: "Grilled chicken with mixed greens and vinaigrette",
                price: 13.99,
                category: "salads",
                type: "non-veg",
                rating: 4.6,
                image: "https://placehold.co/300x200"
            },
            {
                id: 8,
                name: "Chocolate Cake",
                description: "Rich chocolate cake with chocolate frosting",
                price: 6.99,
                category: "desserts",
                type: "veg",
                rating: 4.8,
                image: "https://placehold.co/300x200"
            },
            {
                id: 9,
                name: "Pad Thai",
                description: "Traditional Thai noodles with peanut sauce and vegetables",
                price: 14.99,
                category: "asian",
                type: "veg",
                rating: 4.5,
                image: "https://placehold.co/300x200"
            },
            {
                id: 10,
                name: "Chicken Ramen",
                description: "Japanese noodle soup with chicken and vegetables",
                price: 16.99,
                category: "asian",
                type: "non-veg",
                rating: 4.7,
                image: "https://placehold.co/300x200"
            }
        ];

        // Cart functionality
        let cart = JSON.parse(localStorage.getItem('foodieHubCart')) || [];
        let currentFilter = { type: 'all', category: 'all', price: 'all' };

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadPopularItems();
            loadMenuItems();
            updateCartUI();
            setupEventListeners();
        });

        // Setup event listeners
        function setupEventListeners() {
            // Search functionality
            document.getElementById('searchInput').addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                filterItems({ search: searchTerm });
            });

            // Checkout form submission
            document.getElementById('checkoutForm').addEventListener('submit', function(e) {
                e.preventDefault();
                placeOrder();
            });
        }

        // Page navigation
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            // Show selected page
            document.getElementById(pageId).classList.add('active');

            // Update navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Find and activate the corresponding nav item
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                if (item.textContent.toLowerCase() === pageId || 
                    (pageId === 'home' && item.textContent.toLowerCase() === 'home')) {
                    item.classList.add('active');
                }
            });

            // Close cart if open
            if (document.getElementById('cartSidebar').classList.contains('open')) {
                toggleCart();
            }

            // Load checkout data if navigating to checkout
            if (pageId === 'checkout') {
                loadCheckoutData();
            }
        }

        // Load popular items
        function loadPopularItems() {
            const popularItems = menuData.slice(0, 6); // First 6 items
            renderItems('popularItems', popularItems);
        }

        // Load menu items
        function loadMenuItems() {
            renderItems('menuItems', menuData);
        }

        // Render items
        function renderItems(containerId, items) {
            const container = document.getElementById(containerId);
            
            if (items.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No items found.</p>';
                return;
            }

            container.innerHTML = items.map(item => `
                <div class="item-card" data-aos="fade-up">
                    <div class="${item.type}-indicator">
                        ${item.type === 'veg' ? '●' : '●'}
                    </div>
                    <img src="${item.image}" alt="${item.name} - ${item.description}" class="item-image">
                    <div class="item-content">
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-description">${item.description}</p>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <button class="add-to-cart-btn ripple-effect" onclick="addToCart(${item.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `).join('');

            // Re-initialize AOS for new elements
            AOS.refresh();
        }

        // Filter functions
        function filterByCategory(category) {
            currentFilter.category = category;
            showPage('menu');
            filterItems();
            
            // Scroll to menu items
            setTimeout(() => {
                document.querySelector('#menuItems').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }

        function filterByType(type) {
            currentFilter.type = type;
            updateFilterButtons('type', type);
            filterItems();
        }

        function filterByPrice(price) {
            currentFilter.price = price;
            updateFilterButtons('price', price);
            filterItems();
        }

        function updateFilterButtons(filterType, activeValue) {
            // Remove active class from all buttons of this type
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if ((filterType === 'type' && ['all', 'veg', 'non-veg'].includes(btn.textContent.toLowerCase().replace('vegetarian', 'veg').replace('non-vegetarian', 'non-veg'))) ||
                    (filterType === 'price' && btn.textContent.includes('$'))) {
                    btn.classList.remove('active');
                }
            });

            // Add active class to clicked button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                const btnText = btn.textContent.toLowerCase();
                if ((filterType === 'type' && btnText.includes(activeValue)) ||
                    (filterType === 'price' && btnText.includes(activeValue))) {
                    btn.classList.add('active');
                }
            });
        }

        function filterItems(options = {}) {
            let filteredItems = [...menuData];

            // Apply search filter
            if (options.search) {
                filteredItems = filteredItems.filter(item => 
                    item.name.toLowerCase().includes(options.search) ||
                    item.description.toLowerCase().includes(options.search)
                );
            }

            // Apply type filter
            if (currentFilter.type !== 'all') {
                filteredItems = filteredItems.filter(item => item.type === currentFilter.type);
            }

            // Apply category filter
            if (currentFilter.category !== 'all') {
                filteredItems = filteredItems.filter(item => item.category === currentFilter.category);
            }

            // Apply price filter
            if (currentFilter.price !== 'all') {
                filteredItems = filteredItems.filter(item => {
                    if (currentFilter.price === 'low') return item.price < 10;
                    if (currentFilter.price === 'medium') return item.price >= 10 && item.price < 15;
                    if (currentFilter.price === 'high') return item.price >= 15;
                    return true;
                });
            }

            renderItems('menuItems', filteredItems);
        }

        // Cart functions
        function addToCart(itemId) {
            const item = menuData.find(item => item.id === itemId);
            const existingItem = cart.find(cartItem => cartItem.id === itemId);

            // Flying animation
            const button = event.target;
            const itemCard = button.closest('.item-card');
            const itemImage = itemCard.querySelector('.item-image');
            
            // Create flying element
            const flyingImage = itemImage.cloneNode(true);
            flyingImage.style.position = 'fixed';
            flyingImage.style.zIndex = '9999';
            flyingImage.style.width = '60px';
            flyingImage.style.height = '60px';
            flyingImage.style.borderRadius = '50%';
            flyingImage.classList.add('fly-animation');
            
            const rect = itemImage.getBoundingClientRect();
            flyingImage.style.top = rect.top + 'px';
            flyingImage.style.left = rect.left + 'px';
            
            document.body.appendChild(flyingImage);
            
            setTimeout(() => {
                flyingImage.remove();
            }, 800);

            // Add ripple effect
            createRipple(button, event);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }

            updateCartUI();
            saveCart();

            // Show success feedback
            button.textContent = 'Added!';
            button.style.background = '#4caf50';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.background = '#ff6b35';
            }, 1000);
        }

        function createRipple(button, event) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        function updateCartQuantity(itemId, change) {
            const item = cart.find(cartItem => cartItem.id === itemId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(itemId);
                } else {
                    updateCartUI();
                    saveCart();
                }
            }
        }

        function removeFromCart(itemId) {
            cart = cart.filter(item => item.id !== itemId);
            updateCartUI();
            saveCart();
        }

        function updateCartUI() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            const checkoutBtn = document.getElementById('checkoutBtn');

            // Update cart count
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;

            if (totalItems === 0) {
                cartCount.style.display = 'none';
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                cartTotal.textContent = '0.00';
                checkoutBtn.disabled = true;
            } else {
                cartCount.style.display = 'flex';
                
                // Update cart items
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                                <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 10px; background: #f44336;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');

                // Update total
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cartTotal.textContent = total.toFixed(2);
                checkoutBtn.disabled = false;
            }
        }

        function toggleCart() {
            const cartSidebar = document.getElementById('cartSidebar');
            const cartOverlay = document.querySelector('.cart-overlay');
            
            cartSidebar.classList.toggle('open');
            cartOverlay.classList.toggle('open');
        }

        function saveCart() {
            localStorage.setItem('foodieHubCart', JSON.stringify(cart));
        }

        function loadCheckoutData() {
            const checkoutItems = document.getElementById('checkoutItems');
            const subtotal = document.getElementById('subtotal');
            const finalTotal = document.getElementById('finalTotal');

            if (cart.length === 0) {
                checkoutItems.innerHTML = '<p>No items in cart</p>';
                return;
            }

            checkoutItems.innerHTML = cart.map(item => `
                <div class="summary-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');

            const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            subtotal.textContent = subtotalAmount.toFixed(2);
            finalTotal.textContent = (subtotalAmount + 2.99).toFixed(2); // Adding delivery fee
        }

        function placeOrder() {
            const name = document.getElementById('customerName').value;
            const phone = document.getElementById('customerPhone').value;
            const address = document.getElementById('customerAddress').value;

            if (!name || !phone || !address) {
                alert('Please fill in all required fields');
                return;
            }

            // Generate order number
            const orderNumber = Math.floor(Math.random() * 90000) + 10000;
            document.getElementById('orderNumber').textContent = `Order #${orderNumber}`;

            // Clear cart
            cart = [];
            saveCart();
            updateCartUI();

            // Show thank you page
            showPage('thankyou');

            // Reset form
            document.getElementById('checkoutForm').reset();
        }

        // Mobile menu toggle (placeholder for future implementation)
        function toggleMobileMenu() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('mobile-active');
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Parallax effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-image');
            if (parallax) {
                const speed = 0.5;
                parallax.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });

        // Add loading effect
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
