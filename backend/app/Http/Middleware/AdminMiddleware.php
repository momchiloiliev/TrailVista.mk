<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware 
{


    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->isAdmin) {  // Assuming 'is_admin' is the flag for admin users
            return $next($request);
        }

        return redirect('/');  // Redirect non-admins to homepage or error page
    }

}