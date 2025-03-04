import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
    const [allCoin, setAllCoin] = useState([]);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$"
    });

    // Load environment variables
    const API_URL = import.meta.env.VITE_API_URL || "https://api.coingecko.com/api/v3";
    const API_KEY = import.meta.env.VITE_API_KEY || "";

    const fetchAllCoin = async () => {
        const url = `${API_URL}/coins/markets?vs_currency=${currency.name}`;
        console.log(`Fetching data from: ${url}`);

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: API_KEY
                    ? {
                          accept: "application/json",
                          "x-cg-demo-api-key": API_KEY
                      }
                    : {}
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setAllCoin(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchAllCoin();
    }, [currency]);

    const contextValue = {
        allCoin,
        currency,
        setCurrency
    };

    return <CoinContext.Provider value={contextValue}>{props.children}</CoinContext.Provider>;
};

export default CoinContextProvider;
