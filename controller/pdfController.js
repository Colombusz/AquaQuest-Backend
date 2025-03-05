import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import User from "../models/User.js";
import WaterBill from "../models/WaterBill.js";
import Prediction from "../models/Prediction.js";

export const generateUserPDF = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user ID
        const user = await User.findById(userId);
        const bills = await WaterBill.find({ user: userId });
        const predictions = await Prediction.find({ user: userId });

        if (!user) return res.status(404).json({ message: "User not found" });

        const chartData = {
            labels: bills.map((bill) => bill.billDate.toISOString().split("T")[0]),
            consumption: bills.map((bill) => bill.waterConsumption),
            billAmount: bills.map((bill) => bill.billAmount),
            predictedConsumption: predictions.map((p) => p.predictedConsumption),
            predictedAmount: predictions.map((p) => p.predictedAmount),
        };

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>User Report - Aqua Quest</title>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <style>
            /* 🔹 General Page Styling */
            body { 
              font-family: 'Arial', sans-serif; 
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
        
            /* 🔹 Header with Logos */
            .header {
              background-color: #0044cc !important;
              color: white;
              padding: 15px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .header .logo {
              height: 50px;
              /* Adjust width if needed, or use auto */
            }
            .header .title {
              flex-grow: 1;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1.5px;
            }
        
            /* 🔹 Container */
            .container {
              width: 90%;
              margin: 30px auto;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
        
            h1, h2 {
              color: #333;
              text-align: center;
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
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: center;
            }
            th {
              background-color: #007bff !important;
              color: white;
              font-weight: bold;
            }
        
            /* 🔹 Charts */
            .chart-container {
              margin: 20px auto;
              width: 100%;
              max-width: 600px;
            }
          </style>
        </head>
        <body>
        
          <!-- 🔹 Aqua Quest Header with Logos -->
          <div class="header">
            <img src="http://localhost:5000/images/AQLogo.png" alt="Aqua Quest Logo" class="logo">
            <div class="title">Aqua Quest - Water Usage Report</div>
            <img src="http://localhost:5000/images/TUPLogo.png" alt="University Logo" class="logo">
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
              ${bills.map((bill) => `
              <tr>
                <td>${bill.billDate.toISOString().split("T")[0]}</td>
                <td>${bill.waterConsumption}</td>
                <td>$${bill.billAmount.toFixed(2)}</td>
              </tr>
              `).join('')}
            </table>
        
            <!-- 🔹 Charts -->
            <div class="chart-container">
              <h2>Water Consumption Over Time</h2>
              <canvas id="waterConsumptionChart"></canvas>
            </div>
        
            <div class="chart-container">
              <h2>Predicted Water Consumption</h2>
              <canvas id="predictedConsumptionChart"></canvas>
            </div>
        
            <div class="chart-container">
              <h2>Water Bill Trend</h2>
              <canvas id="waterBillChart"></canvas>
            </div>
        
            <div class="chart-container">
              <h2>Predicted Water Bill Amount</h2>
              <canvas id="predictedBillChart"></canvas>
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
              },
              options: { responsive: true }
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
              },
              options: { responsive: true }
            });
        
            // Water Bill Chart
            new Chart(document.getElementById("waterBillChart"), {
              type: "line",
              data: {
                labels: labels,
                datasets: [{
                  label: "Water Bill ($)",
                  data: ${JSON.stringify(chartData.billAmount)},
                  borderColor: "blue",
                  borderWidth: 2,
                  fill: false
                }]
              },
              options: { responsive: true }
            });
        
            // Predicted Water Bill Chart
            new Chart(document.getElementById("predictedBillChart"), {
              type: "line",
              data: {
                labels: labels,
                datasets: [{
                  label: "Predicted Water Bill ($)",
                  data: ${JSON.stringify(chartData.predictedAmount)},
                  borderColor: "red",
                  borderWidth: 2,
                  fill: false
                }]
              },
              options: { responsive: true }
            });
          </script>
        
        </body>
        </html>
        `;
        


        // Launch Puppeteer to generate the PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        // Generate PDF
        const pdfPath = path.join("temp", `user_${userId}.pdf`);
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
