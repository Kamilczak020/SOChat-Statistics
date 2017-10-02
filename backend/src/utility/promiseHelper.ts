// A wrapper method for promises, that allows for error handling without try/catch
export function to(promise: Promise<any>): Promise<any> {  
    return promise.then(data => {
       return [null, data];
    })
    .catch(err => [err]);
 }