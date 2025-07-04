const express=require("express")
const {
    getAllexpense,
    addexpense,
    deleteexpense,
    downloadexpenseExcel
}=require("../controllers/expenseController");
const {protect}=require("../middlewares/authMiddleware")

const router=express.Router();

router.post("/add",protect,addexpense);
router.get("/get",protect,getAllexpense);
router.get("/downloadexcel",protect,downloadexpenseExcel);
router.delete("/:id",protect,deleteexpense);

module.exports=router;