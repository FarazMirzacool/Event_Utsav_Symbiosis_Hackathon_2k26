// ========== API CONFIGURATION ==========
const API_BASE_URL = 'http://localhost:5001/api/vendor';
let authToken = localStorage.getItem('vendorToken');
let currentVendor = JSON.parse(localStorage.getItem('vendor') || 'null');

// Socket.IO for real-time notifications
let socket = null;

// Initialize socket connection
function initSocket() {
    if (authToken) {
        socket = io('http://localhost:5001', {
            transports: ['websocket'],
            query: { token: authToken }
        });
        
        socket.on('connect', () => {
            console.log('Connected to real-time server');
        });
        
        // Listen for vendor-specific notifications
        if (currentVendor) {
            socket.on(`notification_${currentVendor.id}`, (notification) => {
                showNotification(notification);
                loadNotifications(); // Refresh notifications
                updateNotificationBadge();
            });
        }
        
        socket.on('disconnect', () => {
            console.log('Disconnected from real-time server');
        });
    }
}

// Show popup notification
function showNotification(notification) {
    showToast(notification.message, notification.type);
}

// ========== API FUNCTIONS ==========

// Login vendor
async function loginVendor(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Save auth data
        localStorage.setItem('vendorToken', data.access_token);
        localStorage.setItem('vendor', JSON.stringify({
            id: data.vendor_id,
            business_name: data.business_name,
            owner_name: data.owner_name,
            verified: data.verified
        }));
        
        authToken = data.access_token;
        currentVendor = JSON.parse(localStorage.getItem('vendor'));
        
        // Initialize socket connection
        initSocket();
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Register vendor
async function registerVendor(vendorData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendorData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout
function logout() {
    if (socket) {
        socket.disconnect();
    }
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendor');
    authToken = null;
    currentVendor = null;
    window.location.href = 'vendor-login.html';
}

// Get dashboard data
async function fetchDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch dashboard');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        return null;
    }
}

// Get bookings
async function fetchBookings(status = 'all', date = null) {
    try {
        let url = `${API_BASE_URL}/bookings?status=${status}`;
        if (date) url += `&date=${date}`;
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch bookings');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

// Update booking status
async function updateBookingStatus(bookingId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update status');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get services
async function fetchServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch services');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

// Create service
async function createService(serviceData) {
    try {
        const response = await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(serviceData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create service');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Delete service
async function deleteService(serviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete service');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get notifications
async function fetchNotifications() {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch notifications');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

// Mark notification as read
async function markNotificationRead(notificationId) {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error marking notification read:', error);
        return false;
    }
}

// Mark all notifications as read
async function markAllNotificationsRead() {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error marking all notifications read:', error);
        return false;
    }
}

// Get unread count
async function fetchUnreadCount() {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        return data.count || 0;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
}

// Get earnings
async function fetchEarnings(period = 'month') {
    try {
        const response = await fetch(`${API_BASE_URL}/earnings?period=${period}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch earnings');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching earnings:', error);
        return null;
    }
}

// Get reviews
async function fetchReviews() {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch reviews');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

// Respond to review
async function respondToReview(reviewId, response) {
    try {
        const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}/respond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ response })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.error || 'Failed to post response');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get analytics
async function fetchAnalytics() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch analytics');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }
}

// Update profile
async function updateProfile(profileData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update profile');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== UPDATE EXISTING FUNCTIONS TO USE API ==========

// Update loadDashboardData function
async function loadDashboardData() {
    const data = await fetchDashboardData();
    if (!data) return;
    
    document.getElementById('totalBookings').textContent = data.stats.total_bookings;
    document.getElementById('pendingBookings').textContent = data.stats.pending_bookings;
    document.getElementById('completedBookings').textContent = data.stats.completed_bookings;
    document.getElementById('totalEarnings').textContent = `₹${data.stats.total_earnings}`;
    document.getElementById('pendingBookingsBadge').textContent = data.stats.pending_bookings;
    
    loadRecentActivity(data.recent_activity);
    loadUpcomingBookings(data.upcoming_bookings);
}

// Update loadBookings function
async function loadBookings() {
    const bookings = await fetchBookings();
    
    const tbody = document.getElementById('bookingsList');
    if (!tbody) return;
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.id}</td>
            <td>${booking.customer}</td>
            <td>${booking.service}</td>
            <td>${new Date(booking.date).toLocaleDateString()}</td>
            <td>₹${booking.amount}</td>
            <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
            <td>
                ${booking.payment === 'advance' ? 
                    `<small>₹${booking.paidAmount} paid<br>₹${booking.remainingAmount} remaining</small>` : 
                    'Full Paid'}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewBooking('${booking.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="updateBookingStatusModal('${booking.id}')" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="cancelBooking('${booking.id}')" title="Cancel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update loadServices function
async function loadServices() {
    const services = await fetchServices();
    
    const grid = document.getElementById('servicesList');
    if (!grid) return;
    
    grid.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-image">
                <img src="${service.image}" alt="${service.name}">
                <span class="service-status ${service.status}">${service.status}</span>
            </div>
            <div class="service-content">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-price">
                    <span class="price">₹${service.discounted_price || service.price}</span>
                    ${service.discount ? `<span class="old-price">₹${service.price}</span>` : ''}
                </div>
                <p style="color: var(--gray); font-size: 0.85rem; margin-bottom: 10px;">
                    <i class="fas fa-calendar-check"></i> ${service.bookings_count || 0} bookings
                </p>
                <div class="service-actions">
                    <button class="edit-btn" onclick="editService('${service._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteService('${service._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update saveNewService function
async function saveNewService(event) {
    event.preventDefault();
    
    const newService = {
        name: document.getElementById('newServiceName').value,
        category: document.getElementById('newServiceCategory').value,
        price: parseInt(document.getElementById('newServicePrice').value),
        discount: parseInt(document.getElementById('newServiceDiscount').value) || 0,
        image: document.getElementById('newServiceImage').value || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500',
        description: document.getElementById('newServiceDesc').value
    };
    
    const result = await createService(newService);
    
    if (result.success) {
        loadServices();
        closeModal('addServiceModal');
        showToast('Service added successfully!', 'success');
        document.getElementById('addServiceForm').reset();
    } else {
        showToast(result.error || 'Failed to add service', 'error');
    }
}

// Update deleteService function
async function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        const result = await deleteService(id);
        if (result.success) {
            loadServices();
            showToast('Service deleted successfully', 'success');
        } else {
            showToast(result.error || 'Failed to delete service', 'error');
        }
    }
}

// Update loadNotifications function
async function loadNotifications() {
    const notifications = await fetchNotifications();
    
    const list = document.getElementById('notificationsList');
    if (!list) return;
    
    list.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="markAsRead('${notif.id}')">
            <div class="notification-title">${notif.title}</div>
            <div class="notification-message">${notif.message}</div>
            <div class="notification-time">${notif.time}</div>
        </div>
    `).join('');
    
    updateNotificationBadge();
}

// Update markAsRead function
async function markAsRead(id) {
    await markNotificationRead(id);
    loadNotifications();
}

// Update markAllAsRead function
async function markAllAsRead() {
    await markAllNotificationsRead();
    loadNotifications();
}

// Update loadEarningsData function
async function loadEarningsData() {
    const data = await fetchEarnings();
    if (!data) return;
    
    document.getElementById('totalEarningsAmount').textContent = `₹${data.summary.total}`;
    document.getElementById('pendingPayouts').textContent = `₹${data.summary.pending || 0}`;
    document.getElementById('completedOrders').textContent = data.summary.count;
    document.getElementById('avgOrderValue').textContent = `₹${data.summary.average}`;
    
    loadPaymentsList(data.recent_payments);
    updateEarningsChart(data.chart_data);
}

// Update loadReviews function
async function loadReviews() {
    const reviews = await fetchReviews();
    
    const grid = document.getElementById('reviewsList');
    if (!grid) return;
    
    const stats = await calculateReviewStats(reviews);
    document.getElementById('avgRating').textContent = stats.average;
    document.getElementById('totalReviews').textContent = `(${stats.total} reviews)`;
    
    grid.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="https://ui-avatars.com/api/?name=${review.customer}&background=8B5CF6&color=fff&size=50" alt="${review.customer}">
                    <div>
                        <h4>${review.customer}</h4>
                        <div class="review-rating">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                        </div>
                    </div>
                </div>
                <small>${review.date}</small>
            </div>
            <p class="review-text">"${review.comment}"</p>
            <p class="review-service">Service: ${review.service}</p>
            ${review.response ? 
                `<div style="background: #f0f0f0; padding: 10px; border-radius: 8px; margin-top: 10px;">
                    <strong>Your Response:</strong> ${review.response}
                </div>` : 
                `<div class="review-actions">
                    <button class="reply-btn" onclick="respondToReview('${review.id}')">
                        <i class="fas fa-reply"></i> Respond
                    </button>
                </div>`
            }
        </div>
    `).join('');
}

// Update respondToReview function
async function respondToReview(id) {
    const review = reviews.find(r => r.id === id);
    if (!review) return;
    
    const response = prompt('Enter your response to this review:');
    if (response) {
        const result = await respondToReview(id, response);
        if (result.success) {
            loadReviews();
            showToast('Response posted successfully!', 'success');
        } else {
            showToast(result.error || 'Failed to post response', 'error');
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!authToken) {
        window.location.href = 'vendor-login.html';
        return;
    }
    
    initializeDashboard();
    updateDateTime();
    
    // Load all data
    Promise.all([
        loadDashboardData(),
        loadNotifications(),
        loadBookings(),
        loadServices(),
        loadEarningsData(),
        loadReviews()
    ]).then(() => {
        // Initialize socket for real-time updates
        initSocket();
        
        // Set up periodic refresh
        setInterval(loadNotifications, 30000); // Check notifications every 30 seconds
        setInterval(loadDashboardData, 60000); // Refresh dashboard every minute
    });
});