import React,{useEffect,useState} from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import {useUserAuth} from "../../hooks/useUserAuth"
import {API_PATHS} from "../../utils/apiPaths"
import toast from "react-hot-toast"
import axiosInstance from "../../utils/axiosinstance"
import Modal from "../../components/Modal"
import AddBudgetForm from "../../components/Budget/AddBudgetForm"
import BudgetList from "../../components/Budget/BudgetList"
import DeleteAlert from "../../components/layouts/DeleteAlert"
import {LuPlus} from "react-icons/lu"
import Input from "../../components/Inputs/Input"

const EXPENSE_CATEGORIES=[
    "Food","Transport","Shopping","Entertainment","Health",
    "Education","Rent","Utilities","Travel","Other"
]

const Budget=()=>{
    useUserAuth()

    const [budgetData,setBudgetData]=useState([])
    const [loading,setLoading]=useState(false)
    const [openAddBudgetModal,setOpenAddBudgetModal]=useState(false)
    const [openDeleteAlert,setOpenDeleteAlert]=useState({show:false,data:null})
    const [editModal,setEditModal]=useState({show:false,data:null})
    const [editForm,setEditForm]=useState({category:"",monthlyLimit:"",month:"",year:""})

    // Get all budgets
    const fetchBudgets=async()=>{
        if(loading) return
        setLoading(true)

        try {
            const response=await axiosInstance.get(API_PATHS.BUDGET.GET_ALL_BUDGETS)
            if(response.data){
                setBudgetData(response.data)
            }
        } catch (error) {
            console.log("Something went wrong. Please try again",error)
        } finally {
            setLoading(false)
        }
    }

    // Handle Add Budget
    const handleAddBudget=async(budget)=>{
        const {category,monthlyLimit,month,year}=budget

        if(!category){
            toast.error("Category is required")
            return
        }

        if(!monthlyLimit || isNaN(monthlyLimit) || Number(monthlyLimit)<=0){
            toast.error("Monthly limit should be a valid number greater than 0")
            return
        }

        try {
            await axiosInstance.post(API_PATHS.BUDGET.ADD_BUDGET,{
                category,
                monthlyLimit:Number(monthlyLimit),
                month:Number(month),
                year:Number(year),
            })

            setOpenAddBudgetModal(false)
            toast.success("Budget created successfully")
            fetchBudgets()
        } catch (error) {
            const msg=error.response?.data?.message || error.message
            toast.error(msg)
        }
    }

    // Handle Edit Budget
    const openEditModal=(budget)=>{
        setEditForm({
            category:budget.category,
            monthlyLimit:budget.monthlyLimit,
            month:budget.month,
            year:budget.year,
        })
        setEditModal({show:true,data:budget})
    }

    const handleUpdateBudget=async()=>{
        if(!editForm.monthlyLimit || isNaN(editForm.monthlyLimit) || Number(editForm.monthlyLimit)<=0){
            toast.error("Monthly limit should be a valid number greater than 0")
            return
        }

        try {
            await axiosInstance.put(API_PATHS.BUDGET.UPDATE_BUDGET(editModal.data._id),{
                category:editForm.category,
                monthlyLimit:Number(editForm.monthlyLimit),
                month:Number(editForm.month),
                year:Number(editForm.year),
            })

            setEditModal({show:false,data:null})
            toast.success("Budget updated successfully")
            fetchBudgets()
        } catch (error) {
            const msg=error.response?.data?.message || error.message
            toast.error(msg)
        }
    }

    // Delete Budget
    const deleteBudget=async(id)=>{
        try {
            await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(id))

            setOpenDeleteAlert({show:false,data:null})
            toast.success("Budget deleted successfully")
            fetchBudgets()
        } catch (error) {
            console.error(
                "Error deleting budget:",
                error.response?.data?.message || error.message
            )
        }
    }

    useEffect(()=>{
        fetchBudgets()
        return ()=>{}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <DashboardLayout activeMenu="Budget">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    {/* Header */}
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="text-lg">Budget Overview</h5>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Set monthly spending limits for each category and get real-time alerts when you're close to exceeding them.
                                </p>
                            </div>
                            <button className="add-btn" onClick={()=>setOpenAddBudgetModal(true)}>
                                <LuPlus className="text-lg"/>
                                Add Budget
                            </button>
                        </div>
                    </div>

                    {/* Budget List */}
                    <BudgetList
                        budgets={budgetData}
                        onDelete={(id)=>setOpenDeleteAlert({show:true,data:id})}
                        onEdit={openEditModal}
                    />
                </div>

                {/* Add Budget Modal */}
                <Modal
                    isOpen={openAddBudgetModal}
                    onClose={()=>setOpenAddBudgetModal(false)}
                    title="Add Budget"
                >
                    <AddBudgetForm onAddBudget={handleAddBudget}/>
                </Modal>

                {/* Edit Budget Modal */}
                <Modal
                    isOpen={editModal.show}
                    onClose={()=>setEditModal({show:false,data:null})}
                    title="Edit Budget"
                >
                    <div>
                        <div className="mb-4">
                            <label className="text-[13px] text-slate-800">Category</label>
                            <select
                                value={editForm.category}
                                onChange={(e)=>setEditForm({...editForm,category:e.target.value})}
                                className="input-box"
                            >
                                {EXPENSE_CATEGORIES.map((cat)=>(
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <Input
                            value={editForm.monthlyLimit}
                            onChange={({target})=>setEditForm({...editForm,monthlyLimit:target.value})}
                            label="Monthly Budget Limit (₹)"
                            placeholder="e.g. 5000"
                            type="number"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="text-[13px] text-slate-800">Month</label>
                                <select
                                    value={editForm.month}
                                    onChange={(e)=>setEditForm({...editForm,month:Number(e.target.value)})}
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
                                    value={editForm.year}
                                    onChange={(e)=>setEditForm({...editForm,year:Number(e.target.value)})}
                                    className="input-box"
                                >
                                    {Array.from({length:5},(_,i)=>{
                                        const y=new Date().getFullYear()-1+i
                                        return <option key={y} value={y}>{y}</option>
                                    })}
                                </select>
                            </div>
                        </div>

                        <div>
                            <button type="button" className="add-btn add-btn-fill w-full justify-center" onClick={handleUpdateBudget}>
                                Update Budget
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Delete Budget Modal */}
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={()=>setOpenDeleteAlert({show:false,data:null})}
                    title="Delete Budget"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this budget?"
                        onDelete={()=>deleteBudget(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    )
}

export default Budget
