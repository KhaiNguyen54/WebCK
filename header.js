const headerHTML = `
    <nav class="glass-nav">
        <div class="nav-container">
            <a href="index.html" class="logo">
                <img src="hinhanh/logo.png" alt="Logo">
                <span style="color: white; font-weight: bold; font-size: 20px;">HAYKHANGOI</span>
            </a>
            
            <div class="menu-toggle" id="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </div>

            <div style="display:flex; align-items:center;">
                <ul class="nav-menu" id="navMenu">
                    <li><a href="index.html">Trang chủ</a></li>
                    <li><a href="shop.html">Cửa hàng</a></li>
                    <li><a href="gioithieu.html">Về chúng tôi</a></li>
                    <li>
                        <a href="giohang.html">
                            <i class="fas fa-shopping-cart"></i> 
                            <span id="cart-count" style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 50%; font-size: 11px; display: none;">0</span>
                        </a>
                    </li>
                </ul>

                <div id="user-area" style="margin-left: 20px;">
                    <a href="taikhoan.html" class="btn-login-nav">ĐĂNG NHẬP</a>
                </div>
            </div>
        </div>
    </nav>
`;

document.getElementById('header-placeholder').innerHTML = headerHTML;

// --- HÀM CẬP NHẬT GIỎ HÀNG ---
function updateHeaderCartCount() {
    try {
        let cart = JSON.parse(localStorage.getItem('user_cart')) || [];
        const countSpan = document.getElementById('cart-count');
        if (countSpan) {
            countSpan.innerText = cart.length;
            countSpan.style.display = cart.length > 0 ? 'inline-block' : 'none';
        }
    } catch (e) { console.error(e); }
}

document.addEventListener("DOMContentLoaded", function() {
    updateHeaderCartCount();

    // Highlight menu active
    const currentPath = window.location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll('.nav-menu li a');
    menuItems.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Mobile Menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('navMenu');
    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Xử lý Hiển thị User (Đã bỏ Số dư & Nạp tiền)
    const user = localStorage.getItem('currentUser');
    const userArea = document.getElementById('user-area');

    if (user && userArea) {
        // Lấy tên hiển thị
        let accounts = JSON.parse(localStorage.getItem('list_accounts')) || [];
        let acc = accounts.find(a => a.username === user);
        let fullname = acc ? (acc.fullname || user) : user;

        userArea.innerHTML = `
            <div class="user-dropdown-container">
                <div class="user-trigger">
                    <img src="hinhanh/avatar-default.jpg" onerror="this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png'" class="nav-avatar">
                    <span class="nav-username">${user}</span>
                    <i class="fas fa-caret-down" style="color:#94a3b8; font-size:12px;"></i>
                </div>

                <div class="dropdown-menu">
                    <div class="dropdown-header-info">
                        <img src="hinhanh/avatar-default.jpg" onerror="this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png'" class="big-avatar">
                        <div class="user-details">
                            <h4>${fullname}</h4>
                            <span>Thành viên</span>
                        </div>
                    </div>

                    <ul class="menu-options">
                        <li><a href="lichsu.html"><i class="fas fa-history"></i> Lịch sử đơn hàng</a></li>
                        <li><a href="lienhehotro.html"><i class="fas fa-headset"></i> Trung tâm trợ giúp</a></li>
                        <li><a href="#" onclick="handleLogout()"><i class="fas fa-sign-out-alt" style="color: #ef4444;"></i> Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        `;
    }
});

window.handleLogout = function() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}