import "dotenv/config"
export const aiFetch=async(req,res)=>{
    const {description}=req.body
    try{
        const url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
        const request = {
            contents: [{ parts: [{ text: description }] }],
          };
      const response=await fetch(url,{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(request)
      })
      res.send(response)
    }catch(err){
        res.status(500).json({message:"internal server error in aiFetch"})
    }
}