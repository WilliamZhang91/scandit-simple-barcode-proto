import React, { useContext, useState } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {

    const [refillList, setRefillList] = useState([]);
    const [product, setProduct] = useState([]);
    const [showStockInput, setShowStockInput] = useState(false)
    const [scanCount, setScanCount] = useState(0)

    return (
        <AppContext.Provider
            value={{
                refillList,
                setRefillList,
                product,
                setProduct,
                showStockInput, 
                setShowStockInput,
                scanCount, 
                setScanCount
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppContext, AppProvider }