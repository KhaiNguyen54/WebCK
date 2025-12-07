import { db, ref, onValue, update, push, child, set, get } from './js/config.js';

// CẤU HÌNH
const BANK_ACCOUNT = "19038467737013"; 
const BANK_NAME = "Techcombank"; 
const BANK_USER = "LE MINH KHANG";
let globalProducts = [];

// ÂM THANH (Đảm bảo file success.mp3 có trong thư mục hinhanh)
const successAudio = new Audio('sound/donate.mp3');

// 1. KHỞI TẠO SHOP
window.initShopByUrl = function() {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = '<div style="color:white;text-align:center;width:100%;margin-top:50px"><i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>';
    const urlParams = new URLSearchParams(window.location.search);
    const gameType = urlParams.get('game') || 'all';
    updateHeroBanner(gameType);

    onValue(ref(db, 'products'), (snapshot) => {
        const data = snapshot.val();
        if (!data) { grid.innerHTML = '<div style="text-align:center;color:#94a3b8">Chưa có sản phẩm.</div>'; return; }
        let allProds = [];
        Object.keys(data).forEach(gameKey => {
            if(Array.isArray(data[gameKey])) {
                const items = data[gameKey].map((item, index) => ({ ...item, category: gameKey, dbIndex: index }));
                allProds = allProds.concat(items);
            }
        });
        if(gameType !== 'all') globalProducts = allProds.filter(p => p.category === gameType);
        else globalProducts = allProds;
        const availableProducts = globalProducts.filter(p => p.status !== 'sold');
        if(availableProducts.length === 0) grid.innerHTML = '<div style="text-align:center;color:#94a3b8">Hết hàng.</div>';
        else renderProducts(availableProducts);
    });
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; 
    products.forEach(p => {
        const price = new Intl.NumberFormat('vi-VN').format(p.price) + 'đ';
        const img = p.img || 'hinhanh/logo.png';
        const html = `
            <div class="product-card">
                <a href="chitiet.html?id=${p.id}&game=${p.category}" class="card-thumb">
                    <span class="id-badge">#${p.id}</span>
                    <img src="${img}" onerror="this.src='hinhanh/logo.png'">
                </a>
                <div class="card-details">
                    <div class="card-price">${price}</div>
                    <a href="#" class="card-title">${p.title}</a>
                    <ul class="card-attributes"><li>Rank: ${p.rank}</li><li>Skin: ${p.skin}</li></ul>
                </div>
                <div style="display:flex;">
                    <a href="chitiet.html?id=${p.id}&game=${p.category}" style="flex:1;background:#334155;color:white;text-align:center;padding:12px;text-decoration:none;font-weight:bold;font-size:13px;border-radius:0 0 0 12px">CHI TIẾT</a>
                    <button class="btn-buy-now" onclick="window.addToCart('${p.id}')" style="flex:1;border-radius:0 0 12px 0">THÊM</button>
                </div>
            </div>`;
        grid.innerHTML += html;
    });
}

// 2. CHECKOUT & LẮNG NGHE ADMIN
window.checkout = function() {
    const user = localStorage.getItem('currentUser');
    if (!user) { alert("Vui lòng đăng nhập!"); window.location.href = "taikhoan.html"; return; }

    let cart = JSON.parse(localStorage.getItem('user_cart')) || [];
    if (cart.length === 0) return alert("Giỏ hàng trống!");

    const totalPrice = cart.reduce((t, i) => t + parseInt(i.price), 0);
    const orderCode = "DH" + Math.floor(100000 + Math.random() * 900000);
    
    const orderData = {
        code: orderCode, amount: totalPrice, user: user, cart: cart, 
        time: new Date().toLocaleString('vi-VN'), status: 'pending'
    };
    
    push(ref(db, 'orders/pending'), orderData).then((snap) => {
        const orderKey = snap.key;
        const qrUrl = `https://img.vietqr.io/image/${BANK_NAME}-${BANK_ACCOUNT}-compact.png?amount=${totalPrice}&addInfo=${orderCode}&accountName=${BANK_USER}`;
        document.getElementById('qr-code-img').src = qrUrl;
        document.getElementById('pay-amount').innerText = totalPrice.toLocaleString() + "đ";
        document.getElementById('pay-content').innerText = orderCode;
        
        // Reset Modal: Hiện QR, Ẩn Success
        document.getElementById('payment-modal-body').style.display = 'block';
        document.getElementById('success-modal-body').style.display = 'none';
        document.getElementById('payment-modal').style.display = 'flex';
        
        localStorage.removeItem('user_cart');
        if(window.updateHeaderCartCount) window.updateHeaderCartCount();

        // 🔥 BẮT ĐẦU CHỜ DUYỆT 🔥
        waitForApproval(orderKey);
    }).catch(err => alert("Lỗi tạo đơn: " + err));
}

// --- HÀM QUAN TRỌNG: LẮNG NGHE ADMIN DUYỆT ---
function waitForApproval(orderKey) {
    const completedRef = ref(db, 'orders/completed/' + orderKey);
    onValue(completedRef, (snapshot) => {
        if (snapshot.exists()) {
            const order = snapshot.val();
            
            // 1. Tính toán quà tặng để hiển thị
            const accCount = (order.cart && Array.isArray(order.cart)) ? order.cart.length : 0;
            const bonusSpins = accCount * 2;

            // 2. Cập nhật nội dung thông báo
            const msgEl = document.getElementById('success-msg');
            if(msgEl) {
                msgEl.innerHTML = `
                    Bạn đã mua thành công <strong style="color:white">${accCount} Acc</strong>.<br>
                    Quà tặng: Nhận thêm <strong style="color:#facc15; font-size:18px">${bonusSpins} LƯỢT QUAY</strong>!<br>
                    <span style="font-size:13px;color:#94a3b8;font-style:italic">(Đang chuyển hướng lấy Acc...)</span>
                `;
            }

            // 3. Phát nhạc và đổi giao diện
            successAudio.play().catch(e => console.log("Audio auto-play blocked by browser")); 
            document.getElementById('payment-modal-body').style.display = 'none';
            document.getElementById('success-modal-body').style.display = 'block';

            // 4. Chuyển hướng sau 4 giây
            setTimeout(() => {
                window.location.href = "lichsu.html";
            }, 4000);
        }
    });
}

// 3. CÁC HÀM PHỤ (Giữ nguyên)
window.addToCart = function(id) {
    if (globalProducts.length === 0) return alert("Dữ liệu đang tải...");
    const p = globalProducts.find(x => x.id == id);
    if (!p) return alert("Lỗi sản phẩm!");
    if (p.status === 'sold') return alert("Sản phẩm này đã bán rồi!");
    let cart = JSON.parse(localStorage.getItem('user_cart')) || [];
    if (cart.some(x => x.id == id)) return alert("Đã có trong giỏ!");
    cart.push(p);
    localStorage.setItem('user_cart', JSON.stringify(cart));
    if(window.updateHeaderCartCount) window.updateHeaderCartCount();
    alert("✅ Đã thêm vào giỏ!");
}

window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('user_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('user_cart', JSON.stringify(cart));
    renderCartPage();
    if(window.updateHeaderCartCount) window.updateHeaderCartCount();
}

window.renderCartPage = function() {
    const tbody = document.getElementById('cart-items-body');
    const totalEl = document.getElementById('total-price');
    if (!tbody) return;
    let cart = JSON.parse(localStorage.getItem('user_cart')) || [];
    tbody.innerHTML = '';
    let total = 0;
    if(cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px">Giỏ hàng trống</td></tr>';
        totalEl.innerText = '0đ';
        return;
    }
    cart.forEach((item, i) => {
        total += parseInt(item.price);
        tbody.innerHTML += `<tr><td style="text-align:center"><img src="${item.img||'hinhanh/logo.png'}" class="cart-item-img"></td><td><div style="font-weight:bold;color:white">${item.title}</div></td><td style="color:#10b981;font-weight:bold">${parseInt(item.price).toLocaleString()}đ</td><td style="text-align:center"><button onclick="window.removeFromCart(${i})" class="btn-remove"><i class="fas fa-trash"></i></button></td></tr>`;
    });
    totalEl.innerText = total.toLocaleString() + 'đ';
}

window.closePaymentModal = () => { document.getElementById('payment-modal').style.display = 'none'; }
window.copyContent = () => { navigator.clipboard.writeText(document.getElementById('pay-content').innerText); alert("Đã sao chép nội dung!"); }

const pageInfo = {
    lienquan: { title: "LIÊN QUÂN MOBILE", img: "hinhanh/lienquanmobile.jpg" },
    freefire: { title: "FREE FIRE", img: "hinhanh/freefire.png" },
    genshin: { title: "GENSHIN IMPACT", img: "hinhanh/genshinimpact.jpg" },
    valorant: { title: "VALORANT VNG", img: "hinhanh/valorant.jpg" },
    fconline: { title: "FC ONLINE", img: "hinhanh/fconline.jpg" },
    roblox: { title: "ROBLOX", img: "hinhanh/roblox.jpg" },
    all: { title: "TẤT CẢ CÁC GAME", img: "hinhanh/background.jpg" }
};
function updateHeroBanner(gameKey) {
    const info = pageInfo[gameKey] || pageInfo.all;
    const t = document.getElementById('hero-title');
    const i = document.getElementById('hero-img');
    if(t) t.innerText = info.title;
    if(i) i.src = info.img;
}
window.applyFilter = function() {
    const pVal = document.getElementById('priceFilter').value;
    const txt = document.getElementById('searchInput').value.toLowerCase();
    const filtered = globalProducts.filter(p => {
        if(p.status === 'sold') return false;
        let passPrice = true;
        if (pVal !== 'all') { if (pVal == '5000000') passPrice = p.price >= 1000000; else passPrice = p.price <= parseInt(pVal); }
        let passSearch = true;
        if (txt) passSearch = (p.title && p.title.toLowerCase().includes(txt));
        return passPrice && passSearch;
    });
    renderProducts(filtered);
}
if(typeof initShopByUrl === 'function') { document.addEventListener('DOMContentLoaded', () => { initShopByUrl(); renderCartPage(); }); }