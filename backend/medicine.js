import Medicine from "./models/medicine.js";

// MongoDB connection is handled in index.js

// Schema & Model


async function fetchDrugs() {
  try {
    console.log("Fetching drugs from RxTerms API...");

    let allDrugs = [];

    // Loop through A–Z to fetch drugs
    for (let charCode = 65; charCode <= 90; charCode++) {
      const letter = String.fromCharCode(charCode);
      console.log(`Fetching drugs starting with: ${letter}`);

      const response = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${letter}&maxList=5000&ef=STRENGTHS_AND_FORMS`
      );

      const data = await response.json();

      const drugNames = data[1] || [];
      const strengthsInfo = (data[2] && data[2].STRENGTHS_AND_FORMS) || [];

      const drugs = drugNames.map((name, index) => ({
        name,
        strengths: strengthsInfo[index] || [],
        routes: [],
      }));

      allDrugs = [...allDrugs, ...drugs];
    }

    // Deduplicate by name
    allDrugs = Array.from(
      new Map(allDrugs.map((d) => [d.name.toLowerCase(), d])).values()
    );

    console.log("Storing drugs in MongoDB...");

    // Drop the existing collection to clear any old schema/indexes
    await Medicine.collection.drop().catch((err) => {
      if (err.code !== 26) {
        // 26 = namespace not found, which is fine
        console.log(
          "Note: Collection didn't exist or couldn't be dropped:",
          err.message
        );
      }
    });

    // Insert the new data
    try {
      await Medicine.insertMany(allDrugs);
      console.log(`✅ Inserted ${allDrugs.length} drugs into database`);
    } catch (insertError) {
      console.error("Error inserting drugs:", insertError.message);
      throw insertError;
    }
  } catch (error) {
    console.error("Error fetching drugs:", error.message);
    console.error("Full error:", error);
  }
}

export { fetchDrugs };

