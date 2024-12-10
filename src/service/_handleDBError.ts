import ServiceError from "../core/serviceError";

const handleDBError = (error: any) => {
   
    const { code = '', message } = error;

    // "Unique constraint failed on the {constraint}"
    if (code === 'P2002') {

        switch(true){
       
        case (error.meta && error.meta.target && error.meta.target.includes('Product')):
            throw ServiceError.validationFailed('Een product met dezelfde waarde bestaat al.');
        case message.includes('idx_user_email_unique'):
            throw ServiceError.validationFailed('Er bestaat al een user met dit email-adres');
        case message.includes('idx_user_name_unique'):
            throw ServiceError.validationFailed('Er bestaat al een user met deze naam');
        default:
            throw ServiceError.validationFailed('The item already exists');
        } 
    }  


    //"An operation failed because it depends on 
  //one or more records that were required but not found. {cause}"
  
    if (code === 'P2025') {
        switch (true) {
          case message.includes('fk_user'):
            throw ServiceError.notFound('This user does not exist');
          case message.includes('fk_product_orderProduct'):
            throw ServiceError.notFound('This product does not exist');
          case message.includes('fk_order'):
            throw ServiceError.notFound('This order does not exist')
          case message.includes('user'):
            throw ServiceError.notFound('No user with this id exists');
          case message.includes('order'):
            throw ServiceError.notFound('No order with this id exists');
          case message.includes('product'):
            throw ServiceError.notFound('No product with this id exists');
        }
      }


    
};

export default handleDBError;

