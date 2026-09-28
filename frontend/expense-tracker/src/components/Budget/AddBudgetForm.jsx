import React,{useState} from "react"
import Input from "../Inputs/Input"

const EXPENSE_CATEGORIES=[
    "Food","Transport","Shopping","Entertainment","Health",
    "Education","Rent","Utilities","Travel","Other"
]

const AddBudgetForm=({onAddBudget})=>{
    const now=new Date()
    const [budget,setBudget]=useState({
        category:"",
        monthlyLimit:"",
        month:now.getMonth()+1, // 1-12
        year:now.getFullYear(),
    })

    const handleChange=(key,value)=>setBudget({...budget,[key]:value})

    return(
        <div>
            <div className="mb-4">
                <label className="text-[13px] text-slate-800">Category</label>
                <select
                    value={budget.category}
                    onChange={(e)=>handleChange("category",e.target.value)}
                    className="input-box"
                >
                    <option value="">Select a category</option>
                    {EXPENSE_CATEGORIES.map((cat)=>(
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <Input
                value={budget.monthlyLimit}
                onChange={({target})=>handleChange("monthlyLimit",target.value)}
                label="Monthly Budget Limit (₹)"
                placeholder="e.g. 5000"
                type="number"
            />

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="text-[13px] text-slate-800">Month</label>
                    <select
                        value={budget.month}
                        onChange={(e)=>handleChange("month",Number(e.target.value))}
                        className="input-box"
                    >
                        {Array.from({length:12},(_,i)=>(
                            <option key={i+1} value={i+1}>
                                {new Date(2000,i).toLocaleString("default",{month:"long"})}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-[13px] text-slate-800">Year</label>
                    <select
                        value={budget.year}
                        onChange={(e)=>handleChange("year",Number(e.target.value))}
                        className="input-box"
                    >
                        {Array.from({length:5},(_,i)=>{
                            const y=now.getFullYear()-1+i
                            return <option key={y} value={y}>{y}</option>
                        })}
                    </select>
                </div>
            </div>

            <div>
                <button type="button" className="add-btn add-btn-fill w-full justify-center" onClick={()=>onAddBudget(budget)}>
                    Add Budget
                </button>
            </div>
        </div>
    )
}

export default AddBudgetForm
