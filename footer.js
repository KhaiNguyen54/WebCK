const footerHTML = `
    <footer>
        <div class="footer-container">
            <div class="footer-col">
                <img src="hinhanh/logo.png" alt="Logo" style="height: 60px; margin-bottom: 20px;">
                <div class="footer-desc">
                    <p><strong>HAYKHANGOI</strong></p>
                    <p>Hệ thống bán acc game tự động uy tín số 1. Giao dịch nhanh chóng, bảo mật tuyệt đối.</p>
                    <p><i class="fas fa-check-circle" style="color: #10b981;"></i> Uy tín đặt lên hàng đầu</p>
                    <p><i class="fas fa-headset" style="color: #10b981;"></i> Hỗ trợ 24/7</p>
                </div>
            </div>

            <div class="footer-col">
                <h3>Về Chúng Tôi</h3>
                <div class="footer-links">
                    <a href="dieukhoan.html">Điều khoản sử dụng</a>
                    <a href="chinhsachbaomat.html">Chính sách bảo mật</a>
                    <a href="tuyendung.html">Tuyển dụng</a>
                    <a href="lienhehotro.html">Liên hệ hỗ trợ</a>
                </div>
            </div>

            <div class="footer-col">
                <h3>Kết Nối</h3>
                <div class="social-icons">
                    <a href="https://www.facebook.com/MixiGaming" target="_blank"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://www.tiktok.com/@mixigaming" target="_blank"><i class="fab fa-tiktok"></i></a>
                    <a href="https://www.youtube.com/@MixiGaming3con" target="_blank"><i class="fab fa-youtube"></i></a>
                    <a href="https://discord.com/invite/mixigaming" target="_blank"><i class="fab fa-discord"></i></a>
                </div>
            </div>
        </div>
        <div class="copyright">
            © Copyright 2025 - Designed by BitByBit
        </div>
    </footer>

    <div class="floating-buttons">
        <a href="#" class="float-btn btn-up" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;"><i class="fas fa-arrow-up"></i></a>
        <a href="https://discord.com/invite/mixigaming" target="_blank" class="float-btn btn-discord"><i class="fab fa-discord"></i></a>
        <a href="https://www.facebook.com/MixiGaming" target="_blank" class="float-btn btn-mess"><i class="fab fa-facebook-messenger"></i></a>
    </div>
`;

document.getElementById('footer-placeholder').innerHTML = footerHTML;
const notifyDiv = document.createElement('div');
notifyDiv.id = 'fake-notify';
notifyDiv.className = 'fake-notify';
document.body.appendChild(notifyDiv);
const randomNames = ["domixi", "moxumxue", "oii", "conchocaobangbopc", "phungthanhdo", "dangdungthanhno", "cungcanhmo", "taybocha", "hutshisa"];
const randomActions = [
    "vừa mua Acc Liên Quân Rank Cao Thủ",
    "vừa nạp thẻ Viettel 50.000đ",
    "vừa mua Acc Free Fire VIP",
    "vừa quay trúng 999 Kim Cương",
    "vừa mua Acc Genshin Impact AR55"
];
function showFakeNotify() {
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];
    const action = randomActions[Math.floor(Math.random() * randomActions.length)];
    const notify = document.getElementById('fake-notify');
    
    if(notify) {
        notify.innerHTML = `
            <div>
                <i class="fas fa-check-circle" style="color: #10b981; margin-right: 5px;"></i>
                <strong>${name}</strong> ${action}
                <span class="time">Vừa xong</span>
            </div>
        `;
        
        notify.style.display = 'block';
        setTimeout(() => {
            notify.style.display = 'none';
        }, 4000); 
    }
}
setTimeout(showFakeNotify, 5000);
setInterval(() => {
    showFakeNotify();
}, Math.random() * 10000 + 10000); 