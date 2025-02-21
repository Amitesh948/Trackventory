import { HttpInterceptorFn } from '@angular/common/http';

export const SetInterceptorService: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  console.log('token',token);
  
  if (token) {
    const clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(clonedReq);
  }

  return next(req);
};
