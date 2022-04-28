import {body as validBody, validationResult} from 'express-validator'



const validate = (req, res, next)=>{
	validBody('product_name').isLength({min: 6});
	validBody('product_discription').isLength({min: 6})

	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({errors: errors.array()})
}else{
	next();
}
}

export default validate;