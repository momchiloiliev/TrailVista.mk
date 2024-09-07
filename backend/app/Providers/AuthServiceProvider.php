<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Review;
use App\Models\RidePost;
use App\Models\RideRequest;
use App\Policies\ReviewPolicy;
use App\Policies\RidePostAndRequestPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [

    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
