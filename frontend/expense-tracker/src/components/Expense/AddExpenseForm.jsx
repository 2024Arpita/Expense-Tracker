import React, { useState } from "react";
import Input from "./../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";


const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });
  const handleChange = (key, value) =>  setExpense({ ...expense, [key]: value });
  return (
    <div>
        <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon)=> handleChange("icon",selectedIcon)}/>
      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label=" Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="">
        <button type="button" className="" onClick={() => onAddExpense(expense)}>
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;