# 🚀 UltimateStore

<div align="center">

![UltimateStore Logo](https://img.shields.io/badge/UltimateStore-Cloud%20Storage-blue?style=for-the-badge&logo=cloud&logoColor=white)

**Your Ultimate Cloud Storage Solution** ☁️

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🌟 Features](#-features) • [🚀 Quick Start](#-quick-start) • [📖 API Docs](#-api-documentation) • [🤝 Contributing](#-contributing)

</div>

## 🎯 What is UltimateStore?

UltimateStore is a **modern, secure, and lightning-fast** cloud storage platform that transforms how you manage your digital files. Built with cutting-edge technologies, it offers seamless file upload, intelligent organization, and instant access from anywhere.

### ✨ Why Choose UltimateStore?

- 🔒 **Bank-level Security** - JWT authentication & encrypted storage
- ⚡ **Lightning Fast** - Optimized for speed with Cloudinary CDN
- 📱 **Mobile First** - Responsive design that works everywhere
- 🎨 **Beautiful UI** - Modern dark theme with smooth animations
- 🔄 **Smart Features** - Undo delete, real-time search, drag & drop

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🔐 **Authentication & Security**

- Secure user registration & login
- JWT token-based authentication
- Password encryption with bcrypt
- Profile management system

### 📁 **File Management**

- Drag & drop file uploads
- Multiple file format support
- Real-time file search
- Custom file naming
- Smart file organization

</td>
<td width="50%">

### 🎨 **User Experience**

- Modern dark-themed interface
- Responsive mobile design
- Toast notifications
- Loading animations
- Keyboard shortcuts

### 🛡️ **Advanced Features**

- Soft delete with undo (8s window)
- Cloud storage with Cloudinary
- File type validation
- Download protection
- Session management

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Cloudinary](https://cloudinary.com/) account

### 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/david-one8/Ultimate-Store.git
   cd Ultimate-Store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_super_secret_jwt_key
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Launch the application**

   ```bash
   npm start
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000` and start uploading! 🎉

## 🏗️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Frontend** | EJS, TailwindCSS, Flowbite, Remix Icons |
| **Storage** | Cloudinary CDN |
| **Security** | JWT, bcrypt, express-validator |
| **Tools** | Multer, cookie-parser, dotenv |

## 📖 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user/register` | Registration page |
| `POST` | `/user/register` | Create new account |
| `GET` | `/user/login` | Login page |
| `POST` | `/user/login` | Authenticate user |
| `GET` | `/user/profile` | Get user profile |
| `PUT` | `/user/profile` | Update profile |
| `POST` | `/user/logout` | Logout user |

### 📁 File Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/home` | Dashboard with files |
| `POST` | `/home/upload` | Upload new file |
| `GET` | `/home/download/:id` | Download file |
| `POST` | `/home/delete/:id` | Soft delete file |
| `POST` | `/home/restore/:id` | Restore deleted file |
| `POST` | `/home/delete/permanent/:id` | Permanently delete |
| `PUT` | `/home/update/:id` | Update file name |

## 📂 Project Structure

```text
UltimateStore/
├── 📁 config/
│   ├── 🔧 db.js                 # Database connection
│   ├── ☁️ cloudinary.config.js   # Cloudinary setup
│   └── 📤 multer.config.js       # File upload config
├── 📁 middlewares/
│   └── 🔐 auth.js               # Authentication middleware
├── 📁 models/
│   ├── 👤 user.model.js         # User schema
│   └── 📄 files.models.js       # File schema
├── 📁 routes/
│   ├── 👤 user.routes.js        # Auth routes
│   └── 🏠 home.routes.js        # File routes
├── 📁 views/
│   ├── 🏠 home.ejs              # Dashboard
│   ├── 🔐 login.ejs             # Login page
│   └── 📝 register.ejs          # Registration page
├── ⚙️ app.js                    # Main application
├── 📦 package.json              # Dependencies
└── 🔒 .env                      # Environment variables
```

## 🚀 Deployment

### 🌐 Deploy to Heroku

1. **Create Heroku app**

   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**

   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET_KEY=your_jwt_secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Deploy**

   ```bash
   git push heroku main
   ```

## 🤝 Contributing

We love contributions! Here's how you can help make UltimateStore even better:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### 🐛 Found a Bug?

Please [open an issue](https://github.com/david-one8/Ultimate-Store/issues) with:

- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cloudinary](https://cloudinary.com/) for amazing cloud storage
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [TailwindCSS](https://tailwindcss.com/) for beautiful styling
- [Remix Icons](https://remixicon.com/) for gorgeous icons

<div align="center">

**Made with ❤️ by [David Fule]**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/david-one8)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/davidfule)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/davidfule18)

⭐ **Star this repo if you found it helpful!** ⭐

</div>