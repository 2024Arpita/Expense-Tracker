import React from "react"
import {LuTrash2,LuPencil} from "react-icons/lu"
import {addThousandsSeperator} from "../../utils/helper"

const BudgetList=({budgets,onDelete,onEdit})=>{
    const getProgressColor=(percentage)=>{
        if(percentage>=100) return "bg-red-500"
        if(percentage>=80) return "bg-amber-500"
        if(percentage>=50) return "bg-primary"
        return "bg-green-500"
    }

    const getStatusText=(percentage)=>{
        if(percentage>=100) return "Exceeded"
        if(percentage>=80) return "Warning"
        return "On Track"
    }

    const getStatusStyles=(percentage)=>{
        if(percentage>=100) return "bg-red-50 text-red-600"
        if(percentage>=80) return "bg-amber-50 text-amber-600"
        return "bg-green-50 text-green-600"
    }

    const getMonthName=(month)=>{
        return new Date(2000,month-1).toLocaleString("default",{month:"short"})
    }

    return(
        <div className="card">
            <h5 className="text-lg mb-4">Your Budgets</h5>

            {(!budgets || budgets.length===0) ? (
                <p className="text-sm text-gray-400 text-center py-8">
                    No budgets set yet. Create a budget to start tracking your spending.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgets.map((budget)=>(
                        <div key={budget._id} className="group relative border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h6 className="text-sm font-medium text-gray-800">{budget.category}</h6>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {getMonthName(budget.month)} {budget.year}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusStyles(budget.percentage)}`}>
                                        {getStatusText(budget.percentage)}
                                    </span>
                                    <button
                                        className="text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={()=>onEdit(budget)}
                                    >
                                        <LuPencil size={15}/>
                                    </button>
                                    <button
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={()=>onDelete(budget._id)}
                                    >
                                        <LuTrash2 size={15}/>
                                    </button>
                                </div>
                            </div>

                            {/* Spending info */}
                            <div className="flex items-baseline justify-between mb-2">
                                <p className="text-xs text-gray-500">
                                    ₹{addThousandsSeperator(budget.spent)} <span className="text-gray-300">/</span> ₹{addThousandsSeperator(budget.monthlyLimit)}
                                </p>
                                <p className={`text-xs font-medium ${budget.percentage>=100 ? "text-red-500" : budget.percentage>=80 ? "text-amber-500" : "text-gray-500"}`}>
                                    {budget.percentage}%
                                </p>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(budget.percentage)}`}
                                    style={{width:`${Math.min(budget.percentage,100)}%`}}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default BudgetList
