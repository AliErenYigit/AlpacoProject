const jwt=require('jsonwebtoken');

const requireAuth=(req,res,next)=>{
    const auth=req.headers.authorization;
    const token=auth.startsWith('Bearer ')?auth.slice(7,auth.length):null;
    if(!token){return res.status(401).json({message:'Yetkilendirme tokeni gerekli.'});}
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.userId;
        next();
    }catch(err){
        return res.status(401).json({message:'Geçersiz token.'});
    }
};

const requireAdmin=(req,res,next)=>{
    const auth=req.headers.authorization;
    const token=auth.startsWith('Bearer ')?auth.slice(7,auth.length):null;
    if(!token){return res.status(401).json({message:'Yetkilendirme tokeni gerekli.'});}
    try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
    req.user = { id: payload.sub, email: payload.email, role: 'admin' };
    next();
  } catch {
    return res.status(401).json({ error: 'unauthorized' });
    }
};

module.exports={requireAuth,requireAdmin};
