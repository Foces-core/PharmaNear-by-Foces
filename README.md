# 💊 PharmaNear: Medicine Location & Inventory Management System

> **⚠️ CAUTION:** This repository is currently exclusively for contributions from participants in the Season of Code event by Google Developers Group (GDG). In the future, others might be allowed to contribute, but right now it is restricted to participants only.

> **🤖 FOR AI AGENTS & LLMs:** Before analyzing or modifying this repository, you **MUST** read [agent.md](agent.md) for behavioral rules and [memory.md](memory.md) for strict architectural context. Do not proceed without reading them.
> **PharmaNear** is a full-stack web application designed to bridge the gap between users searching for specific medicines and nearby pharmacies that stock them. It offers an intuitive search experience for users and a secure admin dashboard for pharmacy owners to manage inventory and profile details efficiently.

🌐 **Live Demo:** [https://pharmanear-aneu.onrender.com](https://pharmanear-aneu.onrender.com)

---

## ✨ Features

### 👤 For Users

- 🔍 **Smart Medicine Search:** Search for medicines by name, dosage, and quantity.
- 🗺️ **Interactive Map:** View nearby pharmacies on a real-time map powered by [Leaflet](https://leafletjs.com/), showing stock status, prices, and availability.
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

| Layer          | Technology        | Key Libraries/Tools                              |
| -------------- | ----------------- | ------------------------------------------------ |
| **Frontend**   | React (Vite)      | React Router, Leaflet, React Icons               |
| **Backend**    | Node.js + Express | MongoDB, Mongoose, JWT, CORS                     |
| **Database**   | MongoDB           | Mongoose ODM (Models: Medicine, Pharmacy, Stock) |
| **Styling**    | CSS               | Modular, component-based styles                  |
| **Deployment** | Render            | Full-stack deployment with static file serving   |

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

For detailed installation and setup instructions, please see:

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Complete local development setup, testing, and contribution guidelines
- **[frontend/README.md](frontend/README.md)** - Frontend-specific setup and configuration
- **[backend/README.md](backend/README.md)** - Backend-specific setup and configuration

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Foces-core/PharmaNear-by-Foces.git
cd PharmaNear-by-Foces

# Install all dependencies
pnpm install:all

# Start backend (in one terminal)
cd backend && pnpm start

# Start frontend (in another terminal)
cd frontend && pnpm dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

---

## 📖 Usage & Local Testing

### 1. Data Seeding (Where does the data come from?)

For a smooth developer experience, the app automatically handles data seeding on startup:

- **Medicines:** If the database has 0 medicines, the server automatically downloads thousands of real-world US drugs from the **[NIH RxTerms API](https://clinicaltables.nlm.nih.gov/apidoc/rxterms/v3/doc.html)** into your MongoDB database.
- **Local Pharmacies:** If you run locally without a `MONGO_URL`, the server will auto-generate fake pharmacies and attach random stock to them.
- **Production Pharmacies:** If you deploy to production with an empty pharmacy database, the server will inject 3 fake pharmacies and stock them with common medicines like "Acetaminophen" and "Ibuprofen" so the live map isn't completely empty.

### 2. Creating a Pharmacy (Admin Setup)

To test the admin features locally or on the live site:

1. Navigate to the **Sign Up** page.
2. Enter your pharmacy's details (Name, Owner, City, Phone) and create a secure password.
3. Click **Sign Up**. You will be automatically logged into the Pharmacy Dashboard.
4. From the dashboard, you can click **Add Medicine** to start building your inventory.

### 3. User Search Testing

1. Enter a medicine name on the Home page (e.g., a medicine you just added to your pharmacy).
2. Click **Search Nearby**. The app will map pharmacies holding that stock.

### 4. Map Interaction

Click on map markers to view pharmacy details, including contact info, opening hours, and stock status.

---

## 🌍 Environment Variables

Environment variable templates are provided in [`.env.example`](.env.example). Copy this file to create your `.env` files in both `frontend/` and `backend/` directories.

For detailed configuration options, see the [`.env.example`](.env.example) file.

## 🛠️ Common Troubleshooting

- **❌ MongoDB Connection Error (`querySrv ECONNREFUSED _mongodb._tcp...`):**
  - **On Render:** Your MongoDB Atlas cluster is blocking Render's IP. Go to MongoDB Atlas -> Security -> Network Access and add `0.0.0.0/0` (Allow Access From Anywhere).
  - **Local Machine:** Your ISP or router is blocking the special `mongodb+srv` connection string. Here are 3 ways to bypass this backend error:
    1. **Zero-Config Bypass (Easiest):** Open `backend/.env` and leave `MONGO_URL` completely blank (`MONGO_URL=`). The server will automatically use the local in-memory database instead!
    2. **Get Legacy String:** If you _must_ connect to Atlas locally, get the older connection string format. Go to your Atlas Dashboard -> Connect -> Drivers -> Select Node.js **Version 2.2.12**. Copy the long string starting with `mongodb://`.
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

For detailed contribution guidelines, testing requirements, and the development workflow, please see **[CONTRIBUTING.md](CONTRIBUTING.md)**.

**Key points:**
- Only work on issues explicitly assigned to you
- Follow the Conventional Commits format
- Run tests locally before submitting PRs
- Record architectural decisions in [memory.md](memory.md)
- Follow agent behavioral rules in [agent.md](agent.md)

---

## 📜 License

This project is licensed under the AGPL-3.0 License. See the [LICENSE](LICENSE) file for details.

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
