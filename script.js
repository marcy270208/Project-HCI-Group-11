
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
            let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            let currentUserRecord = registeredUsers.find(user => user.name === currentUser);
            let profilePhoto = currentUserRecord?.profilePhoto || '';
            let accountAvatar = profilePhoto
                ? `<img src="${profilePhoto}" alt="${currentUser} profile photo">`
                : '<i class="fas fa-user-circle" aria-hidden="true"></i>';
            let panelAvatar = profilePhoto
                ? `<img src="${profilePhoto}" alt="${currentUser} profile photo">`
                : '<i class="fas fa-user" aria-hidden="true"></i>';
            authContainer.innerHTML = `
                <div class="account-menu">
                    <button id="account-toggle" class="account-toggle" type="button" aria-expanded="false" aria-haspopup="true">
                        <span class="account-trigger-avatar">${accountAvatar}</span>
                        <span class="account-name">${currentUser}</span>
                        <i class="fas fa-chevron-down account-chevron" aria-hidden="true"></i>
                    </button>
                    <div class="account-panel" role="menu">
                        <div class="account-panel-header">
                            <span class="account-avatar">${panelAvatar}</span>
                            <div>
                                <strong>${currentUser}</strong>
                                <small>Signed in</small>
                            </div>
                        </div>
                        <button id="account-settings-btn" class="account-setting-action" type="button" role="menuitem">
                            <i class="fas fa-user-cog" aria-hidden="true"></i> Account settings
                        </button>
                        <button id="logout-btn" class="account-signout" type="button" role="menuitem">
                            <i class="fas fa-sign-out-alt" aria-hidden="true"></i> Sign out
                        </button>
                    </div>
                </div>
            `;
            let accountToggle = document.querySelector('#account-toggle');
            let accountMenu = document.querySelector('.account-menu');
            let profilePhotoModal = document.querySelector('#profile-photo-modal');
            let profilePhotoImage = document.querySelector('#profile-photo-image');
            let profilePhotoName = document.querySelector('#profile-photo-name');
            let closeProfilePhoto = document.querySelector('#close-profile-photo');
            const openProfilePhoto = (event) => {
                if (!profilePhoto || !profilePhotoModal) return;
                event.stopPropagation();
                profilePhotoImage.src = profilePhoto;
                profilePhotoName.innerText = currentUser;
                profilePhotoModal.classList.add('active');
                accountMenu.classList.remove('active');
                accountToggle.setAttribute('aria-expanded', 'false');
            };
            if (profilePhotoModal && closeProfilePhoto) {
                document.querySelector('.account-trigger-avatar img')?.addEventListener('click', openProfilePhoto);
                document.querySelector('.account-avatar img')?.addEventListener('click', openProfilePhoto);
                closeProfilePhoto.onclick = () => profilePhotoModal.classList.remove('active');
                profilePhotoModal.onclick = (event) => {
                    if (event.target === profilePhotoModal) profilePhotoModal.classList.remove('active');
                };
            }
            accountToggle.onclick = () => {
                let isOpen = accountMenu.classList.toggle('active');
                accountToggle.setAttribute('aria-expanded', isOpen);
            };
            document.addEventListener('click', (event) => {
                if (!accountMenu.contains(event.target)) {
                    accountMenu.classList.remove('active');
                    accountToggle.setAttribute('aria-expanded', 'false');
                }
            });
            document.querySelector('#logout-btn').onclick = () => {
                localStorage.setItem('isLoggedIn', 'false');
                localStorage.removeItem('currentUser');
                showToast('Logged out successfully!');
                setTimeout(() => window.location.reload(), 1000);
            };

            let settingsButton = document.querySelector('#account-settings-btn');
            let settingsModal = document.querySelector('#account-settings-modal');
            let settingsForm = document.querySelector('#account-settings-form');
            let settingsName = document.querySelector('#settings-name');
            let settingsEmail = document.querySelector('#settings-email');
            let settingsCurrentPassword = document.querySelector('#settings-current-password');
            let settingsNewPassword = document.querySelector('#settings-new-password');
            let settingsConfirmPassword = document.querySelector('#settings-confirm-password');
            let settingsClose = document.querySelector('#close-account-settings');
            let settingsCancel = document.querySelector('#cancel-account-settings');
            let settingsPhoto = document.querySelector('#settings-photo');
            let settingsPhotoPreview = document.querySelector('#settings-photo-preview');
            let removeSettingsPhoto = document.querySelector('#remove-settings-photo');
            let pendingProfilePhoto = profilePhoto;

            const renderSettingsPhoto = (photo) => {
                settingsPhotoPreview.innerHTML = photo
                    ? `<img src="${photo}" alt="Profile photo preview">`
                    : '<i class="fas fa-user" aria-hidden="true"></i>';
            };

            if (settingsButton && settingsModal && settingsForm) {
                settingsButton.onclick = () => {
                    accountMenu.classList.remove('active');
                    accountToggle.setAttribute('aria-expanded', 'false');
                    settingsName.value = currentUser;
                    settingsEmail.value = currentUserRecord ? currentUserRecord.email : '';
                    pendingProfilePhoto = currentUserRecord?.profilePhoto || '';
                    renderSettingsPhoto(pendingProfilePhoto);
                    settingsCurrentPassword.value = '';
                    settingsNewPassword.value = '';
                    settingsConfirmPassword.value = '';
                    settingsModal.classList.add('active');
                };

                const closeSettings = () => settingsModal.classList.remove('active');
                settingsClose.onclick = closeSettings;
                settingsCancel.onclick = closeSettings;
                settingsModal.onclick = (event) => {
                    if (event.target === settingsModal) closeSettings();
                };

                settingsPhoto.onchange = () => {
                    let file = settingsPhoto.files[0];
                    if (!file) return;
                    if (!file.type.startsWith('image/')) {
                        showToast('Please choose an image file.');
                        settingsPhoto.value = '';
                        return;
                    }
                    if (file.size > 2 * 1024 * 1024) {
                        showToast('Profile photo must be 2 MB or smaller.');
                        settingsPhoto.value = '';
                        return;
                    }
                    let reader = new FileReader();
                    reader.onload = () => {
                        pendingProfilePhoto = reader.result;
                        renderSettingsPhoto(pendingProfilePhoto);
                    };
                    reader.readAsDataURL(file);
                };

                removeSettingsPhoto.onclick = () => {
                    pendingProfilePhoto = '';
                    settingsPhoto.value = '';
                    renderSettingsPhoto('');
                };

                settingsForm.onsubmit = (event) => {
                    event.preventDefault();
                    let updatedName = settingsName.value.trim();
                    let updatedEmail = settingsEmail.value.trim().toLowerCase();
                    let currentPassword = settingsCurrentPassword.value;
                    let newPassword = settingsNewPassword.value;
                    let confirmPassword = settingsConfirmPassword.value;
                    if (!updatedName) {
                        showToast('Please enter your name.');
                        return;
                    }
                    if (!updatedEmail || !settingsEmail.validity.valid) {
                        showToast('Please enter a valid email address.');
                        return;
                    }

                    let userRecord = registeredUsers.find(user => user.name === currentUser);
                    if (!userRecord) {
                        showToast('Account details could not be found.');
                        return;
                    }
                    let emailTaken = registeredUsers.some(user => user.email.toLowerCase() === updatedEmail && user !== userRecord);
                    if (emailTaken) {
                        showToast('That email address is already in use.');
                        return;
                    }
                    if (newPassword || confirmPassword || currentPassword) {
                        if (currentPassword !== userRecord.password) {
                            showToast('Enter your current password to change it.');
                            return;
                        }
                        if (newPassword.length < 6) {
                            showToast('New password must be at least 6 characters.');
                            return;
                        }
                        if (newPassword !== confirmPassword) {
                            showToast('New passwords do not match.');
                            return;
                        }
                        userRecord.password = newPassword;
                    }
                    userRecord.name = updatedName;
                    userRecord.email = updatedEmail;
                    userRecord.profilePhoto = pendingProfilePhoto;
                    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                    localStorage.setItem('currentUser', updatedName);
                    closeSettings();
                    showToast('Account settings saved.');
                    setTimeout(() => window.location.reload(), 700);
                };
            }
        } else {
            authContainer.innerHTML = `
                <a href="login.html" class="btn auth-action">Sign In</a>
                <a href="login.html" class="btn auth-action auth-outline">Sign Up</a>
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
    cartItemsContainer.innerHTML = cart.length === 0
        ? '<div class="empty-cart-state"><i class="fas fa-shopping-basket"></i><strong>Your cart is empty</strong><span>Add a dish before checking out.</span></div>'
        : '';
    
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

    let checkoutLinks = document.querySelectorAll('.checkout-btn');
    checkoutLinks.forEach(link => {
        let isEmpty = cart.length === 0;
        link.classList.toggle('is-disabled', isEmpty);
        link.setAttribute('aria-disabled', isEmpty);
    });

    let orderSubmit = document.querySelector('.order form button[type="submit"]');
    if (orderSubmit) {
        orderSubmit.disabled = cart.length === 0;
        orderSubmit.classList.toggle('is-disabled', cart.length === 0);
    }
}

document.querySelectorAll('.checkout-btn').forEach(link => {
    link.addEventListener('click', (event) => {
        if (cart.length === 0) {
            event.preventDefault();
            showToast('Your cart is empty! Add a dish before checking out.');
        }
    });
});

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
    let searchSuggestions = document.querySelector('#search-suggestions');
  
  if (closeSearchResults) {
      closeSearchResults.onclick = () => {
          searchResultsModal.classList.remove('active');
      }
  }

  if(searchFormEl && searchBoxEl) {
      const normalizeSearchText = (value) => value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();

      const getSearchMatches = (value) => {
          let normalizedValue = normalizeSearchText(value);
          if (!normalizedValue) return [];
          let terms = normalizedValue.split(/\s+/);
          let matches = [];
          let names = new Set();

          document.querySelectorAll('.dishes .box, .menu .box').forEach(box => {
              let title = box.querySelector('h3')?.innerText.trim() || '';
              let description = box.querySelector('p')?.innerText || '';
              let searchableText = normalizeSearchText(`${title} ${description}`);
              let titleWords = normalizeSearchText(title).split(/\s+/);
              let matchesPrefix = terms.every(term => titleWords.some(word => word.startsWith(term)));
              let matchesText = terms.every(term => searchableText.includes(term));

              let usePrefixSearch = normalizedValue.length === 1;
              if ((matchesPrefix || (!usePrefixSearch && matchesText)) && !names.has(title.toLowerCase())) {
                  names.add(title.toLowerCase());
                  matches.push(box);
              }
          });
          return matches;
      };

      const renderSearchSuggestions = () => {
          let query = searchBoxEl.value.trim();
          searchSuggestions.innerHTML = '';
          if (!query) {
              searchSuggestions.classList.remove('active');
              return;
          }

          let matches = getSearchMatches(query).slice(0, 6);
          matches.forEach(box => {
              let title = box.querySelector('h3')?.innerText.trim() || 'Dish';
              let image = box.querySelector('img')?.src || '';
              let price = box.querySelector('.price')?.innerText || '';
              let suggestion = document.createElement('button');
              suggestion.type = 'button';
              suggestion.className = 'search-suggestion';
              suggestion.innerHTML = `<img src="${image}" alt=""><span><strong>${title}</strong><small>${price}</small></span>`;
              suggestion.onclick = () => {
                  searchBoxEl.value = title;
                  executeSearch();
              };
              searchSuggestions.appendChild(suggestion);
          });

          searchSuggestions.classList.toggle('active', matches.length > 0);
      };

      const executeSearch = (e) => {
          if (e) e.preventDefault();
          let query = searchBoxEl.value.toLowerCase().trim();
          
          searchFormEl.classList.remove('active');
          
          if (query === '') {
              showToast('Please enter a menu name');
              return;
          }

          let normalizedQuery = normalizeSearchText(query);
          let allBoxes = getSearchMatches(query);
          let foundCount = 0;
          let addedNames = new Set();
          searchResultsContainer.innerHTML = '';
          
          allBoxes.forEach(box => {
              let titleElem = box.querySelector('h3');
              if(titleElem) {
                  let descriptionElem = box.querySelector('p');
                  let searchableText = `${titleElem.innerText} ${descriptionElem ? descriptionElem.innerText : ''}`
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '');
                  let rawTitle = titleElem.innerText.trim();
                  let matchesEveryWord = normalizedQuery.split(/\s+/).every(term => searchableText.includes(term));
                  if(matchesEveryWord && !addedNames.has(rawTitle.toLowerCase())) {
                      addedNames.add(rawTitle.toLowerCase());
                      let clonedBox = box.cloneNode(true);
                      
                      // Attach Add to Cart listener
                      let addToCartBtn = clonedBox.querySelector('.add-to-cart');
                      if (addToCartBtn) {
                          addToCartBtn.onclick = (ev) => {
                              ev.preventDefault();
                              if(!requireLogin()) return;
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
              let resultsTitle = document.querySelector('.search-results-title');
              if (resultsTitle) resultsTitle.innerText = `Search results for "${searchBoxEl.value.trim()}"`;
              searchResultsModal.classList.add('active');
              showToast('Found ' + foundCount + ' item' + (foundCount === 1 ? '' : 's') + ' for "' + query + '"');
          } else {
              let resultsTitle = document.querySelector('.search-results-title');
              if (resultsTitle) resultsTitle.innerText = 'No dishes found';
              showToast('Item "' + query + '" not found!');
          }
          
          searchBoxEl.value = ''; // clear input
          searchSuggestions.classList.remove('active');
      };

      searchFormEl.onsubmit = executeSearch;
      searchBoxEl.addEventListener('input', renderSearchSuggestions);
      
      if(searchLabelEl) {
          searchLabelEl.onclick = (e) => {
              if (searchBoxEl.value.trim() !== '') {
                  executeSearch(e);
              }
          }
      }
  }

    document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            searchFormEl?.classList.remove('active');
            searchResultsModal?.classList.remove('active');
    });

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

// Customer review form and rating
document.addEventListener('DOMContentLoaded', () => {
    let reviewForm = document.querySelector('#review-form');
    let reviewName = document.querySelector('#review-name');
    let reviewRating = document.querySelector('#review-rating');
    let reviewComment = document.querySelector('#review-comment');
    let ratingPicker = document.querySelector('#rating-picker');
    let customerReviews = document.querySelector('#customer-reviews');
    let reviewModal = document.querySelector('#review-form-modal');
    let openReviewButton = document.querySelector('#open-review-form');
    let closeReviewButton = document.querySelector('#close-review-form');
    if (!reviewForm || !ratingPicker || !customerReviews) return;

    let reviews = JSON.parse(localStorage.getItem('customerReviews')) || [];
    let editingReviewIndex = null;
    let savedName = localStorage.getItem('currentUser') || '';
    if (savedName) reviewName.value = savedName;

    const updateRatingButtons = (rating) => {
        ratingPicker.querySelectorAll('button').forEach(button => {
            let isSelected = Number(button.dataset.rating) <= rating;
            button.classList.toggle('selected', isSelected);
            button.setAttribute('aria-checked', button.dataset.rating === String(rating));
        });
    };

    ratingPicker.querySelectorAll('button').forEach(button => {
        button.setAttribute('role', 'radio');
        button.addEventListener('click', () => {
            reviewRating.value = button.dataset.rating;
            updateRatingButtons(Number(reviewRating.value));
        });
    });

    const renderStars = (rating) => {
        let stars = document.createElement('div');
        stars.className = 'stars';
        for (let index = 1; index <= 5; index += 1) {
            let star = document.createElement('i');
            star.className = index <= rating ? 'fas fa-star' : 'far fa-star';
            stars.appendChild(star);
        }
        return stars;
    };

    const renderReviews = () => {
        customerReviews.querySelectorAll('.customer-review-card').forEach(card => card.remove());
        reviews.forEach(review => {
            let card = document.createElement('div');
            card.className = 'box customer-review-card';

            let quote = document.createElement('i');
            quote.className = 'fas fa-quote-right';
            let user = document.createElement('div');
            user.className = 'user';
            let avatar = document.createElement('div');
            avatar.className = 'user-avatar';
            if (review.profilePhoto) {
                let image = document.createElement('img');
                image.src = review.profilePhoto;
                image.alt = `${review.name} profile photo`;
                avatar.appendChild(image);
            } else {
                let icon = document.createElement('i');
                icon.className = 'fas fa-user';
                avatar.appendChild(icon);
            }
            let userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            let name = document.createElement('h3');
            name.innerText = review.name;
            userInfo.append(name, renderStars(review.rating));
            user.append(avatar, userInfo);
            let comment = document.createElement('p');
            comment.innerText = review.comment;
            card.append(quote, user, comment);
            
            if (isLoggedIn() && localStorage.getItem('currentUser') === review.name) {
                let actions = document.createElement('div');
                actions.className = 'customer-review-actions';
                let editButton = document.createElement('button');
                editButton.type = 'button';
                editButton.className = 'review-edit-btn';
                editButton.dataset.reviewIndex = reviews.indexOf(review);
                editButton.innerHTML = '<i class="fas fa-pen"></i> Edit';
                let deleteButton = document.createElement('button');
                deleteButton.type = 'button';
                deleteButton.className = 'review-delete-btn';
                deleteButton.dataset.reviewIndex = reviews.indexOf(review);
                deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
                actions.append(editButton, deleteButton);
                card.appendChild(actions);
            }
            customerReviews.appendChild(card);
        });
    };

    customerReviews.addEventListener('click', (event) => {
        let editButton = event.target.closest('.review-edit-btn');
        let deleteButton = event.target.closest('.review-delete-btn');
        if (editButton) {
            editingReviewIndex = Number(editButton.dataset.reviewIndex);
            let review = reviews[editingReviewIndex];
            if (!isLoggedIn() || localStorage.getItem('currentUser') !== review.name) {
                showToast('You are not authorized to edit this review.');
                return;
            }
            reviewName.value = review.name;
            reviewComment.value = review.comment;
            reviewRating.value = review.rating;
            updateRatingButtons(review.rating);
            reviewModal?.classList.add('active');
            reviewName.focus();
        }
        if (deleteButton) {
            let reviewIndex = Number(deleteButton.dataset.reviewIndex);
            let review = reviews[reviewIndex];
            if (!isLoggedIn() || localStorage.getItem('currentUser') !== review.name) {
                showToast('You are not authorized to delete this review.');
                return;
            }
            if (!window.confirm('Delete this review?')) return;
            reviews.splice(reviewIndex, 1);
            localStorage.setItem('customerReviews', JSON.stringify(reviews));
            renderReviews();
            showToast('Review deleted.');
        }
    });

    reviewForm.onsubmit = (event) => {
        event.preventDefault();
        let name = reviewName.value.trim();
        let rating = Number(reviewRating.value);
        let comment = reviewComment.value.trim();
        if (!name || !comment || rating < 1 || rating > 5) {
            showToast('Please add your name, comment, and star rating.');
            return;
        }

        let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        let currentUser = users.find(user => user.name === localStorage.getItem('currentUser'));
        let reviewData = {
            name,
            rating,
            comment,
            profilePhoto: currentUser?.profilePhoto || '',
            createdAt: Date.now()
        };
        if (editingReviewIndex === null) {
            reviews.unshift(reviewData);
        } else {
            reviews[editingReviewIndex] = {
                ...reviews[editingReviewIndex],
                ...reviewData
            };
        }
        localStorage.setItem('customerReviews', JSON.stringify(reviews));
        renderReviews();
        reviewForm.reset();
        reviewRating.value = '';
        updateRatingButtons(0);
        if (savedName) reviewName.value = savedName;
        reviewModal?.classList.remove('active');
        showToast(editingReviewIndex === null ? 'Thank you for sharing your review!' : 'Review updated.');
        editingReviewIndex = null;
    };

    const closeReviewModal = () => reviewModal?.classList.remove('active');
    openReviewButton?.addEventListener('click', () => {
        if (!requireLogin()) return;
        editingReviewIndex = null;
        reviewForm.reset();
        reviewRating.value = '';
        updateRatingButtons(0);
        if (savedName) reviewName.value = savedName;
        reviewModal?.classList.add('active');
        reviewName.focus();
    });
    closeReviewButton?.addEventListener('click', () => {
        editingReviewIndex = null;
        closeReviewModal();
    });
    reviewModal?.addEventListener('click', (event) => {
        if (event.target === reviewModal) {
            editingReviewIndex = null;
            closeReviewModal();
        }
    });

    renderReviews();
});

// Why Choose Us detail modal
document.addEventListener('DOMContentLoaded', () => {
    let serviceModal = document.querySelector('#service-detail-modal');
    let closeServiceModal = document.querySelector('#close-service-detail');
    let serviceTitle = document.querySelector('#service-detail-title');
    let serviceDescription = document.querySelector('#service-detail-description');
    let serviceIcon = document.querySelector('#service-detail-icon');
    let serviceDetails = {
        delivery: {
            title: 'Free delivery',
            icon: 'fas fa-shipping-fast',
            description: 'Enjoy your Bistro Eleven favorites at home with free delivery on every order. We pack each meal carefully so it arrives fresh, warm, and ready to enjoy.'
        },
        payments: {
            title: 'Easy payments',
            icon: 'fas fa-dollar-sign',
            description: 'Ordering stays simple from start to finish. Choose the payment method that works for you.\n\nPayment methods:\n- Cash on Delivery (COD)\n- Bank Transfer (BCA / Mandiri)\n- E-Wallet (OVO / GoPay / Dana)'
        },
        support: {
            title: '24/7 service',
            icon: 'fas fa-headset',
            description: 'Our support team is here whenever you need a hand with an order or menu question.\n\nContact us:\n- Phone: +62 21-555-0199\n- WhatsApp: +62 812-3456-7890\n- Email: hello@bistroeleven.com'
        }
    };

    if (!serviceModal || !closeServiceModal) return;

    const openServiceDetails = (card) => {
        let detail = serviceDetails[card.dataset.service];
        if (!detail) return;
        serviceIcon.innerHTML = `<i class="${detail.icon}" aria-hidden="true"></i>`;
        serviceTitle.innerText = detail.title;
        serviceDescription.innerText = detail.description;
        serviceModal.classList.add('active');
    };

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => openServiceDetails(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openServiceDetails(card);
            }
        });
    });

    const closeServiceDetails = () => serviceModal.classList.remove('active');
    closeServiceModal.onclick = closeServiceDetails;
    serviceModal.onclick = (event) => {
        if (event.target === serviceModal) closeServiceDetails();
    };
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
