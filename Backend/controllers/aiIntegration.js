import "dotenv/config"
export const aiFetch=async(req,res)=>{
    const {description}=req.body
    if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }
    try{
        const url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
        const request = {
            contents: [{ parts: [{ text: description }] }],
          };
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
          });
      
      const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text.trim();
    res.status(200).json({data:textResponse})
}catch(err){
        res.status(500).json({message:"internal server error in aiFetch"})
    }
}