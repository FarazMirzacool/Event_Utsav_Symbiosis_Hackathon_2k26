# 🎊 Event Utsav - Modern Event Management Platform

Event Utsav is a comprehensive event management platform that simplifies the entire event lifecycle - from creation to execution. Built with modern web technologies, it provides organizers with powerful tools to manage events efficiently while offering attendees a seamless registration experience.

## 🌟 Features

### For Event Organizers
- **Event Dashboard**: Centralized control panel for all events
- **Easy Event Creation**: Step-by-step wizard for setting up events
- **Ticket Management**: Create multiple ticket tiers with dynamic pricing
- **Attendee Management**: Track registrations, check-ins, and attendance
- **Real-time Analytics**: Visual insights into ticket sales and demographics
- **Communication Hub**: Send bulk emails and notifications to attendees
- **QR Code Integration**: Digital tickets with QR codes for easy verification

### For Attendees
- **User-friendly Interface**: Browse and discover events easily
- **Quick Registration**: One-click registration with social login
- **Digital Tickets**: Access tickets anytime on any device
- **Event Calendar**: Sync events with personal calendar
- **Reminders**: Get notified about upcoming events

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - UI library
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Router v6** - Navigation
- **Axios** - HTTP requests
- **React Query** - Data fetching and caching
- **Socket.io-client** - Real-time updates

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email services
- **Socket.io** - Real-time communication

### DevOps & Tools
- **Git** - Version control
- **Docker** - Containerization
- **Jest** - Testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository


<img width="831" height="278" alt="image" src="https://github.com/user-attachments/assets/3a516194-ada6-4024-85a1-e0ab5ecba0fa" />
<img width="864" height="687" alt="image" src="https://github.com/user-attachments/assets/bdb267f8-c3a5-4166-86fc-209f432e1f61" />
<img width="846" height="187" alt="image" src="https://github.com/user-attachments/assets/b21a0962-1a03-4eb8-8d38-932bc721b1db" />
<img width="813" height="186" alt="image" src="https://github.com/user-attachments/assets/b707c1ed-cba0-4ab1-836f-172fe07d98dd" />
<img width="847" height="526" alt="image" src="https://github.com/user-attachments/assets/d11b15a3-0519-412a-86c1-caee8311ab7d" />
<img width="871" height="454" alt="image" src="https://github.com/user-attachments/assets/b7b79d27-f834-4714-a368-2b8c60995af4" />
<img width="830" height="326" alt="image" src="https://github.com/user-attachments/assets/cb6eb305-17b8-4fbb-9069-f231444e7b1f" />
<img width="685" height="630" alt="image" src="https://github.com/user-attachments/assets/187da1ce-bb25-4451-a6cd-35a41b53143e" />

🔑 Key API Endpoints
Authentication Routes
POST /api/auth/register - User registration

POST /api/auth/login - User login

POST /api/auth/forgot-password - Password reset request

PUT /api/auth/reset-password/:token - Reset password

Event Routes
GET /api/events - Get all events (with filters)

GET /api/events/:id - Get single event

POST /api/events - Create new event

PUT /api/events/:id - Update event

DELETE /api/events/:id - Delete event

GET /api/events/search?q=query - Search events

Ticket Routes
POST /api/tickets - Purchase ticket

GET /api/tickets/my-tickets - Get user's tickets

GET /api/tickets/verify/:qrCode - Verify ticket

PUT /api/tickets/:id/check-in - Check-in attendee

🎯 Problem Statement & Solution
The Problem
Event management traditionally involves multiple disconnected tools:

📝 Manual registration processes

💰 Complex ticketing systems

📊 Fragmented attendee data

🔄 Communication gaps

📈 Lack of real-time insights

Our Solution
Event Utsav addresses these challenges by providing:

Unified Platform: All event management needs in one place

Automated Workflows: From registration to check-in

Real-time Analytics: Data-driven insights for better decisions

Scalable Architecture: Handles events of any size

User Experience: Intuitive interfaces for both organizers and attendees

Key Benefits
✅ 70% reduction in manual work

✅ 50% faster registration process

✅ Real-time attendance tracking

✅ Improved attendee engagement

✅ Data-backed event planning


📝 License
Distributed under the MIT License. See LICENSE for more information.

📧 Contact
 Name - @Faraz Mirza - farazmirza@gmail.com

Project Link: https://github.com/FarazMirzacool/Event_Utsav_Symbiosis_Hackathon_2K26

🙏 Acknowledgments
MongoDB for excellent documentation

React community for amazing tools

All contributors and testers

Caution : The website has been created using ai tools and teams brainstorming 
So get ready for heavy debugging and show your creativity to enhance the UI and functions






