# 💊 PharmaNear: Medicine Location & Inventory Management System

**PharmaNear** is a full-stack web application designed to bridge the gap between users searching for specific medicines and nearby pharmacies that stock them. It offers an intuitive search experience for users and a secure admin dashboard for pharmacy owners to manage inventory and profile details efficiently.

🌐 **Live Demo:** [https://pharmanear-aneu.onrender.com](https://pharmanear-aneu.onrender.com)

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
- **MongoDB** (Optional) - The app uses an in-memory DB locally, but you can use [MongoDB Atlas](https://www.mongodb.com/atlas) for production/cloud setups.
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Foces-core/pharmanear.git
cd pharmanear
```

### 2. Installation & Zero-Config Setup

PharmaNear features a **zero-config local development environment**. If you don't provide a MongoDB connection string, the backend will automatically spin up an in-memory database (`mongodb-memory-server`) for instant testing!

Install all dependencies using the root setup script:
```bash
pnpm install:all
```

> **⚠️ CRITICAL for pnpm v10+ users:** Newer versions of `pnpm` block package build scripts for security. You **must** approve them for the database and frontend to build:
> 1. Run `pnpm approve-builds` in the `frontend` folder (Press `a` then `Enter`).
> 2. Run `pnpm approve-builds` in the `backend` folder (Press `a` then `Enter`).

### 3. Environment Variables (Optional for Local Dev)

If you want to connect to a real MongoDB Atlas database, create `.env` files in the `frontend/` and `backend/` directories based on the `.env.example` templates. 

Otherwise, just skip this step—the app works completely out of the box!

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

## 📖 Usage & Local Testing

### 1. Creating a Pharmacy (Admin Setup)
To test the admin features locally or on the live site:
1. Navigate to the **Sign Up** page.
2. Enter your pharmacy's details (Name, Owner, City, Phone) and create a secure password.
3. Click **Sign Up**. You will be automatically logged into the Pharmacy Dashboard.
4. From the dashboard, you can click **Add Medicine** to start building your inventory.

### 2. User Search Testing
1. Enter a medicine name on the Home page (e.g., a medicine you just added to your pharmacy).
2. Click **Search Nearby**. The app will map pharmacies holding that stock.

### 3. Map Interaction
Click on map markers to view pharmacy details, including contact info, opening hours, and stock status.

---



## 🌍 Environment Variables

Create `.env` files in both `backend` and `frontend` using these keys:

### `backend/.env`
| Variable | Description |
|----------|-------------|
| `PORT` | The port the Node.js server runs on (Default: 5000) |
| `MONGO_URL` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secure, random string for signing authentication tokens |
| `CORS_ORIGIN` | The URL allowed to make API requests (e.g., `http://localhost:5173` or `*`) |

### `frontend/.env`
| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | The URL of your live backend API. If blank, it defaults to `http://localhost:5000` |

## 🛠️ Common Troubleshooting

- **❌ MongoDB Connection Error (`querySrv ECONNREFUSED _mongodb._tcp...`):** 
  - **On Render:** Your MongoDB Atlas cluster is blocking Render's IP. Go to MongoDB Atlas -> Security -> Network Access and add `0.0.0.0/0` (Allow Access From Anywhere).
  - **Local Machine:** Your ISP or router is blocking the `mongodb+srv` DNS lookup. Change your computer's DNS to `8.8.8.8` (Google) or use a standard `mongodb://` connection string.
- **❌ Frontend Build Fails Locally:**
  - Make sure you approve Vite/esbuild to run by executing `pnpm approve-builds` in the frontend directory.

## 🔌 Core API Endpoints

### Authentication
- `POST /api/pharmacy/signup` - Register a new pharmacy
- `POST /api/pharmacy/login` - Authenticate and receive a JWT

### Medicines & Stock
- `GET /api/drugs?name=X` - Search for a medicine and see all pharmacies stocking it
- `POST /api/pharmacy/stock` - Add or update stock for a specific medicine
- `GET /api/pharmacy/stock?pharmacy_id=X` - View all stock for a pharmacy
- `PATCH /api/pharmacy/stock` - Modify stock quantities or pricing
- `DELETE /api/pharmacy/stock` - Remove a medicine from inventory

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project.

2. Create your Feature Branch (`git checkout -b feature/feature-name`).

3. Commit your Changes (`git commit -m 'feat: add feature name'`).

4. Push to the Branch (`git push origin feature/feature-name`).

5. Open a Pull Request targeting the `main` branch.

> **🎉 Auto-Deployment:** Any changes merged or pushed directly to the `main` branch will be automatically detected by Render and deployed to the live site. You do not need to manually deploy!

Please ensure your code follows the project's style guidelines and includes tests where applicable.

> **CRITICAL:** All important architectural decisions made by humans or AI agents MUST be recorded in the `memory.md` file to provide context for future development.

---

## 📜 License

This project is licensed under the MIT License.

---

## 📬 Contact

- **Project Link:** [https://github.com/Foces-core/pharmanear](https://github.com/Foces-core/pharmanear)
- **Live Demo:** [https://pharmanear-aneu.onrender.com](https://pharmanear-aneu.onrender.com)
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


