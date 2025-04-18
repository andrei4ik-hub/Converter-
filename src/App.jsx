import Header from './components/header'
import NotificationTimer from './components/timer'
import Input from './components/input/input'
import CurrencyDropdown from './components/currencyDropdown'
import CurrencyConverter from './currencyConverter'
import './index.css'
import React, { useState, useEffect } from "react";
import axios from "axios";


const DynamicComponents = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get("http://localhost:3000/api/startItems");
              setItems(response.data); 
          } catch (error) {
              console.error("Error fetching items:", error);
          }
      };

      fetchData();
  }, []);

  return (
      <div className="converter-container">
          {items.map((item, index) => (
              <ItemComponent
                  key={index}
                  Cur_Abbreviation={item.Cur_Abbreviation}
                  Cur_Name={item.Cur_Name}
                  Cur_Rate={item.Cur_Rate}
              />
          ))}
      </div>
  );
};

  
    const ItemComponent = ({ Cur_Abbreviation, Cur_Name, Cur_Rate }) => {
      return (
          <div className="converter-container_item">
              <div className="converter-container_input_line">
                  <p className="valuta">
                      <strong>{Cur_Abbreviation}</strong>
                  </p>
                  <Input rate={Cur_Rate || 0} /> {}
              </div>
              <div className="converter-container__item-currency-name">{Cur_Name}</div>
          </div>
      );
  };
  



export default function App(){
  return(
  <div className='page'>
   
    {/* <NotificationTimer/> */}
   <CurrencyDropdown/>

    <div className='converter-container'>

    
    <DynamicComponents />
    <CurrencyConverter/>

    </div>
    
  
  </div>
  )
}
