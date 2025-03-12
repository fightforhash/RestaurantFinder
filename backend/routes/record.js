import express from "express";
import axios from "axios";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will get a list of all the restaurants.
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("restaurants");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).send("Internal Server Error");
  }
});

// This section will get a single restaurant by id.
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("restaurants");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).send("Internal Server Error");
  }
});

// This section will create a new restaurant.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      location: req.body.location,
      rating: req.body.rating,
      menu: req.body.menu,
    };

    let collection = await db.collection("restaurants");
    let result = await collection.insertOne(newDocument);
    // 201 is more accurate for a newly created resource
    res.status(201).send(result);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).send("Internal Server Error");
  }
});

// This section will update a restaurant by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        location: req.body.location,
        rating: req.body.rating,
        menu: req.body.menu,
      },
    };

    let collection = await db.collection("restaurants");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).send("Internal Server Error");
  }
});

// This section will delete a restaurant.
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    let collection = await db.collection("restaurants");
    let result = await collection.deleteOne(query);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Chat endpoint using RAG (Retrieval-Augmented Generation)
router.post("/chat", async (req, res) => {
  const userMessage = req.body.content || "Please provide a message.";

  // Set headers for SSE (Server-Sent Events)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    // 1. Query MongoDB for relevant restaurants
    const collection = db.collection("restaurants");
    const query = { $text: { $search: userMessage } };
    const results = await collection.find(query).limit(5).toArray();

    // 2. Create context from the top documents
    const context = results
    .map((doc) => {
      console.log("🔍 Raw Menu Data:", JSON.stringify(doc.menu, null, 2)); // Debugging
  
      const menuText = Array.isArray(doc.menu) 
        ? doc.menu.map(m => {
            const dietaryInfo = Array.isArray(m.dietaryRestrictions) && m.dietaryRestrictions.length > 0
              ? `Dietary: ${m.dietaryRestrictions.join(", ")}`
              : "No dietary info";
            
            const spiceLevel = m.spiceLevel !== undefined ? `Spice Level: ${m.spiceLevel}/5` : "No spice info";
  
            return `${m.name} (${m.cuisine}, ${dietaryInfo}, ${spiceLevel}, $${m.price})`;
          }).join(", ")
        : "No menu available";
  
      return `
      🔹 **Restaurant Name:** ${doc.name}
      📍 **Location:** ${doc.location.address}, ${doc.location.city}, ${doc.location.district}
      ⭐ **Rating:** ${doc.rating}/5
      🍽️ **Menu:** ${menuText}
      `;
    })
    .join("\n\n");
    // 🔥 Stronger DAG Prompt
    const augmentedPrompt = `
    You are an advanced restaurant assistant. Your responses must be strictly based on the data provided below.
    If the information requested is not found in the provided data, simply say: "I don't have that information."

    DO NOT attempt to make up an answer. Only respond with details explicitly present in the data.

    ### 📌 Restaurant Data:
    ${context}

    ### 🔎 User Query:
    ${userMessage}

    ### 📝 Your Response:
    `;
    // 3. Send the request to Gemma 2:2b
    const axiosResponse = await axios({
      method: "post",
      url: "http://localhost:11434/api/generate",
      data: {
        model: "gemma2:2b",
        prompt: augmentedPrompt,
      },
      responseType: "stream",
    });

    // 4. Stream the response back to the client
    axiosResponse.data.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      if (chunkStr.trim()) {
        res.write(`data: ${chunkStr}\n\n`);
      }
    });

    axiosResponse.data.on("end", () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });

    axiosResponse.data.on("error", (error) => {
      console.error("Error during streaming:", error);
      res.write("data: Error occurred during streaming\n\n");
      res.end();
    });
  } catch (error) {
    console.error("Error during RAG chat:", error);
    res.status(500).write("data: Internal Server Error\n\n");
    res.end();
  }
});

export default router;