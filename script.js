
// Authentication Logic
const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';

const requireLogin = () => {
    if (!isLoggedIn()) {
        showToast('You must log in first!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    return true;
};

document.addEventListener('DOMContentLoaded', () => {
    
    let authContainer = document.querySelector('#auth-container');
    if (authContainer) {
        if (isLoggedIn()) {
            let currentUser = localStorage.getItem('currentUser') || 'Guest';
            authContainer.innerHTML = `
                <span style="font-size: 1.5rem; color: var(--text-muted);">Hi, <b style="color: var(--secondary);">${currentUser}</b></span>
                <button id="logout-btn" class="btn" style="padding: 0.7rem 1.5rem; font-size: 1.3rem; border-radius: 2rem; background: #ef4444; box-shadow: none;">Logout</button>
            `;
            document.querySelector('#logout-btn').onclick = () => {
                localStorage.setItem('isLoggedIn', 'false');
                localStorage.removeItem('currentUser');
                showToast('Logged out successfully!');
                setTimeout(() => window.location.reload(), 1000);
            };
        } else {
            authContainer.innerHTML = `
                <a href="login.html" class="btn" style="padding: 0.7rem 1.5rem; font-size: 1.3rem; border-radius: 2rem; box-shadow: none;">Sign In</a>
                <a href="login.html" class="btn" style="padding: 0.7rem 1.5rem; font-size: 1.3rem; border-radius: 2rem; background: transparent; border: 1px solid var(--primary); color: var(--primary); box-shadow: none;">Sign Up</a>
            `;
        }
    }
    
    
    // Registration & Login Logic
    let loginForm = document.querySelector('#login-form');
    let signupForm = document.querySelector('#signup-form');
    let showSignupBtn = document.querySelector('#show-signup');
    let showLoginBtn = document.querySelector('#show-login');

    if (showSignupBtn && showLoginBtn) {
        showSignupBtn.onclick = (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        };
        showLoginBtn.onclick = (e) => {
            e.preventDefault();
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
        };
    }

    if (signupForm) {
        signupForm.onsubmit = (e) => {
            e.preventDefault();
            let name = document.querySelector('#signup-name').value.trim();
            let email = document.querySelector('#signup-email').value.trim();
            let password = document.querySelector('#signup-password').value;

            let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            
            // Cek apakah email sudah ada
            let exists = users.find(u => u.email === email);
            if (exists) {
                showToast('Registration failed: Email is already registered!');
                return;
            }

            // Simpan user baru
            users.push({ name, email, password });
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            
            showToast('Registration successful! Please Sign In.');
            signupForm.reset();
            
            // Pindah ke form login
            setTimeout(() => {
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
            }, 1000);
        };
    }

    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            let email = document.querySelector('#login-email').value.trim();
            let password = document.querySelector('#login-password').value;

            let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            
            let validUser = users.find(u => u.email === email && u.password === password);

            if (validUser) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', validUser.name);
                showToast('Login successful! Welcome ' + validUser.name);
                setTimeout(() => {
                    window.location.href = 'Index.html';
                }, 1500);
            } else {
                showToast('Login failed: Incorrect Email or Password!');
            }
        };
    }

});


let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

if (menu && navbar) {
    menu.onclick = () => {
      menu.classList.toggle('fa-times');
      navbar.classList.toggle('active');
    }
}

let section = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header .navbar a');

window.onscroll = () => {
    if (menu) menu.classList.remove('fa-times');
    if (navbar) navbar.classList.remove('active');

    section.forEach(sec => {
        let top = window.scrollY;
        let height = sec.offsetHeight;
        let offset = sec.offsetTop - 150;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                let targetLink = document.querySelector('header .navbar a[href*=' + id + ']');
                if (targetLink) targetLink.classList.add('active');
            });
        };
    });
};

let searchIcon = document.querySelector('#search-icon');
let searchForm = document.querySelector('#search-form');
let searchClose = document.querySelector('#close');

if (searchIcon && searchForm) {
    searchIcon.onclick = () => {
      searchForm.classList.toggle('active');
    }
}
if (searchClose && searchForm) {
    searchClose.onclick = () => {
      searchForm.classList.remove('active');
    }
}

var swiper = new Swiper(".home-slider", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  loop:true,
});

function loader(){
  let loaderEl = document.querySelector('.loader-container');
  if (loaderEl) loaderEl.classList.add('fade-out');
}

function fadeOut(){
  setInterval(loader, 3000);
}

window.onload = fadeOut;

// Toast Element Creation
let toast = document.createElement('div');
toast.className = 'toast';
toast.id = 'toast';
document.body.appendChild(toast);

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Cart & Wishlist UI Logic
let cartIcon = document.querySelector('#cart-icon');
let cartContainer = document.querySelector('#cart-items-container');
let cartClose = document.querySelector('#cart-close');

let wishlistIcon = document.querySelector('#wishlist-icon');
let wishlistContainer = document.querySelector('#wishlist-items-container');
let wishlistClose = document.querySelector('#wishlist-close');

if (cartIcon && cartContainer) {
    cartIcon.onclick = () => {
        cartContainer.classList.toggle('active');
        if(wishlistContainer) wishlistContainer.classList.remove('active');
    }
}
if (cartClose && cartContainer) {
    cartClose.onclick = () => {
        cartContainer.classList.remove('active');
    }
}

if (wishlistIcon && wishlistContainer) {
    wishlistIcon.onclick = () => {
        wishlistContainer.classList.toggle('active');
        if(cartContainer) cartContainer.classList.remove('active');
    }
}
if (wishlistClose && wishlistContainer) {
    wishlistClose.onclick = () => {
        wishlistContainer.classList.remove('active');
    }
}

window.addEventListener('scroll', () => {
    if(cartContainer) cartContainer.classList.remove('active');
    if(wishlistContainer) wishlistContainer.classList.remove('active');
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function updateCartUI() {
    localStorage.setItem("cart", JSON.stringify(cart));
    let cartItemsContainer = document.querySelector('#cart-items-container .cart-items');
    let cartTotal = document.querySelector('#cart-total-price');
    if(!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        let div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <i class="fas fa-times" onclick="removeFromCart(${index})"></i>
            <img src="${item.img}" alt="">
            <div class="content">
                <h3>${item.name}</h3>
                <span class="price">Rp ${item.price.toLocaleString('id-ID')}</span>
                <div class="qty-controls" style="display: flex; align-items: center; gap: 1rem; margin-top: .5rem;">
                    <button onclick="changeQty(${index}, -1)" style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--bg-color); color: var(--secondary); cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center;">-</button>
                    <span class="qty" style="font-size: 1.6rem; font-weight: 600;">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)" style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--bg-color); color: var(--secondary); cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center;">+</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    if(cartTotal) cartTotal.innerText = 'Rp ' + total.toLocaleString('id-ID');
}

window.changeQty = function(index, delta) {
    if (cart[index].qty + delta > 0) {
        cart[index].qty += delta;
        updateCartUI();
    } else {
        removeFromCart(index);
    }
}


function updateWishlistUI() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    let wishlistItemsContainer = document.querySelector('#wishlist-items');
    if(!wishlistItemsContainer) return;
    wishlistItemsContainer.innerHTML = '';
    
    wishlist.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <i class="fas fa-times" onclick="removeFromWishlist(${index})"></i>
            <img src="${item.img}" alt="">
            <div class="content">
                <h3>${item.name}</h3>
                <span class="price">Rp ${item.price.toLocaleString('id-ID')}</span>
            </div>
        `;
        wishlistItemsContainer.appendChild(div);
    });
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
    showToast('Item removed from cart!');
}

window.removeFromWishlist = function(index) {
    let removedItem = wishlist[index];
    wishlist.splice(index, 1);
    updateWishlistUI();
    showToast('Item removed from wishlist!');
    
    document.querySelectorAll('.box, .slide').forEach(box => {
        let nameElem = box.querySelector('h3');
        if(nameElem && nameElem.innerText === removedItem.name) {
            syncHearts(removedItem.name, false);
        }
    });
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.onclick = (e) => {
        e.preventDefault();
        if(!requireLogin()) return;
        let box = e.target.closest('.box') || e.target.closest('.slide');
        if(!box) return;
        if(!requireLogin()) return;
        
        let imgElem = box.querySelector('img');
        let img = imgElem ? imgElem.src : '';
        
        let nameElem = box.querySelector('h3');
        let name = nameElem ? nameElem.innerText : 'Delicious Meal';
        
        let priceElem = box.querySelector('span.price') || box.querySelector('span');
        let priceText = priceElem ? priceElem.innerText.replace('Rp', '').replace(/\./g, '').trim() : '25000';
        let price = parseInt(priceText) || 25000;

        let qtyInput = box.querySelector('.item-qty');
        let qtyToAdd = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
        let existing = cart.find(i => i.name === name);
        if(existing) {
            existing.qty += qtyToAdd;
        } else {
            cart.push({ name, price, img, qty: qtyToAdd });
        }
        
        updateCartUI();
        showToast('Item added to cart!');
    }
});

document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.onclick = (e) => {
        e.preventDefault();
        if(!requireLogin()) return;
        let box = e.target.closest('.box') || e.target.closest('.slide');
        if(!box) return;
        if(!requireLogin()) return;
        
        let imgElem = box.querySelector('img');
        let img = imgElem ? imgElem.src : '';
        
        let nameElem = box.querySelector('h3');
        let name = nameElem ? nameElem.innerText : 'Delicious Meal';
        
        let priceElem = box.querySelector('span.price') || box.querySelector('span');
        let priceText = priceElem ? priceElem.innerText.replace('Rp', '').replace(/\./g, '').trim() : '25000';
        let price = parseInt(priceText) || 25000;

        if(btn.style.color === 'red') {
            syncHearts(name, false);
            wishlist = wishlist.filter(i => i.name !== name);
            showToast('Removed from wishlist!');
        } else {
            syncHearts(name, true);
            let existing = wishlist.find(i => i.name === name);
            if(!existing) wishlist.push({ name, price, img });
            showToast('Added to wishlist!');
        }
        updateWishlistUI();
    }
});


let orderForm = document.querySelector('.order form');
if(orderForm) {
    orderForm.onsubmit = (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            showToast('Your cart is empty! Please order some food first.');
            return;
        }

        // Hitung total dan tampilkan modal pembayaran
        let total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
        document.querySelector('#payment-total-price').innerText = 'Rp ' + total.toLocaleString('id-ID');
        document.querySelector('#payment-modal').classList.add('active');
    }
}

// Payment Modal Logic
let paymentModal = document.querySelector('#payment-modal');
let confirmBtn = document.querySelector('#confirm-payment-btn');
let cancelBtn = document.querySelector('#cancel-payment-btn');
let paymentMethod = document.querySelector('#payment-method');

if (cancelBtn) {
    cancelBtn.onclick = (e) => {
        e.preventDefault();
        paymentModal.classList.remove('active');
    }
}

if (confirmBtn) {
    confirmBtn.onclick = (e) => {
        e.preventDefault();
        if(!paymentMethod.value) {
            showToast('Please select a payment method first!');
            return;
        }
        
        paymentModal.classList.remove('active');
        
        let preparingModal = document.querySelector('#preparing-modal');
        let successModal = document.querySelector('#success-modal');
        
        if(preparingModal && successModal) {
            preparingModal.classList.add('active');
            
            setTimeout(() => {
                preparingModal.classList.remove('active');
                
                let itemsContainer = document.querySelector('#success-order-items');
                let totalElem = document.querySelector('#success-total-price');
                
                itemsContainer.innerHTML = '';
                let total = 0;
                
                cart.forEach(item => {
                    let itemTotal = item.price * item.qty;
                    total += itemTotal;
                    
                    let row = document.createElement('div');
                    row.className = 'order-item-row';
                    row.innerHTML = `<span>${item.name} (x${item.qty})</span> <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>`;
                    itemsContainer.appendChild(row);
                });
                
                totalElem.innerText = `Rp ${total.toLocaleString('id-ID')}`;
                
                successModal.classList.add('active');
                
                if(orderForm) orderForm.reset();
                cart = [];
                updateCartUI();
                paymentMethod.value = ""; 
            }, 2500);
        } else {
            showToast('Payment Successful! Your order will be processed shortly.');
            if(orderForm) orderForm.reset();
            cart = [];
            updateCartUI();
            paymentMethod.value = ""; 
        }
    }
}



// Search Functionality
  let searchFormEl = document.querySelector('#search-form');
  let searchBoxEl = document.querySelector('#search-box');
  let searchLabelEl = document.querySelector('label[for="search-box"]');
  let searchResultsModal = document.querySelector('#search-results-modal');
  let searchResultsContainer = document.querySelector('#search-results-container');
  let closeSearchResults = document.querySelector('#close-search-results');
  
  if (closeSearchResults) {
      closeSearchResults.onclick = () => {
          searchResultsModal.classList.remove('active');
      }
  }

  if(searchFormEl && searchBoxEl) {
      const executeSearch = (e) => {
          if (e) e.preventDefault();
          let query = searchBoxEl.value.toLowerCase().trim();
          
          searchFormEl.classList.remove('active');
          
          if (query === '') {
              showToast('Please enter a menu name');
              return;
          }

          let allBoxes = document.querySelectorAll('.menu .box');
          let foundCount = 0;
          let addedNames = new Set();
          searchResultsContainer.innerHTML = '';
          
          allBoxes.forEach(box => {
              let titleElem = box.querySelector('h3');
              if(titleElem) {
                  let title = titleElem.innerText.toLowerCase();
                  let rawTitle = titleElem.innerText.trim();
                  if(title.includes(query) && !addedNames.has(rawTitle)) {
                      addedNames.add(rawTitle);
                      let clonedBox = box.cloneNode(true);
                      
                      // Attach Add to Cart listener
                      let addToCartBtn = clonedBox.querySelector('.add-to-cart');
                      if (addToCartBtn) {
                          addToCartBtn.onclick = (ev) => {
                              ev.preventDefault();
                              let imgElem = clonedBox.querySelector('img');
                              let img = imgElem ? imgElem.src : '';
                              let nameElem = clonedBox.querySelector('h3');
                              let name = nameElem ? nameElem.innerText : 'Delicious Meal';
                              let priceElem = clonedBox.querySelector('span.price') || clonedBox.querySelector('span');
                              let priceText = priceElem ? priceElem.innerText.replace('Rp', '').replace(/\./g, '').trim() : '25000';
                              let price = parseInt(priceText) || 25000;
                              
                              let qtyInput = clonedBox.querySelector('.item-qty');
                              let qtyToAdd = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
                              let existing = cart.find(i => i.name === name);
                              if(existing) {
                                  existing.qty += qtyToAdd;
                              } else {
                                  cart.push({ name, price, img, qty: qtyToAdd });
                              }
                              updateCartUI();
                              showToast('Item added to cart!');
                          }
                      }
                      
                      // Attach Wishlist listener
                      let wishlistBtn = clonedBox.querySelector('.wishlist-btn');
                      if (wishlistBtn) {
                          wishlistBtn.onclick = (ev) => {
                              ev.preventDefault();
                              let nameElem = clonedBox.querySelector('h3');
                              let name = nameElem ? nameElem.innerText : '';
                              let priceElem = clonedBox.querySelector('span.price') || clonedBox.querySelector('span');
                              let priceText = priceElem ? priceElem.innerText.replace('Rp', '').replace(/\./g, '').trim() : '0';
                              let price = parseInt(priceText) || 0;
                              let imgElem = clonedBox.querySelector('img');
                              let img = imgElem ? imgElem.src : '';

                              if(wishlistBtn.style.color === 'red') {
                                  syncHearts(name, false);
                                  wishlist = wishlist.filter(i => i.name !== name);
                                  showToast('Removed from wishlist!');
                              } else {
                                  syncHearts(name, true);
                                  let existing = wishlist.find(i => i.name === name);
                                  if(!existing) wishlist.push({ name, price, img });
                                  showToast('Added to wishlist!');
                              }
                              updateWishlistUI();
                          }
                      }
                      
                      searchResultsContainer.appendChild(clonedBox);
                      foundCount++;
                  }
              }
          });

          if(foundCount > 0) {
              searchResultsModal.classList.add('active');
              showToast('Found ' + foundCount + ' items for "' + query + '"');
          } else {
              showToast('Item "' + query + '" not found!');
          }
          
          searchBoxEl.value = ''; // clear input
      };

      searchFormEl.onsubmit = executeSearch;
      
      if(searchLabelEl) {
          searchLabelEl.onclick = (e) => {
              if (searchBoxEl.value.trim() !== '') {
                  executeSearch(e);
              }
          }
      }
  }

// Dummy Links handler
document.querySelectorAll('.dummy-link').forEach(link => {
    link.onclick = (e) => {
        e.preventDefault();
        showToast('This feature/page is still under development!');
    }
});


// Order Type Toggle Logic
let orderTypeSel = document.querySelector('#orderType');
let deliveryFields = document.querySelector('#deliveryFields');
let addressInput = document.querySelector('#address');
let dineInFields1 = document.querySelector('#dineInFields1');
let dineInFields2 = document.querySelector('#dineInFields2');
let branchInput = document.querySelector('#branch');
let tableInput = document.querySelector('#tableNumber');

if (orderTypeSel) {
    orderTypeSel.addEventListener('change', (e) => {
        if (e.target.value === 'delivery') {
            deliveryFields.classList.remove('hide');
            addressInput.required = true;
            
            dineInFields1.classList.add('hide');
            dineInFields2.classList.add('hide');
            branchInput.required = false;
            tableInput.required = false;
        } else {
            deliveryFields.classList.add('hide');
            addressInput.required = false;
            
            dineInFields1.classList.remove('hide');
            dineInFields2.classList.remove('hide');
            branchInput.required = true;
            tableInput.required = true;
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Page guard for checkout.html
    if (window.location.pathname.toLowerCase().includes('checkout.html')) {
        if (!requireLogin()) return;
    }
    
    updateCartUI();
    updateWishlistUI();
    
    let orderTypeSel = document.querySelector('#orderType');
    if(orderTypeSel) {
        orderTypeSel.dispatchEvent(new Event('change'));
    }
});

// Quick View Modal Logic (Perbaikan untuk nampilin deskripsi produk & gambar di kiri)
document.addEventListener('DOMContentLoaded', () => {
    let productDetailModal = document.querySelector('#product-detail-modal');
    let closeProductDetail = document.querySelector('#close-product-detail');
    let modalImg = document.querySelector('#modal-product-img');
    let modalTitle = document.querySelector('#modal-product-title');
    let modalStars = document.querySelector('#modal-product-stars');
    let modalDesc = document.querySelector('#modal-product-desc');
    let modalPrice = document.querySelector('#modal-product-price');
    let modalAddToCart = document.querySelector('#modal-add-to-cart');

    if (closeProductDetail && productDetailModal) {
        closeProductDetail.onclick = () => {
            productDetailModal.classList.remove('active');
        }
        productDetailModal.onclick = (e) => {
            if (e.target === productDetailModal) {
                productDetailModal.classList.remove('active');
            }
        }
    }

    document.body.addEventListener('click', (e) => {
        let viewBtn = e.target.closest('.view-btn');
        if (viewBtn) {
            let box = viewBtn.closest('.box') || viewBtn.closest('.slide');
            if (!box) return;

            let imgElem = box.querySelector('img');
            let img = imgElem ? imgElem.src : '';
            
            let nameElem = box.querySelector('h3');
            let name = nameElem ? nameElem.innerText : 'Delicious Meal';
            
            let priceElem = box.querySelector('span.price') || box.querySelector('span');
            let priceText = priceElem ? priceElem.innerText : 'Rp 25.000';

            let starsElem = box.querySelector('.stars');
            let starsHTML = starsElem ? starsElem.innerHTML : '';

            // Mengambil teks deskripsi asli dari elemen <p> pada card produk jika ada
            let descElem = box.querySelector('p');
            let desc = descElem ? descElem.innerText : 'Nikmati kelezatan menu pilihan terbaik yang diolah dengan bahan-bahan berkualitas tinggi untuk menemani hari Anda.';

            modalImg.src = img;
            modalTitle.innerText = name;
            modalStars.innerHTML = starsHTML;
            modalDesc.innerText = desc;
            modalPrice.innerText = priceText;

            modalAddToCart.onclick = (ev) => {
                ev.preventDefault();
                if(!requireLogin()) return;

                let priceClean = parseInt(priceText.replace('Rp', '').replace(/\./g, '').trim()) || 25000;
                let existing = cart.find(i => i.name === name);
                
                if(existing) {
                    existing.qty += 1;
                } else {
                    cart.push({ name, price: priceClean, img, qty: 1 });
                }
                
                updateCartUI();
                showToast('Item added to cart!');
                productDetailModal.classList.remove('active');
            };

            productDetailModal.classList.add('active');
        }
    });
});

// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    let themeToggle = document.querySelector('#theme-toggle');
    let isLight = localStorage.getItem('lightTheme') === 'true';

    // Set initial theme
    if (isLight) {
        document.body.classList.add('light-theme');
        if (themeToggle) {
            themeToggle.classList.remove('fa-sun');
            themeToggle.classList.add('fa-moon');
            themeToggle.title = "Toggle Dark Mode";
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            let currentlyLight = document.body.classList.contains('light-theme');
            
            // Save to localStorage
            localStorage.setItem('lightTheme', currentlyLight);
            
            // Toggle icon
            if (currentlyLight) {
                themeToggle.classList.remove('fa-sun');
                themeToggle.classList.add('fa-moon');
                themeToggle.title = "Toggle Dark Mode";
            } else {
                themeToggle.classList.remove('fa-moon');
                themeToggle.classList.add('fa-sun');
                themeToggle.title = "Toggle Light Mode";
            }
        });
    }
});

// Helper function to sync hearts across identical products
function syncHearts(name, isLiked) {
    document.querySelectorAll('.box, .slide').forEach(b => {
        let bName = b.querySelector('h3');
        if (bName && bName.innerText.trim() === name.trim()) {
            let bHeart = b.querySelector('.wishlist-btn');
            if (bHeart) {
                bHeart.style.color = isLiked ? 'red' : '';
            }
        }
    });
}
