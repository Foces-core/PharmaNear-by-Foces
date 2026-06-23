import mongoose from "mongoose";
import Medicine from "../models/medicine.js";
import Pharmacy from "../models/pharmacy.js";


export let mongoServerInstance = null;

export const connectDB = async () => {
    let mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      console.log("⚠️ MONGO_URL not found. Starting in-memory MongoDB for local development...");
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongoServerInstance = await MongoMemoryServer.create();
      mongoUrl = mongoServerInstance.getUri();
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log("✅ Connected to MongoDB");

        if(process.env.NODE_ENV === "test") return;

        if (!process.env.MONGO_URL) {
        // Local dev: seed fake pharmacies, medicines, and stock
        const { seedFakeData } = await import("../seedLocalDB.js");
        await seedFakeData();

        }
        // Auto-seed the medicine dictionary if empty (both local and production)
        const medCount = await Medicine.countDocuments();
        if (medCount === 0) {
        console.log("📦 Medicine database is empty. Seeding from NIH RxTerms API...");
        const { fetchDrugs } = await import("../medicine.js");
        // Wait for it to finish so that the production pharmacies seeder can find medicines
        await fetchDrugs().catch(err => console.error("Medicine seed error:", err.message));
        } else {
        console.log(`📦 Medicine database has ${medCount} entries.`);
        }

        // Auto-seed pharmacies if empty
        const pharmacyCount = await Pharmacy.countDocuments();
        if (pharmacyCount === 0) {
        const { seedProdPharmacies } = await import("../seedProdPharmacies.js");
        await seedProdPharmacies();
        }
    }
    catch(err) {
        console.error("❌ Error connecting to MongoDB:", err.message);
        if (err.message.includes("querySrv ECONNREFUSED") || err.message.includes("ENOTFOUND")) {
        console.error("\n========================================================");
        console.error("🚨 LOCAL DNS ERROR DETECTED 🚨");
        console.error("Your local network or ISP is blocking the MongoDB Atlas connection.");
        console.error("To fix this, change your computer's DNS server to 8.8.8.8 (Google)");
        console.error("or set up a local MongoDB instance and change your MONGO_URL.");
        console.error("========================================================\n");
        }
        process.exit(1);
    }
};