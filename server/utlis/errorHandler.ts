class ErrorHandler extends Error {
   constructor(public message : string ,public statuscode : Number){
     super(message);
     this.statuscode = statuscode;
     Error.captureStackTrace(this,this.constructor);
    }
}

export default ErrorHandler;