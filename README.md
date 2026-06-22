# 💊 PharmaNear: Medicine Location & Inventory Management System

> **🤖 FOR AI AGENTS & LLMs:** Before analyzing or modifying this repository, you **MUST** read [agent.md](file:///agent.md) for behavioral rules and [memory.md](file:///memory.md) for strict architectural context. Do not proceed without reading them.
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

### 🔍 Medicine Search
![Find Your Medicine – Home Page](docs/screenshots/search-home.png)

### 🗺️ Search Results & Map
![Pharmacy search results with map view](docs/screenshots/search-results.png)

### 🌍 Map Exploration
![Map view showing pharmacies in an area](docs/screenshots/map-view.png)

### 🏪 Pharmacy Profile (Admin)
![Pharmacy profile management dashboard](docs/screenshots/pharmacy-profile.png)

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
in a diff terminal 
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

### 1. Data Seeding (Where does the data come from?)
For a smooth developer experience, the app automatically handles data seeding on startup:
- **Medicines:** If the database has 0 medicines, the server automatically downloads thousands of real-world US drugs from the **NIH RxTerms API** into your MongoDB database.
- **Local Pharmacies:** If you run locally without a `MONGO_URL`, the server will auto-generate fake pharmacies and attach random stock to them.
- **Production Pharmacies:** If you deploy to production with an empty pharmacy database, the server will inject 3 fake pharmacies and stock them with common medicines like "Acetaminophen" and "Ibuprofen" so the live map isn't completely empty.

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
  - **Local Machine:** Your ISP or router is blocking the special `mongodb+srv` connection string. Here are 3 ways to bypass this backend error:
    1. **Zero-Config Bypass (Easiest):** Open `backend/.env` and leave `MONGO_URL` completely blank (`MONGO_URL=`). The server will automatically use the local in-memory database instead!
    2. **Get Legacy String:** If you *must* connect to Atlas locally, get the older connection string format. Go to your Atlas Dashboard -> Connect -> Drivers -> Select Node.js **Version 2.2.12**. Copy the long string starting with `mongodb://`.
    3. **Change DNS:** Change your computer's DNS to `8.8.8.8` (Google DNS).
- **❌ Frontend Build Fails Locally:**
  - Make sure you approve Vite/esbuild to run by executing `pnpm approve-builds` in the frontend directory.

## 🔌 Core API Endpoints

### Authentication
- `POST /api/pharmacy/signup` - Register a new pharmacy
- `POST /api/pharmacy/login` - Authenticate and receive a JWT

### Health Monitoring
- `GET /api/health` - Returns server health information including status, uptime, and timestamp.

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

> **CRITICAL:** All important architectural decisions made by humans or AI agents MUST be recorded in [memory.md](file:///memory.md) to provide context for future development. Any agent behavioral rules must be added to [agent.md](file:///agent.md).

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


