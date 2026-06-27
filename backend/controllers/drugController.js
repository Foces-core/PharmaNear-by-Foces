import Medicine from "../models/medicine.js";
import Stock from "../models/stock.js";


export const searchDrugs = async (req,res) => {
    const medicine_name = req.query.name;
    
      if (!medicine_name) {
        return res.status(400).json({ message: "Medicine name is required" });
      }
    
      const drugs = await Medicine.find({
        name: { $regex: medicine_name, $options: "i" },
      });
      if (drugs.length === 0) {
        return res.json({ message: "No drugs found" });
      }
    
      // Find all pharmacies that have the medicine
      const stocks = await Stock.find({
        "medications.medicine_id": drugs[0]._id,
      }).populate('pharmacy_id','user_name address city state pincode latitude longitude phone_number closing_hours location_url');
      
      if (stocks.length === 0) {
        return res.json({ message: "No stock found" });
      }
    
      // Map each pharmacy to its specific medicine entry
      const result = stocks.map((stock) => {
        const medicationEntry = stock.medications.find(
          (m) => m.medicine_id.toString() === drugs[0]._id.toString()
        );
        return {
          pharmacy: stock.pharmacy_id,
          stock: medicationEntry,
        };
      });
      
      res.json({ drug: drugs[0], stocks: result });
};