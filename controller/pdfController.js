import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import User from "../models/User.js";
import WaterBill from "../models/WaterBill.js";
import Prediction from "../models/Prediction.js";
import Save from "../models/Save.js";
import { getWaterSavingTips } from "./chartAnalytics.js";
import { Groq } from "groq-sdk";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const tempDir = path.join("../", "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}



export const generateUserPDF = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user ID
    const user = await User.findById(userId);
    const bills = await WaterBill.find({ user: userId }).sort({ billDate: -1 });
    const predictions = await Prediction.find({ user: userId });

    if (!user) return res.status(404).json({ message: "User not found" });
    const savedData = await Save.find({ user: userId }).populate('waterBill').populate('prediction');

    const savedChartData = {
      labels: savedData.map((save) => save.month.toISOString().split("T")[0]),
      savedConsumption: savedData.map((save) => save.savedConsumption),
      savedCost: savedData.map((save) => save.savedCost),
    };
    const chartData = {
      labels: bills.map((bill) => bill.billDate.toISOString().split("T")[0]).reverse(),
      consumption: bills.map((bill) => bill.waterConsumption).reverse(),
      billAmount: bills.map((bill) => bill.billAmount).reverse(),
      predictedConsumption: predictions.map((p) => p.predictedConsumption).reverse(),
      predictedAmount: predictions.map((p) => p.predictedAmount).reverse(),
    };

    const tips = await fetchWaterSavingTips(userId);
    const tipsString = tips.map(tip => `<li>${tip}</li>`).join("");

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>User Report - Aqua Quest</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
    /* 🔹 Fixed Header */
    .header {
      display: flex;
      align-items: center;
      background-color: #0044cc;
      justify-content: space-between;
      padding: 10px 20px;
      gap: 10px;
      width: 100vw; /* Ensures full viewport width */
      max-width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      height: 80px; /* Adjusted to fit logos */
      box-sizing: border-box; /* Prevents padding from affecting width */
      overflow: hidden; /* Prevents content from overflowing */
    }

    /* 🔹 Logo Styling */
    .header .logo {
      height: 60px; /* Ensures logos fit */
      max-width: 60px;
      object-fit: contain; /* Prevents cropping */
      flex-shrink: 0; /* Ensures logos don’t shrink */
    }

    /* 🔹 Title */
    .header .title {
      flex-grow: 1;
      max-width: 70%; /* Ensures it doesn’t get squeezed */
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: white;
    }

    /* 🔹 Prevent Content from Hiding Behind Header */
    .container {
      width: 90%;
      margin: auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      margin-top: 50px; /* Adjusted for new header height */
    }

  /* 🔹 Page Title */  
    h1, h2 {
      color: #333;
      text-align: center;
      margin-bottom: 10px;
    }

    /* 🔹 User Info Card */
    .user-info {
      background: #f4f4f4;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .user-info p {
      margin: 5px 0;
      font-size: 16px;
    }

    /* 🔹 Table Styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }
    th {
      background-color: #007bff;
      color: white;
      font-weight: bold;
    }

    /* 🔹 Charts Layout */
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
       clear: both
    }
    .chart-container {
      text-align: center;
      padding: 15px;
      background:rgba(249, 249, 249, 0.72);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .chart-container.canvas {
      max-width: 100%;
    }
    
    .saved-charts-row {
      margin-top: 20px; /* Reset margin top */
      page-break-before: always; /* Force page break before saved charts row */
      padding-top: 100px; /* Add padding to ensure it is not hidden under the header */
    }

    .tips-section {
      width: 95%;
      padding: 20px;
      background: #eef7ff;
      border-left: 5px solid #0044cc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-top: 20px; /* Adjusted for better spacing */
    }

    .tips-section h2 {
      color: #0044cc;
      text-align: left;
      margin-bottom: 10px;
    }
    .tips-section ul {
      padding-left: 20px;
    }
    .tips-section li {
      margin: 8px 0;
      font-size: 16px;
    }
  </style>
</head>
<body>

  <!-- 🔹 Aqua Quest Header with Logos -->
  <div class="header">
    <img src="https://res.cloudinary.com/dlqclovym/image/upload/v1741415631/483330529_1117583343452346_1194312538355938130_n_pjlzhe.png" alt="Aqua Quest Logo" class="logo">
    <div class="title">Aqua Quest - Water Usage Report</div>
    <img src="https://res.cloudinary.com/dlqclovym/image/upload/v1741415630/405937484_351953450762266_2348969723812141730_n_gnfobm.png" alt="University Logo" class="logo">
  </div>

  <div class="container">
    <h1>User Report</h1>

    <!-- 🔹 User Information -->
    <div class="user-info">
      <p><strong>Name:</strong> ${user.first_name} ${user.last_name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Address:</strong> ${user.address}</p>
    </div>

    <!-- 🔹 Water Consumption Table -->
    <h2>Water Consumption History</h2>
    <table>
      <tr>
        <th>Date</th>
        <th>Water Consumption (m³)</th>
        <th>Bill Amount (₱)</th>
      </tr>
      ${bills.slice(0, 4).map((bill) => `
      <tr>
        <td>${bill.billDate.toISOString().split("T")[0]}</td>
        <td>${bill.waterConsumption}</td>
        <td>₱${bill.billAmount.toFixed(2)}</td>
      </tr>
      `).join('')}
    </table>

    <!-- 🔹 Charts Section -->
    <h2>Water Consumption & Bill Trends</h2>
    <div class="charts-grid">
      <div class="chart-container">
        <h3>Water Consumption Over Time</h3>
        <canvas id="waterConsumptionChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>Predicted Water Consumption</h3>
        <canvas id="predictedConsumptionChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>Water Bill Trend</h3>
        <canvas id="waterBillChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>Predicted Water Bill Amount</h3>
        <canvas id="predictedBillChart"></canvas>
      </div>
    </div>
    <div class="charts-grid saved-charts-row">
      <div class="chart-container">
        <h3>Saved Water Consumption</h3>
        <canvas id="savedConsumptionChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>Saved Water Cost</h3>
        <canvas id="savedCostChart"></canvas>
      </div>
    </div>
    
    <!-- 🔹 Water Saving Tips -->
    <div class="tips-section">
      <h2>Water-Saving Recommendations</h2>
      <ul>
        ${tipsString}
      </ul>
    </div>
  </div>
    
  <script>
    const labels = ${JSON.stringify(chartData.labels)};
    // Water Consumption Chart
    new Chart(document.getElementById("waterConsumptionChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Water Consumption (m³)",
          data: ${JSON.stringify(chartData.consumption)},
          backgroundColor: "rgba(54, 162, 235, 0.8)",
        }]
      }
    });

    // Predicted Water Consumption Chart
    new Chart(document.getElementById("predictedConsumptionChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Predicted Water Consumption (m³)",
          data: ${JSON.stringify(chartData.predictedConsumption)},
          backgroundColor: "rgba(75, 192, 192, 0.8)",
        }]
      }
    });

    // Water Bill Chart
    new Chart(document.getElementById("waterBillChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Water Bill (₱)",
          data: ${JSON.stringify(chartData.billAmount)},
          borderColor: "blue",
          borderWidth: 2,
          fill: false
        }]
      }
    });

    // Predicted Water Bill Chart
    new Chart(document.getElementById("predictedBillChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Predicted Water Bill (₱)",
          data: ${JSON.stringify(chartData.predictedAmount)},
          borderColor: "red",
          borderWidth: 2,
          fill: false
        }]
      }
    });

    // Saved Water Consumption Chart
    new Chart(document.getElementById("savedConsumptionChart"), {
      type: "line",
      data: {
        labels: ${JSON.stringify(savedChartData.labels)},
        datasets: [{
          label: "Saved Water Consumption (m³)",
          data: ${JSON.stringify(savedChartData.savedConsumption)},
          borderColor: "green",
          borderWidth: 2,
          fill: false
        }]
      }
    });

    // Saved Water Cost Chart
    new Chart(document.getElementById("savedCostChart"), {
      type: "line",
      data: {
        labels: ${JSON.stringify(savedChartData.labels)},
        datasets: [{
          label: "Saved Water Cost (₱)",
          data: ${JSON.stringify(savedChartData.savedCost)},
          borderColor: "purple",
          borderWidth: 2,
          fill: false
        }]
      }
    });
  </script>

</body>
</html>
`;


    // Launch Puppeteer to generate the PDF
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_KEY}`,
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfPath = path.join(tempDir, `user_${userId}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true
    });

    await browser.close();
    // Send the file for download
    res.download(pdfPath, `User_Report_${userId}.pdf`, (err) => {
      if (!err) {
        fs.unlinkSync(pdfPath); // Delete file after download
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};


const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const fetchWaterSavingTips = async (userId) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("Error: Groq API key is missing.");
      return ["Groq API key is missing. Please configure it properly."];
    }

    // Fetch user's water bill data
    const userBills = await WaterBill.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $substr: ["$billDate", 0, 7] },
          totalCost: { $sum: "$billAmount" },
          totalConsumption: { $sum: "$waterConsumption" }
        }
      },
      { $sort: { "_id": -1 } },
    ]);

    if (userBills.length === 0) {
      console.warn(`No water bills found for user ${userId}`);
      return [
        "No water bill data available. Try general tips: Reduce shower time, fix leaks, use efficient appliances."
      ];
    }

    // Construct prompt
    const prompt = `You are a water conservation expert. Based on this data, provide 4 actionable tips to save water:\n\n${userBills
      .map(entry => `Month: ${entry._id}, Consumption: ${entry.totalConsumption}L, Cost: ${entry.totalCost} PHP`)
      .join("\n")}`;

    console.log("Prompt sent to Groq:", prompt);

    let response;
    let maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        response = await groqClient.chat.completions.create({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are a helpful assistant providing water-saving tips." },
            { role: "user", content: prompt }
          ],
          max_tokens: 700,
          temperature: 0.7,
        });

        if (response.choices?.[0]?.message?.content) {
          break;
        }
      } catch (error) {
        console.error(`Groq API error on attempt ${attempt}:`, error);
        if (attempt === maxRetries || !error.message.includes("ECONNRESET")) {
          return ["Failed to fetch water-saving tips. Try general tips like fixing leaks and reducing water usage."];
        }
      }
    }

    if (!response || !response.choices?.[0]?.message?.content) {
      console.error("Groq API response is empty.");
      return ["Failed to generate water-saving tips. Use general water conservation methods."];
    }

    const tipsText = response.choices[0].message.content;
    console.log("Raw Groq Tips Response:", tipsText);

    const tips = [];
    const tipsTextArray = tipsText.split("\n");

    let currentTip = "";

    tipsTextArray.forEach(line => {
      if (/^\*\*Tip \d+:/.test(line)) {
        if (currentTip) tips.push(currentTip.trim());
        currentTip = line.trim();
      } else if (currentTip) {
        currentTip += " " + line.trim();
      }
    });

    if (currentTip) tips.push(currentTip.trim());

    console.log("Extracted Tips:", tips.slice(0, 4));

    return tips.length > 0 ? tips.slice(0, 4) : [
      "Reduce shower time",
      "Fix leaking pipes",
      "Use water-efficient appliances",
      "Collect rainwater for gardening"
    ];
  } catch (error) {
    console.error("Error fetching water-saving tips:", error);
    return ["Error occurred. Use general tips like fixing leaks and reducing water usage."];
  }
};
