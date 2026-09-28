const express=require("express")
const {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
}=require("../controllers/budgetController")
const {protect}=require("../middlewares/authMiddleware")

const router=express.Router()

router.post("/add",protect,addBudget)
router.get("/get",protect,getBudgets)
router.put("/:id",protect,updateBudget)
router.delete("/:id",protect,deleteBudget)

module.exports=router
