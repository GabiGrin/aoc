export function debounce<F extends Function>(func:F, wait:number):F {
    let timeoutID;

    return <any>function(this:any, ...args: any[]) {
        clearTimeout(timeoutID);
        const context = this;
  
        timeoutID = setTimeout(function() {
              func.apply(context, args);
        }, wait);
     };
  };