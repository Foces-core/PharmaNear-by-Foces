import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import { mongoServerInstance } from "../config/db.js";
import Medicine from "../models/medicine.js";
import Pharmacy from "../models/pharmacy.js";
import Stock from "../models/stock.js";
describe("PharmaNear Full Integration Test Suite", () => {
  let token;
  let otherToken;
  let pharmacyId;
  let otherPharmacyId;
  let testMedicineId;
  const mockPharmacy = {
    user_name: "test_pharma",
    owner_name: "Test Owner",
    city: "Test City",
    phone_number: "9999999999",
    password: "testpassword"
  };
  const otherPharmacy = {
    user_name: "other_pharma",
    owner_name: "Other Owner",
    city: "Other City",
    phone_number: "8888888888",
    password: "otherpassword"
  };
  beforeAll(async () => {
    // Wait until mongoose has established database connection
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => mongoose.connection.once("open", resolve));
    }
  });
  afterAll(async () => {
    // Cleanup database collections
    await Pharmacy.deleteMany({});
    await Medicine.deleteMany({});
    await Stock.deleteMany({});
    
    // Close connection to prevent Jest from hanging
    await mongoose.connection.close();
    if (mongoServerInstance) {
      await mongoServerInstance.stop();
    }
  });

  describe("1. Authentication Endpoints", () => {
    it("should register a new pharmacy successfully (signup)", async () => {
      const response = await request(app)
        .post("/api/pharmacy/signup")
        .send(mockPharmacy);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("pharmacy");
      expect(response.body.pharmacy.user_name).toBe(mockPharmacy.user_name);
      
      token = response.body.token;
      pharmacyId = response.body.pharmacy.id;
    });

    it("should fail signup if required fields are missing", async () => {
      const incompletePharmacy = {
        user_name: "incomplete_pharma"
      };

      const response = await request(app)
        .post("/api/pharmacy/signup")
        .send(incompletePharmacy);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid Entry");
    });

    it("should fail signup if user_name already exists", async () => {
      const response = await request(app)
        .post("/api/pharmacy/signup")
        .send(mockPharmacy);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Pharmacy name already registered");
    });

    it("should login successfully and return a JWT token", async () => {
      const response = await request(app)
        .post("/api/pharmacy/login")
        .send({
          user_name: mockPharmacy.user_name,
          password: mockPharmacy.password
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.pharmacy.user_name).toBe(mockPharmacy.user_name);
    });

    it("should fail login with incorrect password", async () => {
      const response = await request(app)
        .post("/api/pharmacy/login")
        .send({
          user_name: mockPharmacy.user_name,
          password: "wrongpassword"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Password is incorrect");
    });

    it("should fail login for non-existent pharmacy", async () => {
      const response = await request(app)
        .post("/api/pharmacy/login")
        .send({
          user_name: "nonexistent_pharma",
          password: "password123"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Pharmacy is not registered. Please sign up.");
    });
  });

  describe("2. Pharmacy Profile Endpoints", () => {
    beforeAll(async () => {
      // Register the other pharmacy to generate a second valid token for access checks
      const response = await request(app)
        .post("/api/pharmacy/signup")
        .send(otherPharmacy);
      otherToken = response.body.token;
      otherPharmacyId = response.body.pharmacy.id;
    });

    it("should fetch own profile details when authenticated", async () => {
      const response = await request(app)
        .get("/api/pharmacy/profile")
        .query({ user_name: mockPharmacy.user_name })
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.user_name).toBe(mockPharmacy.user_name);
    });

    it("should return 401 when fetching profile without token", async () => {
      const response = await request(app)
        .get("/api/pharmacy/profile")
        .query({ user_name: mockPharmacy.user_name });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No token provided");
    });

    it("should return 403 when fetching another pharmacy's profile", async () => {
      const response = await request(app)
        .get("/api/pharmacy/profile")
        .query({ user_name: mockPharmacy.user_name })
        .set("Authorization", `Bearer ${otherToken}`); // other token requesting my profile

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe("Access denied");
    });

    it("should update own profile details successfully", async () => {
      const updates = {
        user_name: mockPharmacy.user_name,
        address: "New Address Road",
        city: "New City",
        pincode: "123456"
      };

      const response = await request(app)
        .put("/api/pharmacy/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(updates);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Profile updated");
      expect(response.body.pharmacy.address).toBe(updates.address);
      expect(response.body.pharmacy.city).toBe(updates.city);
    });

    it("should return 403 when trying to update another pharmacy's profile", async () => {
      const updates = {
        user_name: mockPharmacy.user_name, // attempting to modify mockPharmacy
        address: "Hack Address"
      };

      const response = await request(app)
        .put("/api/pharmacy/profile")
        .set("Authorization", `Bearer ${otherToken}`) // using otherToken
        .send(updates);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe("Access denied");
    });
  });

  describe("3. Stock CRUD Endpoints", () => {
    it("should add a new medicine to stock (and create medicine entry if missing)", async () => {
      const stockData = {
        medicine_name: "Aspirin",
        quantity: 50,
        price: 5.5,
        strength: "100mg"
      };

      const response = await request(app)
        .post("/api/pharmacy/stock")
        .set("Authorization", `Bearer ${token}`)
        .send(stockData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Stock updated successfully");
      expect(response.body.stock.pharmacy_id).toBe(pharmacyId);
      expect(response.body.stock.medications).toHaveLength(1);
      
      testMedicineId = response.body.stock.medications[0].medicine_id;
    });

    it("should increment quantity if same medicine is added again", async () => {
      const stockData = {
        medicine_name: "Aspirin",
        quantity: 30,
        price: 6.0
      };

      const response = await request(app)
        .post("/api/pharmacy/stock")
        .set("Authorization", `Bearer ${token}`)
        .send(stockData);

      expect(response.statusCode).toBe(200);
      expect(response.body.stock.medications[0].quantity).toBe(80); // 50 + 30
      expect(response.body.stock.medications[0].price).toBe(6.0); // updated to latest price
    });

    it("should fetch stock details populated with medicine information", async () => {
      const response = await request(app)
        .get("/api/pharmacy/stock")
        .query({ pharmacy_id: pharmacyId })
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.pharmacy_id).toBe(pharmacyId);
      expect(response.body.medications).toHaveLength(1);
      expect(response.body.medications[0].medicine_id.name).toBe("Aspirin");
    });

    it("should modify medicine stock details (PATCH)", async () => {
      const updateData = {
        medicine_name: "Aspirin",
        quantity: 120,
        price: 4.99
      };

      const response = await request(app)
        .patch("/api/pharmacy/stock")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Stock updated successfully");
      expect(response.body.stock.medications[0].quantity).toBe(120);
      expect(response.body.stock.medications[0].price).toBe(4.99);
    });

    it("should block attempts to modify another pharmacy's stock (IDOR check)", async () => {
      const updateData = {
        pharmacy_id: pharmacyId, // target mockPharmacy's stock
        medicine_name: "Aspirin",
        quantity: 500,
        price: 1.00
      };

      const response = await request(app)
        .patch("/api/pharmacy/stock")
        .set("Authorization", `Bearer ${otherToken}`) // using otherToken
        .send(updateData);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe("Forbidden: You can only modify your own pharmacy's stock");
    });

    it("should delete a medicine from stock (DELETE)", async () => {
      const deleteData = {
        medicine_name: "Aspirin"
      };

      const response = await request(app)
        .delete("/api/pharmacy/stock")
        .set("Authorization", `Bearer ${token}`)
        .send(deleteData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Medication removed successfully");
      expect(response.body.stock.medications).toHaveLength(0);
    });

    it("should block attempts to delete another pharmacy's stock", async () => {
      // First add stock to otherPharmacy
      await request(app)
        .post("/api/pharmacy/stock")
        .set("Authorization", `Bearer ${otherToken}`)
        .send({
          medicine_name: "Paracetamol",
          quantity: 10,
          price: 2.0
        });

      // Attempt to delete it using my token
      const response = await request(app)
        .delete("/api/pharmacy/stock")
        .set("Authorization", `Bearer ${token}`)
        .send({
          pharmacy_id: otherPharmacyId,
          medicine_name: "Paracetamol"
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe("Forbidden: You can only modify your own pharmacy's stock");
    });
  });

  describe("4. Medicine & Search Endpoints", () => {
    beforeAll(async () => {
      // Setup medicine and stock for search verification
      const medicine = new Medicine({
        name: "Amoxicillin Test",
        strengths: ["500mg"],
        routes: ["Oral"]
      });
      await medicine.save();

      await Stock.create({
        pharmacy_id: pharmacyId,
        medications: [{
          medicine_id: medicine._id,
          quantity: 45,
          price: 15.0
        }]
      });
    });

    it("should return matching medicine list and pharmacies stocking it", async () => {
      const response = await request(app)
        .get("/api/drugs")
        .query({ name: "amoxicillin" }); // Case-insensitive query

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("drug");
      expect(response.body.drug.name).toBe("Amoxicillin Test");
      expect(response.body).toHaveProperty("stocks");
      expect(response.body.stocks).toHaveLength(1);
      expect(response.body.stocks[0].pharmacy_id).toBe(pharmacyId);
      expect(response.body.stocks[0].stock.quantity).toBe(45);
    });

    it("should return 400 if name query parameter is missing", async () => {
      const response = await request(app).get("/api/drugs");
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Medicine name is required");
    });
  });

  describe("5. Health Check Endpoint", () => {
    it("should respond as healthy and return status metrics", async () => {
      const response = await request(app).get("/api/health");
      
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("healthy");
      expect(response.body.database.connected).toBe(true);
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("timestamp");
    });
  });
});
