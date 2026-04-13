// Main JavaScript file for Team Alpha Hotel

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initFlashMessages();
    initDateValidation();
    initSearchForm();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                bar.style.transform = navMenu.classList.contains('active') 
                    ? getBarTransform(index) 
                    : 'none';
            });
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                });
            });
        });
    }
}

function getBarTransform(index) {
    const transforms = [
        'rotate(45deg) translate(5px, 5px)',
        'opacity: 0',
        'rotate(-45deg) translate(7px, -6px)'
    ];
    return transforms[index];
}

// Flash Messages
function initFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash-message');
    
    flashMessages.forEach(message => {
        const closeBtn = message.querySelector('.flash-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                message.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    message.remove();
                }, 300);
            });
        }
        
        // Auto-remove flash messages after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 300);
            }
        }, 5000);
    });
}

// Date Validation
function initDateValidation() {
    // Set minimum date for all date inputs to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        if (!input.min) {
            input.min = today;
        }
        
        // Prevent selection of past dates
        input.addEventListener('change', function() {
            if (this.value && this.value < today) {
                this.value = today;
                showNotification('Check-in date cannot be in the past', 'error');
            }
        });
    });
}

// Search Form Functionality
function initSearchForm() {
    const homeSearchForm = document.getElementById('homeSearchForm');
    
    if (homeSearchForm) {
        homeSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const guests = document.getElementById('guests').value;
            
            // Validation
            if (!checkin || !checkout) {
                showNotification('Please select check-in and check-out dates', 'error');
                return;
            }
            
            if (new Date(checkin) >= new Date(checkout)) {
                showNotification('Check-out date must be after check-in date', 'error');
                return;
            }
            
            // Redirect to rooms page with search parameters
            const params = new URLSearchParams({
                checkin: checkin,
                checkout: checkout,
                guests: guests
            });
            
            window.location.href = `/rooms?${params.toString()}`;
        });
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `flash-message flash-${type}`;
    notification.innerHTML = `
        ${message}
        <span class="flash-close">&times;</span>
    `;
    
    // Add to flash messages container or create one
    let container = document.querySelector('.flash-messages');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flash-messages';
        container.style.position = 'fixed';
        container.style.top = '80px';
        container.style.right = '20px';
        container.style.zIndex = '1001';
        container.style.maxWidth = '400px';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.flash-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function calculateNights(checkin, checkout) {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// API Helper Functions
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showNotification('An error occurred. Please try again.', 'error');
        throw error;
    }
}

// Loading State Management
function showLoading(element, message = 'Loading...') {
    element.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>${message}</p>
        </div>
    `;
}

function hideLoading(element) {
    const spinner = element.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
            input.classList.add('error');
            isValid = false;
            showNotification('Please enter a valid email address', 'error');
        }
    });
    
    // Phone validation (basic)
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (input.value && !phoneRegex.test(input.value)) {
            input.classList.add('error');
            isValid = false;
            showNotification('Please enter a valid phone number', 'error');
        }
    });
    
    return isValid;
}

// Add CSS for animations and error states
const additionalCSS = `
@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

input.error, select.error, textarea.error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
}

input.error:focus, select.error:focus, textarea.error:focus {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section (optional)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Room image gallery functionality
function initGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image
                mainImage.src = this.src;
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// Initialize gallery if on room detail page
if (document.querySelector('.room-gallery')) {
    initGallery();
}

// Print booking confirmation
function printBooking() {
    window.print();
}

// Share functionality
function shareRoom(roomUrl, roomName) {
    if (navigator.share) {
        navigator.share({
            title: roomName,
            text: `Check out this amazing room at Team Alpha Hotel`,
            url: roomUrl
        }).then(() => {
            showNotification('Room shared successfully!', 'success');
        }).catch(() => {
            // User cancelled sharing
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(roomUrl).then(() => {
            showNotification('Room link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Unable to share room. Please copy the link manually.', 'error');
        });
    }
}

// Initialize tooltips if needed
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
}

// Initialize tooltips
initTooltips();
