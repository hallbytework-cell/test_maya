# 🌿 Maya Vriksh - Plant & Pot E-Commerce UI


**Maya Vriksh** is a modern, responsive **Plant & Pot E-Commerce Web Application** built using **React 19**, **Redux Toolkit**, **React Query**, and **Tailwind CSS**.  
This project focuses on selling a variety of plants, pots, and garden accessories with a clean, scalable, and maintainable codebase.


![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![Redux](https://img.shields.io/badge/Redux-9.2.0-purple?logo=redux)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.10-skyblue?logo=tailwind-css)
![React Query](https://img.shields.io/badge/React_Query-5.90.2-lightblue?logo=reactquery)
![Ant Design](https://img.shields.io/badge/Ant_Design-5.27.4-red?logo=ant-design)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)

---

## 🚀 Tech Stack

- **Frontend Framework:** React 19.1.0  
- **State Management:** Redux Toolkit (`react-redux` ^9.2.0)  
- **Server State & Data Fetching:** @tanstack/react-query (^5.90.2)  
- **UI Library:** Ant Design (antd ^5.27.4)  
- **Form Handling:** React Hook Form (^7.62.0)  
- **HTTP Client:** Axios (^1.12.2)  
- **Date Library:** Day.js (^1.11.18)  
- **Styling:** Tailwind CSS (^4.1.10)  
- **Routing:** React Router DOM (^7.6.2)  
- **Language:** JavaScript (ES2023)

---

## 📂 Folder Structure


src/
│
├── assets/                     # Images, icons, fonts, etc.
│   ├── icons/
|   └──images/
|
├── components/                 # Reusable shared components
│   ├── Button.jsx
│   ├── ProductCard.jsx
│   ├── Loader.jsx
│   └── Navbar.jsx
│
├── pages/                      # Page-level components
│   ├── Home/
│   │   ├── index.jsx           # Main page file for Home
│   │   └── HeroSection.jsx
│   │
│   ├── Products/
│   │   ├── index.jsx
│   │   └── ProductList.jsx
│   │
│   ├── ProductDetails/
│   │   ├── index.jsx
│   │   └── ProductInfo.jsx
│   │
│   ├── Cart/
│   │   ├── index.jsx
│   │   └── CartSummary.jsx
│   │
│   ├── Checkout/
│   │   ├── index.jsx
│   │   └── PaymentOptions.jsx
│   │
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   │
│   └── NotFound/
│       └── index.jsx
│
├── store/                      # Redux Toolkit slices & store setup
│   ├── index.js
│   ├── productSlice.js
│   ├── cartSlice.js
│   └── userSlice.js
│
├── services/                   # API and axios setup
│   ├── api/
│   │   ├── auth
|   |   |    └── auth.js
|   |   |
|   |   ├── customer
|   |   |    ├── cart.js
|   |   |    └── address.js
|   |   |
|   |   └── product
|   |        └──  products.js
|   |
│   └── axiosConfig.js
│
├── hooks/                      # Custom hooks
│   ├── useAuth.js
│   └── useProducts.js
│
├── utils/                      # Helper functions and constants
│   ├── constants.js
│   ├── formatPrice.js
│   └── storage.js
│
├── App.jsx
├── main.jsx
└── index.css

---

## ⚙️ Installation & Setup

# Clone the repository
git clone https://github.com/MayaVriksh/mv-ecom-ui
cd mv-ecom-ui

# Install dependencies
npm install

# Start development server
npm run dev

🧩 Key Features

🌱 Browse and search a variety of plants and pots
🔄 State management with Redux Toolkit
⚡ Data fetching and caching with React Query
🧠 Modular folder structure for scalability
🎨 Fully responsive UI with Tailwind CSS and Ant Design
🛒 Cart management with add/remove/update products
💳 Checkout flow ready for payment integration
🧾 Authentication with Login & Signup

👨‍💻 Author

Mr. Arpan Halder
Frontend Developer | React & Tailwind Specialist
📍 MV Limited | Kolakata, India