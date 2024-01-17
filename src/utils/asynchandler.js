const asynchandler = (requestHandler) =>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err));
    }
}
export default asynchandler;

/*

//high order function is nothing but 
const asynchandler = ()=>{}
const asynchandler = (fun)=> () =>{}
const asynchandler = (fun)=> async () =>{}


// this is high order function which is allow to use function as a parameter
const asynchandler (fun)=> async (req,res,next)=>{
    try{
        await fun(req,res,next)
    }catch(error){
        res.status(err.code || 401).json({
            success: false,
            message: err.massage
        })
    }

}


*/