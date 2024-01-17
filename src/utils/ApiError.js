

////hendle errors for all the errro in our site
class ApiError extends Error {
    constructor(
        statusCode,
        stack="",
        message="something went wrong",
        errors=[]
    ){
        super(message)
        this.statusCode=statusCode
        this.errors=errors
        this.data=null
        this.message=message
        this.success=false

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }

}

export default ApiError