<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'users_account';
    protected $primaryKey = 'user_id';

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password'];

    protected $casts = ['password' => 'hashed'];

    public function categories()
    {
        return $this->hasMany(Category::class, 'user_id', 'user_id');
    }

    public function items()
    {
        return $this->hasMany(Item::class, 'user_id', 'user_id');
    }
}