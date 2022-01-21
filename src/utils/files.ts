import fs from 'fs/promises'
import path from 'path';

export const unlinkFile= (filename)=>{
	try {
		if(typeof filename === "object"){
			filename.map(item=>{
				fs.unlink(`../../public/`+item) ;     
			})
			return true;

		}else
		  {  fs.unlink(`../../public/`+filename) ;     
		
		  return true;
		}
	} catch (error) {
		console.log(error)
		return false;
	}
}