# 💊 PharmaNear: Medicine Location & Inventory Management System

**PharmaNear** is a full-stack web application designed to bridge the gap between users searching for specific medicines and nearby pharmacies that stock them. It offers an intuitive search experience for users and a secure admin dashboard for pharmacy owners to manage inventory and profile details efficiently.

🌐 **Live Demo:** [https://pharmanear-frontend.onrender.com](https://pharmanear-frontend.onrender.com)

---

## ✨ Features

### 👤 For Users
- 🔍 **Smart Medicine Search:** Search for medicines by name, dosage, and quantity.
- 🗺️ **Interactive Map:** View nearby pharmacies on a real-time map powered by Leaflet, showing stock status, prices, and availability.
- ⚡ **Instant Results:** Get real-time updates on medicine availability, pricing, and pharmacy details.

### 🏪 For Pharmacy Owners
- 🔐 **Secure Authentication:** Dedicated login and signup for pharmacy accounts with JWT-based security.
- 📦 **Inventory Management:** Easily add, edit, or remove medicines, including stock quantities and pricing.
- 🏠 **Profile Management:** Update pharmacy information such as address, city, state, license number, and GPS coordinates for accurate location mapping.

---

## 📸 Screenshots

> **Note:** Add screenshots here showcasing the user search, map view, and admin dashboard.

---

## 💻 Tech Stack

| Layer       | Technology              | Key Libraries/Tools |
|-------------|-------------------------|---------------------|
| **Frontend**| React (Vite)           | React Router, Leaflet, React Icons |
| **Backend** | Node.js + Express      | MongoDB, Mongoose, JWT, CORS |
| **Database**| MongoDB                 | Mongoose ODM (Models: Medicine, Pharmacy, Stock) |
| **Styling** | CSS                    | Modular, component-based styles |
| **Deployment** | Render                 | Full-stack deployment with static file serving |

---

## 📂 Project Structure

```text
PharmaNear/
├── backend/                # Node.js & Express server
│   ├── models/             # Mongoose Schemas (Medicine, Pharmacy, Stock)
│   ├── server.js           # Main application logic, endpoints, and middleware
│   └── medicine.js         # Script to fetch and seed medicine data
├── frontend/               # React + Vite application
│   ├── src/
│   │   └── components/     # All UI components and pages (Home, Map, Dashboard)
│   └── public/             # Static assets
└── .env.example            # Template for environment variables
```

### 🚧 Planned Architecture Refactor

In the future, the project is planned to be refactored to follow a stricter MVC pattern for better scalability and maintainability:

```text
PharmaNear/
├── backend/
│   ├── config/             # DB connection & Passport/Auth config
│   ├── controllers/        # Request handling logic
│   ├── models/             # Mongoose Schemas (Medicine, Pharmacy, Stock)
│   ├── routes/             # API Endpoints
│   └── middleware/         # Auth & Error handling
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, Map, Search)
│   │   ├── pages/          # View components (Home, Dashboard)
│   │   └── api/            # API service calls
```

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/) *(New? Watch a [YouTube Guide](https://www.youtube.com/watch?v=EIJeLiaGfA0))*
- **MongoDB** (local or cloud instance) - [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud setup
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Foces-core/pharmanear.git
cd pharmanear
```

### 2. Environment Configuration

You can use the provided template to create your `.env` files. We have a root `.env.example` that shows the required variables.

Copy the required variables and create `.env` files in both `frontend/` and `backend/` directories, or refer to their respective `.env-sample` files.

> **Note:** Replace `your_super_secure_jwt_secret_key_here` with a strong, unique secret. For production, use environment variables provided by Render.

### 3. Installation
Install all dependencies for both frontend and backend using the root setup script:
```bash
pnpm install:all
```

### 4. Backend Setup
```bash
cd backend
pnpm start
```
The backend will run on [http://localhost:5000](http://localhost:5000).

### 5. Frontend Setup
Open a new terminal and run:
```bash
cd frontend
pnpm dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173).

### 5. Access the Application
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- For pharmacy admin features, sign up or log in as a pharmacy owner.

---

## 📖 Usage

1. **User Search:** Enter medicine details on the home page and click "Search Nearby" to view pharmacies on the map.
2. **Pharmacy Management:** Log in as a pharmacy owner to add medicines, update stock, and edit profile details.
3. **Map Interaction:** Click on map markers to view pharmacy details, including contact info and stock status.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project.

2. Create your Feature Branch (`git checkout -b feature/feature-name`).

3. Commit your Changes (`git commit -m 'feat: add feature name'`).

4. Push to the Branch (`git push origin feature/feature-name`).

5. Open a Pull Request targeting the `main` branch.

Please ensure your code follows the project's style guidelines and includes tests where applicable.

> **CRITICAL:** All important architectural decisions made by humans or AI agents MUST be recorded in the `memory.md` file to provide context for future development.

---

## 📜 License

This project is licensed under the MIT License.

---

## 📬 Contact

- **Project Link:** [https://github.com/Foces-core/pharmanear](https://github.com/Foces-core/pharmanear)
- **Live Demo:** [https://pharmanear-frontend.onrender.com](https://pharmanear-frontend.onrender.com)
- **Issues:** Open an issue on GitHub for bugs or feature requests.
  
---

### Contact Maintainers

- **Sebin Mathew**
  - 📧 Email: Sebinmathew543@gmail.com
  - 💼 LinkedIn: https://www.linkedin.com/in/sebin-gg
  - 🐙 GitHub: https://github.com/sebin-gg

- **Lisha Jins**
  - 📧 Email: lishajins2006@gmail.com
  - 💼 LinkedIn: https://www.linkedin.com/in/lisha-jins
  - 🐙 GitHub: https://github.com/Lishajins


