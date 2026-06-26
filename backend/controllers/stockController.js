import Medicine from "../models/medicine.js";
import Stock from "../models/stock.js";

export const addStock = async (req,res) => {
    try {
        const { medicine_name, quantity, price, strength } = req.body;
    
        // Use authenticated user's ID to prevent IDOR vulnerability
        const pharmacy_id = req.user.id;
    
        // Validation
        if (!pharmacy_id)
          return res.status(400).json({ message: "Pharmacy ID is required" });
        if (!medicine_name)
          return res.status(400).json({ message: "Medicine name is required" });
        if (!quantity || quantity <= 0)
          return res.status(400).json({ message: "Valid quantity is required" });
        if (!price || price <= 0)
          return res.status(400).json({ message: "Valid price is required" });
    
        // Escape special regex characters in medicine_name to prevent ReDoS
        const escapedMedicineName = medicine_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Find medicine by name (case-insensitive exact match)
        let medicine = await Medicine.find({
          name: new RegExp(`^${escapedMedicineName}$`, "i"),
        });
    
        if (medicine.length > 1) {
          return res
            .status(400)
            .json({ message: "Multiple medicines found with the same name" });
        }
    
        let medicineDoc;
        if (medicine.length === 0) {
          // Create new medicine
          medicineDoc = new Medicine({
            name: medicine_name,
            strengths: strength ? [strength] : [],
            routes: [],
          });
          await medicineDoc.save();
        } else {
          medicineDoc = medicine[0];
        }
    
        const medicine_id = medicineDoc._id;
    
        // Find stock for pharmacy
        let stock = await Stock.findOne({ pharmacy_id });
    
        if (stock) {
          // Update or insert medication
          const existingMedication = stock.medications.find(
            (med) => med.medicine_id.toString() === medicine_id.toString()
          );
    
          if (existingMedication) {
            existingMedication.quantity += parseInt(quantity);
            existingMedication.price = parseFloat(price);
          } else {
            stock.medications.push({
              medicine_id,
              quantity: parseInt(quantity),
              price: parseFloat(price),
            });
          }
          await stock.save();
        } else {
          // Create new stock document
          stock = new Stock({
            pharmacy_id,
            medications: [
              {
                medicine_id,
                quantity: parseInt(quantity),
                price: parseFloat(price),
              },
            ],
          });
          await stock.save();
        }
    
        res.json({ message: "Stock updated successfully", stock });
      } catch (error) {
        console.error("Error creating/updating stock:", error);
        res.status(500).json({ message: "Server error" });
      }
};

export const getStock = async (req,res) => {
    try {
        console.log("Fetching stock for pharmacy_id:", req.query.pharmacy_id);
    
        const pharmacy_id = req.query.pharmacy_id || req.user?.id;
        if (!pharmacy_id) {
          console.log("No pharmacy_id provided");
          return res
            .status(400)
            .json({ message: "Pharmacy ID not found in request" });
        }
    
        const stock = await Stock.findOne({ pharmacy_id }).populate(
          "medications.medicine_id"
        );
        console.log("Stock found:", stock);
    
        if (!stock) {
          return res.status(404).json({ message: "No stock found" });
        }
    
        res.json(stock);
      } catch (error) {
        console.error("Error fetching stock:", error);
        res.status(500).json({ message: "Server error" });
      }
};

export const updateStock = async (req,res) => {
    try {
    const { medicine_name, quantity, price } = req.body;
    console.log("Request body:", req.body);

    // Use authenticated user's ID to prevent IDOR vulnerability
    const pharmacy_id = req.user.id;

    // Block attempts to modify another pharmacy's stock
    if (req.body.pharmacy_id && req.body.pharmacy_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You can only modify your own pharmacy's stock" });
    }

    if (!pharmacy_id || !medicine_name || !quantity || !price) {
      return res.status(400).json({ message: "Invalid stock data" });
    }

    const medicine = await Medicine.findOne({
      name: { $regex: medicine_name, $options: "i" },
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const stock = await Stock.findOne({
      pharmacy_id,
      "medications.medicine_id": medicine._id,
    });
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    const existingMedication = stock.medications.find(
      (med) => med.medicine_id.toString() === medicine._id.toString()
    );
    if (!existingMedication)
      return res.status(404).json({ message: "Medication not found in stock" });

    existingMedication.quantity = parseInt(quantity, 10);
    existingMedication.price = parseFloat(price);

    await stock.save();
    res.json({ message: "Stock updated successfully", stock });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteStock = async (req,res) => {
    try {
        const { medicine_name } = req.body;
    
        // Use authenticated user's ID to prevent IDOR vulnerability
        const pharmacy_id = req.user.id;
    
        // Block attempts to delete another pharmacy's stock
        if (req.body.pharmacy_id && req.body.pharmacy_id !== req.user.id) {
          return res.status(403).json({ message: "Forbidden: You can only modify your own pharmacy's stock" });
        }
    
        if (!pharmacy_id || !medicine_name) {
          return res.status(400).json({ message: "Invalid stock data" });
        }
    
        const medicine = await Medicine.findOne({
          name: { $regex: medicine_name, $options: "i" },
        });
        if (!medicine) {
          return res.status(404).json({ message: "Medicine not found" });
        }
    
        const stock = await Stock.findOne({ pharmacy_id });
        if (!stock) {
          return res.status(404).json({ message: "Stock not found" });
        }
        // Find the index of the medication entry to remove
        const existingMedicationIndex = stock.medications.findIndex(
          (med) => med.medicine_id.toString() === medicine._id.toString()
        );
        if (existingMedicationIndex === -1) {
          return res.status(404).json({ message: "Medication not found in stock" });
        }
        // Remove the medication entry
        stock.medications.splice(existingMedicationIndex, 1);
        await stock.save();
        res.json({ message: "Medication removed successfully", stock });
      } catch (error) {
        console.error("Error removing stock:", error);
        res.status(500).json({ message: "Server error" });
      }
};