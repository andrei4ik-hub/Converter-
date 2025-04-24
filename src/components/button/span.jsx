import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showDropdown, hideDropdown } from "../../slices/dropDownSlice";
import { getDropdown } from "../../api/apiClient";
import "./span.css";

export default function Span({ existingCurrencies = [], onCurrencySelect }) {
    const dispatch = useDispatch();
    const isDropdownVisible = useSelector((state) => state.dropdown.isVisible);
    const [dropdownItems, setDropdownItems] = React.useState([]);

    const handleSpanClick = async () => {
        try {
            const response = await getDropdown();
            const filteredItems = response.filter(
                item => !existingCurrencies.includes(item.curAbbreviation)
            );
            setDropdownItems(filteredItems);
            dispatch(showDropdown());
        } catch (error) {
            console.error("Ошибка при запросе к API:", error);
        }
    };

    const handleCurrencySelect = (abbreviation) => {
        onCurrencySelect(abbreviation);
        dispatch(hideDropdown());
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest(".dropdown-container")) {
                dispatch(hideDropdown());
            }
        };

        if (isDropdownVisible) {
            window.addEventListener("click", handleOutsideClick);
        }

        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [isDropdownVisible, dispatch]);

    return (
        <div className="currency_btn">
            <span className="label" onClick={handleSpanClick}>
                <span className="plus">⊕</span>
                Добавить валюту
            </span>

            {isDropdownVisible && (
                <div className="dropdown-container">
                    <ul className="dropdown">
                        {dropdownItems.map((item, index) => (
                            <li 
                                key={index} 
                                onClick={() => handleCurrencySelect(item.curAbbreviation)}
                            >
                                {item.curAbbreviation} {item.curName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}