import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors"; // Import cors middleware

const app = express();
const PORT = 5000;
// Enable CORS for all origins
app.use(cors());

// Define a route to fetch and return the price

// ok  mind_usdt
app.get("/price/wmind", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://mindchain.info/Api/Index/singlemarketInfo/market/mind_usdt"
    );

    const price = response?.data?.data?.new_price;
    const change = response?.data?.data?.change;
    res.json({ price, change });
  } catch (error) {
    console.error("Error fetching price:", error);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

app.get("/price/bmind", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://mindchain.info/Api/Index/singlemarketInfo/market/bmind_musd"
    );

    // const price = response.data.data.new_price;
    // const change = response.data.data.change;
    const price = "0.02";
    const change = "0.10";
    res.json({ price, change });
  } catch (error) {
    console.error("Error fetching price:", error);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

// ok
app.get("/price/pmind", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://mindchain.info/Api/Index/singlemarketInfo/market/pmind_musd"
    );
    const price = response.data.data.new_price;
    const change = response.data.data.change;
    res.json({ price, change });
  } catch (error) {
    console.error("Error fetching price:", error);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

// ok
app.get("/price/musd", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://mindchain.info/Api/Index/singlemarketInfo/market/musd_usdt"
    );
    const price = response.data.data.new_price;
    const change = response.data.data.change;
    res.json({ price, change });
  } catch (error) {
    console.error("Error fetching price:", error);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

// customize api response
app.get("/", async (req: Request, res: Response) => {
  try {
    const registryResponse = await axios.get(
      "https://msc-token-registry.vercel.app/"
    );
    const tokens = registryResponse.data.data;

    const tokenNames = Object.keys(tokens);

    const updatedTokens = await Promise.all(
      tokenNames.map(async (tokenName) => {
        const token = tokens[tokenName];
        const priceResponse = await axios.get(
          `${token.PRICE_API}/${token.SYMBOL}`
        );
        return {
          ...token,
          PRICE_API: {
            price: priceResponse.data.price,
            change: priceResponse.data.change,
          },
        };
      })
    );

    const result = tokenNames.reduce((acc, tokenName, index) => {
      acc[tokenName] = updatedTokens[index];
      return acc;
    }, {} as Record<string, any>);

    res.json({ status: 1, data: result });
  } catch (error) {
    console.error("Error fetching token data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
