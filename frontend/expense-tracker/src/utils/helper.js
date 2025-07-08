import  moment from 'moment';
export const validateEmail=(email)=>{
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getInitials = (name)=>{
    if(!name) return "";

    const words=name.split(" ");
    let initials="";

    for(let i=0;i<Math.min(words.length,2);i++){
        initials += words[i][0];
    }

    return initials.toUpperCase()
}

export const addThousandsSeperator= (num)=>{
    if(num==null || isNaN(num)) return ""

    const[integerPart , fractionalPart]=num.toString().split(".")
   const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart
        ? `${formattedInteger}.${fractionalPart}`
        : formattedInteger;
}


export const prepareExpenseBarChartData = (data=[])=>{
    const charData =data.map((item)=>({
        category:item?.category,
        amount:item?.amount,
        month: moment(item?.date).format("MMM YYYY"), // 👈 Converts date to "Jul 2025"
    }))
    return charData;
}