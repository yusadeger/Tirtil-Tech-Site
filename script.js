document.addEventListener('DOMContentLoaded', () => {
    // Yükleme ekranı
    setTimeout(() => {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }, 2000);

    // Footer Particles animasyonu
    if (typeof particlesJS !== 'undefined') {
        particlesJS('footer-particles', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#22c55e'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#22c55e',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 3,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }

    // Şirket logoları için sonsuz kaydırma
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        let isResetting = false;
        sliderContainer.addEventListener('animationend', () => {
            if (isResetting) return;
            isResetting = true;
            requestAnimationFrame(() => {
                sliderContainer.style.animation = 'none';
                sliderContainer.style.transform = 'translateX(0)';
                requestAnimationFrame(() => {
                    sliderContainer.style.animation = 'slide 10s linear infinite';
                    isResetting = false;
                });
            });
        });
    }

    // AOS Başlatma (Ekrana gelince animasyon)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Ana sayfa Typed.js animasyonu
    new Typed('#typed-text', {
        strings: [
            'Tek Çözüm,',
            'Tutkuya Birlikte,',
            'Tam Zamanında.',
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        cursorChar: '|',
        className: 'text-green-600',
        cursorClassName: 'text-green-600'
    });

    // Mobil Menü Açma/Kapama
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Sayfa kaymasını engelle
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    
        // Menü açıkken dışına tıklanınca kapatma
        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
    
    // Nav link'lere tıklandığında mobil menüyü kapat
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Portfolio Carousel başlatma
    initPortfolioCarousel();
});

// Portfolio Carousel Fonksiyonu
// Tamamen Yenilenmiş Portfolio Carousel Fonksiyonu
function initPortfolioCarousel() {
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const container = document.querySelector('.carousel-container');
    
    if (!track || !prevButton || !nextButton || !container) return;
    
    const cards = Array.from(track.children);
    let currentIndex = 0;
    let slidesPerView = 3; // Varsayılan olarak masaüstü için 3 kart
    let slideWidth = 0;
    let trackWidth = 0;
    
    // İlk yükleme ve pencere yeniden boyutlandırma için yapılandırma
    function setupCarousel() {
        // Ekran genişliğine göre gösterilecek slayt sayısını ayarla
        if (window.innerWidth < 640) {
            slidesPerView = 1;
        } else if (window.innerWidth < 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        
        // Kart genişliğini hesapla
        const containerWidth = container.offsetWidth;
        const gap = 24; // 1.5rem = 24px
        slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
        
        // Kartların genişliğini ayarla
        cards.forEach(card => {
            card.style.flex = `0 0 ${slideWidth}px`;
            card.style.width = `${slideWidth}px`;
        });
        
        // Track genişliğini ayarla
        trackWidth = (slideWidth * cards.length) + (gap * (cards.length - 1));
        track.style.width = `${trackWidth}px`;
        
        // İndeksi ve kaydırma konumunu sıfırla
        currentIndex = 0;
        updateCarouselPosition();
    }
    
    // Carousel'i istenen indekse göre kaydır
    function updateCarouselPosition() {
        // Gösterilecek maksimum indeksi sınırla
        const maxIndex = Math.max(0, cards.length - slidesPerView);
        
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        
        // Carousel konumunu güncelle
        const gap = 24; // 1.5rem = 24px
        const offset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        
        // Buton durumlarını güncelle
        prevButton.disabled = currentIndex <= 0;
        nextButton.disabled = currentIndex >= maxIndex;
        
        // Görsel geri bildirim için opaklık ayarı
        prevButton.style.opacity = prevButton.disabled ? '0.6' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.6' : '1';
    }
    
    // Önceki slide'a git
    function goToPrevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarouselPosition();
        }
    }
    
    // Sonraki slide'a git
    function goToNextSlide() {
        const maxIndex = Math.max(0, cards.length - slidesPerView);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarouselPosition();
        }
    }
    
    // İstenen indekse git (gösterge noktaları için)
    function goToSlide(index) {
        currentIndex = index;
        updateCarouselPosition();
    }
    
    // Otomatik gösterge noktaları oluştur (isteğe bağlı)
    function createIndicators() {
        const maxIndex = Math.max(0, cards.length - slidesPerView + 1);
        if (maxIndex <= 1) return; // Tek sayfa varsa göstergelere gerek yok
        
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'carousel-indicators';
        
        for (let i = 0; i < maxIndex; i++) {
            const dot = document.createElement('span');
            dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                goToSlide(i);
                updateIndicators();
            });
            indicatorsContainer.appendChild(dot);
        }
        
        // Container'ın sonuna ekle
        const carouselWrapper = container.closest('.carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.appendChild(indicatorsContainer);
        }
    }
    
    // Gösterge noktalarını güncelle
    function updateIndicators() {
        const indicators = document.querySelectorAll('.indicator-dot');
        if (indicators.length === 0) return;
        
        indicators.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Dokunmatik kaydırma desteği
    let startX, moveX;
    let isPointerDown = false;
    
    function handlePointerStart(e) {
        isPointerDown = true;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        track.style.transition = 'none'; // Kaydırma sırasında animasyonu kapat
    }
    
    function handlePointerMove(e) {
        if (!isPointerDown) return;
        
        e.preventDefault();
        moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diffX = moveX - startX;
        
        // Mevcut offset'e dokunmatik hareketi ekle
        const gap = 24; // 1.5rem = 24px
        const currentOffset = currentIndex * (slideWidth + gap);
        const newOffset = Math.max(0, Math.min(trackWidth - container.offsetWidth, currentOffset - diffX));
        
        track.style.transform = `translateX(-${newOffset}px)`;
    }
    
    function handlePointerEnd(e) {
        if (!isPointerDown) return;
        isPointerDown = false;
        
        track.style.transition = 'transform 0.5s cubic-bezier(0.215, 0.610, 0.355, 1)';
        
        if (moveX) {
            const diffX = moveX - startX;
            const threshold = slideWidth / 4; // Kaydırma eşiği
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    goToPrevSlide();
                } else {
                    goToNextSlide();
                }
            } else {
                // Eşik değeri aşılmadıysa mevcut konuma geri dön
                updateCarouselPosition();
            }
        }
        
        moveX = null;
    }
    
    // Düğme olay dinleyicileri
    prevButton.addEventListener('click', goToPrevSlide);
    nextButton.addEventListener('click', goToNextSlide);
    
    // Dokunmatik olay dinleyicileri
    track.addEventListener('touchstart', handlePointerStart, { passive: false });
    track.addEventListener('touchmove', handlePointerMove, { passive: false });
    track.addEventListener('touchend', handlePointerEnd);
    
    // Fare olay dinleyicileri
    track.addEventListener('mousedown', handlePointerStart);
    track.addEventListener('mousemove', handlePointerMove);
    track.addEventListener('mouseup', handlePointerEnd);
    track.addEventListener('mouseleave', handlePointerEnd);
    
    // Carousel'i ilk kur
    setupCarousel();
    createIndicators(); // İsteğe bağlı göstergeler
    
    // Pencere yeniden boyutlandırma olayını dinle
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setupCarousel();
            updateIndicators();
        }, 200);
    });
    
    // Sürükleme sırasında varsayılan davranışı engelle
    track.addEventListener('dragstart', (e) => e.preventDefault());
}
// Portfolio Carousel için mobil uyumlu JavaScript
function initPortfolioCarousel() {
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const container = document.querySelector('.carousel-container');
    
    if (!track || !prevButton || !nextButton || !container) return;
    
    const cards = Array.from(track.children);
    let currentIndex = 0;
    let slidesPerView = 3; // Varsayılan olarak masaüstü için 3 kart
    let slideWidth = 0;
    let trackWidth = 0;
    let isMobile = false;
    
    // İlk yükleme ve pencere yeniden boyutlandırma için yapılandırma
    function setupCarousel() {
        // Ekran genişliğine göre gösterilecek slayt sayısını ayarla
        if (window.innerWidth < 480) {
            slidesPerView = 1;
            isMobile = true;
        } else if (window.innerWidth < 768) {
            slidesPerView = 1;
            isMobile = true;
        } else if (window.innerWidth < 1024) {
            slidesPerView = 2;
            isMobile = false;
        } else {
            slidesPerView = 3;
            isMobile = false;
        }
        
        // Kart genişliğini hesapla
        const containerWidth = container.offsetWidth;
        const gap = isMobile ? 16 : 24; // Mobilde daha az boşluk
        
        // Kartlar arasındaki boşluğu hesaba katarak genişliği ayarla
        slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
        
        // Kartların genişliğini ayarla
        cards.forEach(card => {
            card.style.flex = `0 0 ${slideWidth}px`;
            card.style.width = `${slideWidth}px`;
            
            // Mobil cihazlarda içeriği düzgün göster
            if (isMobile) {
                const title = card.querySelector('.project-title');
                const description = card.querySelector('.project-description');
                
                if (title) {
                    // Başlığın düzgün görünmesini sağla
                    title.style.width = '100%';
                    title.style.overflow = 'hidden';
                    title.style.textOverflow = 'ellipsis';
                }
                
                if (description) {
                    // Açıklamanın düzgün görünmesini sağla
                    description.style.webkitLineClamp = '2';
                    description.style.overflow = 'hidden';
                }
            }
        });
        
        // Track genişliğini ayarla
        trackWidth = (slideWidth * cards.length) + (gap * (cards.length - 1));
        track.style.width = `${trackWidth}px`;
        
        // Mobil cihazlarda kaydırmayı düzelt
        if (isMobile) {
            track.style.gap = '16px'; // Daha az boşluk
        } else {
            track.style.gap = '24px'; 
        }
        
        // İndeksi ve kaydırma konumunu düzelt
        const maxIndex = Math.max(0, cards.length - slidesPerView);
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        
        updateCarouselPosition();
    }
    
    // Carousel'i istenen indekse göre kaydır
    function updateCarouselPosition() {
        // Gösterilecek maksimum indeksi sınırla
        const maxIndex = Math.max(0, cards.length - slidesPerView);
        
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        
        // Carousel konumunu güncelle
        const gap = isMobile ? 16 : 24;
        const offset = currentIndex * (slideWidth + gap);
        
        // Animasyonlu kaydırma
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${offset}px)`;
        
        // Buton durumlarını güncelle
        prevButton.disabled = currentIndex <= 0;
        nextButton.disabled = currentIndex >= maxIndex;
        
        // Görsel geri bildirim için opaklık ayarı
        prevButton.style.opacity = prevButton.disabled ? '0.6' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.6' : '1';
        
        // Gösterge noktalarını güncelle (varsa)
        updateIndicators();
    }
    
    // Önceki karta git
    function goToPrevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarouselPosition();
        }
    }
    
    // Sonraki karta git
    function goToNextSlide() {
        const maxIndex = Math.max(0, cards.length - slidesPerView);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarouselPosition();
        }
    }
    
    // Gösterge noktalarını güncelle
    function updateIndicators() {
        const indicators = document.querySelectorAll('.indicator-dot');
        if (indicators.length === 0) return;
        
        indicators.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Gösterge noktaları oluştur
    function createIndicators() {
        const maxIndex = Math.max(0, cards.length - slidesPerView + 1);
        if (maxIndex <= 1) return; // Tek sayfa varsa göstergelere gerek yok
        
        // Önceki göstergeleri temizle
        const existingIndicators = document.querySelector('.carousel-indicators');
        if (existingIndicators) {
            existingIndicators.remove();
        }
        
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'carousel-indicators';
        
        for (let i = 0; i < maxIndex; i++) {
            const dot = document.createElement('span');
            dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarouselPosition();
            });
            indicatorsContainer.appendChild(dot);
        }
        
        // Container'ın sonuna ekle
        const carouselWrapper = container.closest('.carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.appendChild(indicatorsContainer);
        }
    }
    
    // Dokunmatik kaydırma desteği
    let startX, moveX;
    let isSwiping = false;
    
    function handleTouchStart(e) {
        isSwiping = true;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        track.style.transition = 'none'; // Kaydırma sırasında ani geçişi kapat
    }
    
    function handleTouchMove(e) {
        if (!isSwiping) return;
        
        moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diffX = moveX - startX;
        
        // Sayfanın kaydırılmasını engelle
        if (Math.abs(diffX) > 10) {
            e.preventDefault();
        }
        
        // Mevcut konuma göre hareket
        const gap = isMobile ? 16 : 24;
        const currentOffset = currentIndex * (slideWidth + gap);
        const newOffset = Math.max(0, Math.min(trackWidth - container.offsetWidth, currentOffset - diffX));
        
        track.style.transform = `translateX(-${newOffset}px)`;
    }
    
    function handleTouchEnd() {
        if (!isSwiping) return;
        isSwiping = false;
        
        track.style.transition = 'transform 0.5s ease';
        
        if (!moveX) return;
        
        const diffX = moveX - startX;
        const threshold = slideWidth / 3; // Kaydırma eşiği
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                goToPrevSlide();
            } else {
                goToNextSlide();
            }
        } else {
            // Eşik değeri aşılmadıysa mevcut konuma geri dön
            updateCarouselPosition();
        }
        
        moveX = null;
    }
    
    // Mobil cihazlarda overflow sorununu çöz
    function fixMobileOverflow() {
        if (isMobile) {
            // Taşma sorunlarını önle
            cards.forEach(card => {
                const content = card.querySelector('.project-content');
                if (content) {
                    content.style.overflow = 'hidden';
                }
            });
        }
    }
    
    // Düğme olay dinleyicileri
    prevButton.addEventListener('click', goToPrevSlide);
    nextButton.addEventListener('click', goToNextSlide);
    
    // Dokunmatik olay dinleyicileri
    track.addEventListener('touchstart', handleTouchStart, { passive: false });
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    track.addEventListener('touchend', handleTouchEnd);
    
    // Fare olay dinleyicileri
    track.addEventListener('mousedown', handleTouchStart);
    track.addEventListener('mousemove', handleTouchMove);
    track.addEventListener('mouseup', handleTouchEnd);
    track.addEventListener('mouseleave', handleTouchEnd);
    
    // Carousel'i ilk kur
    setupCarousel();
    createIndicators();
    fixMobileOverflow();
    
    // Pencere yeniden boyutlandırma olayını dinle
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setupCarousel();
            createIndicators();
            fixMobileOverflow();
        }, 200);
    });
    
    // Sürükleme sırasında varsayılan davranışı engelle
    track.addEventListener('dragstart', (e) => e.preventDefault());
}
// Hakkımızda Bölümü Sekmeleri
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Tüm sekme butonlarından active sınıfını kaldır
        tabButtons.forEach(btn => {
            btn.classList.remove('active', 'text-green-700', 'border-green-600');
            btn.classList.add('text-gray-600', 'border-transparent');
        });

        // Tüm sekme içeriklerini gizle
        tabContents.forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('active');
        });

        // Tıklanan sekme butonunu aktif yap
        button.classList.add('active', 'text-green-700', 'border-green-600');
        button.classList.remove('text-gray-600', 'border-transparent');

        // İlgili içeriği göster
        const tabId = button.getAttribute('data-tab');
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.remove('hidden');
            activeContent.classList.add('active');
        }
    });
});

// Form gönderimi
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.remove('hidden');
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 3000);
        }
    });
}

// Büyü efekti (Magic) için parçacıklar oluştur
document.addEventListener("DOMContentLoaded", function() {
    const magicContainer = document.querySelector(".magic");
    if (magicContainer) {
        for (let i = 0; i < 12; i++) {
            let sparkle = document.createElement("span");
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
            magicContainer.appendChild(sparkle);
        }
    }
});

// Kaydırma olayında navbar stilini değiştir
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    const logo = navbar.querySelector('.logo');
    
    if (window.scrollY > 50) {
        logo.classList.add('logo-small');
        navbar.classList.add('navbar-scrolled');
    } else {
        logo.classList.remove('logo-small');
        navbar.classList.remove('navbar-scrolled');
    }
});

// Düzgün kaydırma (Smooth Scroll) fonksiyonu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return; // Ana sayfa linki ise işlem yapma
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100, // Navbar yüksekliği için offset
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobil Menü
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;
    
    // Mobil menü aç
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // İkonu değiştir
            if (menuIcon) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            }
        });
    }
    
    // Mobil menü kapat
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // İkonu geri değiştir
            if (menuIcon) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }
    
    // Menü dışına tıklandığında kapat
    document.addEventListener('click', function(event) {
        if (mobileMenu && 
            mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            mobileMenuBtn && !mobileMenuBtn.contains(event.target)) {
            
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // İkonu geri değiştir
            if (menuIcon) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        }
    });
});

// Animasyonlu Hamburger Menü JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobil Menü
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    
    // Mobil menü aç
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Hamburger ikonunu aç
            if (hamburgerIcon) {
                hamburgerIcon.classList.add('open');
            }
            
            // Menü öğeleri için gecikmeli animasyon
            const menuItems = document.querySelectorAll('.mobile-menu-item');
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100 * (index + 1));
            });
        });
    }
    
    // Mobil menü kapat
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    // Menü dışına tıklandığında kapat
    document.addEventListener('click', function(event) {
        if (mobileMenu && 
            mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            mobileMenuBtn && !mobileMenuBtn.contains(event.target)) {
            
            closeMenu();
        }
    });
    
    // Menü kapatma fonksiyonu
    function closeMenu() {
        // Önce ters sırada animasyon uygula
        const menuItems = document.querySelectorAll('.mobile-menu-item');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
            }, 50 * (menuItems.length - index));
        });
        
        // Biraz gecikmeyle menüyü kapat
        setTimeout(() => {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // Hamburger ikonunu kapat
            if (hamburgerIcon) {
                hamburgerIcon.classList.remove('open');
            }
        }, 300);
    }
    
    // Sayfa yüklendiğinde menü öğelerini gizle
    const menuItems = document.querySelectorAll('.mobile-menu-item');
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
    });
});


// initPortfolioCarousel fonksiyonundaki bu kodu değiştirin veya ekleyin
function setupCarousel() {
    // Ekran genişliğine göre gösterilecek slayt sayısını ayarla
    if (window.innerWidth < 768) {
        slidesPerView = 1;
        isMobile = true;
        
        // Mobil ekranda okları gizle
        if (prevButton && nextButton) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
        
        // Carousel container kenar boşluklarını kaldır
        if (container) {
            container.style.margin = '0';
            container.style.width = '100%';
        }
    } else if (window.innerWidth < 1024) {
        slidesPerView = 2;
        isMobile = false;
        
        // Tablet ve büyük ekranlarda okları göster
        if (prevButton && nextButton) {
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
        }
    } else {
        slidesPerView = 3;
        isMobile = false;
        
        // Büyük ekranlarda okları göster
        if (prevButton && nextButton) {
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
        }
    }
}



// Modern Müşteri Yorumları Bölümü - 2025 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Testimonial Carousel Fonksiyonu
    initTestimonialsCarousel();
    
    // Yıldız Animasyonu için
    initStarRating();
});

function initTestimonialsCarousel() {
    const testimonialWrapper = document.querySelector('.testimonial-wrapper');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!testimonialWrapper || testimonialCards.length === 0) return;
    
    let currentIndex = 0;
    let startX, moveX;
    let isMobile = window.innerWidth < 768;
    
    // Gösterge noktalarını oluştur
    createDots();
    
    // Başlangıçta aktif kartı göster
    updateCarousel();
    
    // Otomatik geçiş için zamanlayıcı
    let autoplayInterval = setInterval(goToNextSlide, 5000);
    
    // Buton tıklama işlemleri
    prevBtn.addEventListener('click', goToPrevSlide);
    nextBtn.addEventListener('click', goToNextSlide);
    
    // Dokunmatik olayları
    testimonialWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    testimonialWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    testimonialWrapper.addEventListener('touchend', handleTouchEnd);
    
    // Fare olayları
    testimonialWrapper.addEventListener('mousedown', handleTouchStart);
    testimonialWrapper.addEventListener('mousemove', handleTouchMove);
    testimonialWrapper.addEventListener('mouseup', handleTouchEnd);
    testimonialWrapper.addEventListener('mouseleave', handleTouchEnd);
    
    // Pencere yeniden boyutlandırma
    window.addEventListener('resize', handleResize);
    
    // Kartların üzerine gelince otomatik geçişi durdur
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        card.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(goToNextSlide, 5000);
        });
    });
    
    // Gösterge noktalarını oluştur
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < testimonialCards.length; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
                resetAutoplay();
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Carousel konumunu güncelle
    function updateCarousel() {
        if (isMobile) {
            // Mobil görünüm - tek kart gösterimi
            testimonialCards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                }
            });
        } else {
            // Masaüstü görünüm - tüm kartlar görünür
            // Sadece aktif kartı vurgula
            testimonialCards.forEach((card, index) => {
                card.style.display = 'block';
                
                if (index === currentIndex) {
                    card.classList.add('active-card');
                    card.style.transform = 'translateY(-10px) scale(1.05)';
                    card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.1)';
                    card.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                } else {
                    card.classList.remove('active-card');
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.05)';
                    card.style.borderColor = 'rgba(224, 242, 233, 0.7)';
                }
            });
        }
        
        // Gösterge noktalarını güncelle
        updateDots();
        
        // Buton durumlarını güncelle
        updateButtonStates();
    }
    
    // Bir önceki slayta git
    function goToPrevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            resetAutoplay();
        }
    }
    
    // Bir sonraki slayta git
    function goToNextSlide() {
        if (currentIndex < testimonialCards.length - 1) {
            currentIndex++;
            updateCarousel();
            resetAutoplay();
        } else {
            // Son slayttaysak başa dön
            currentIndex = 0;
            updateCarousel();
            resetAutoplay();
        }
    }
    
    // Gösterge noktalarını güncelle
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Buton durumlarını güncelle
    function updateButtonStates() {
        if (currentIndex === 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        
        if (currentIndex === testimonialCards.length - 1) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
    
    // Otomatik geçişi sıfırla
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(goToNextSlide, 5000);
    }
    
    // Dokunmatik başlangıç olayı
    function handleTouchStart(e) {
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        moveX = null;
    }
    
    // Dokunmatik hareket olayı
    function handleTouchMove(e) {
        if (!startX) return;
        
        moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diffX = moveX - startX;
        
        // Sayfanın yatay kaydırılmasını engelle
        if (Math.abs(diffX) > 10) {
            e.preventDefault();
        }
    }
    
    // Dokunmatik bitiş olayı
    function handleTouchEnd() {
        if (!startX || !moveX) return;
        
        const diffX = moveX - startX;
        const threshold = 50; // Kaydırma eşiği
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                goToPrevSlide();
            } else {
                goToNextSlide();
            }
        }
        
        startX = null;
        moveX = null;
    }
    
    // Pencere yeniden boyutlandırma olayı
    function handleResize() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth < 768;
        
        // Mobil durumu değiştiyse carousel'i güncelle
        if (wasMobile !== isMobile) {
            updateCarousel();
        }
    }
}

// Yıldız Derecelendirme Animasyonu
function initStarRating() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        // Yıldızlara sırayla animasyon uygula
        const rating = parseInt(star.getAttribute('data-rating'));
        setTimeout(() => {
            star.classList.add('animate-star');
        }, rating * 150);
    });
    
    // Testimonial kartları göründüğünde blob animasyonunu tetikle
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const blob = entry.target.querySelector('.blob-decoration');
                if (blob) {
                    setTimeout(() => {
                        blob.style.opacity = '1';
                    }, 500);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.testimonial-card').forEach(card => {
        observer.observe(card);
    });
    
    // Sonuç göstergeleri için hover efekti
    const resultBadges = document.querySelectorAll('.result-badge');
    resultBadges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-5px)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translateY(0)';
        });
    });
}

// updateCarousel fonksiyonunu güncelleyelim - Tersine odaklama efekti için
function updateCarousel() {
    if (isMobile) {
        // Mobil görünüm - yatay kaydırma efekti ile
        testimonialCards.forEach((card, index) => {
            // Önce tüm kartları silikleştir
            card.classList.remove('active-card');
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.9)';

            // Aktif kartı öne çıkar
            if (index === currentIndex) {
                card.classList.add('active-card');
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }
        });

        // Mobilde kaydırma işlemi için container'ı kaydır
        const offset = currentIndex * (testimonialCards[0].offsetWidth + 16); // Kart genişliği + margin
        document.querySelector('.testimonial-container').scrollTo({
            left: offset,
            behavior: 'smooth'
        });

    } else {
        // Masaüstü görünüm - tüm kartlar görünsün, aktif olan net olsun
        testimonialCards.forEach((card, index) => {
            card.classList.remove('active-card');
            card.style.filter = 'blur(3px)';
            card.style.opacity = '0.7';
            card.style.transform = 'scale(0.95)';

            if (index === currentIndex) {
                card.classList.add('active-card');
                card.style.filter = 'blur(0)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1.05)';
            }
        });
    }

    // Gösterge noktalarını güncelle
    updateDots();
    
    // Buton durumlarını güncelle
    updateButtonStates();
}

// Sayfa başına dönüş butonu
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // Sayfa aşağı kaydırıldığında butonu göster
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('opacity-0');
                backToTopButton.classList.add('opacity-100');
            } else {
                backToTopButton.classList.remove('opacity-100');
                backToTopButton.classList.add('opacity-0');
            }
        });
        
        // Butona tıklandığında sayfa başına kaydır
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


function showSection(section) {
    // Tüm bölümleri gizle
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.style.display = 'none');

    // Tıklanan bölümü göster
    const sectionToShow = document.getElementById(section);
    sectionToShow.style.display = 'block';

    // Menü öğelerine aktif sınıf ekleyip kaldırmak (isteğe bağlı)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[onclick="showSection('${section}')"]`).classList.add('active');
}
