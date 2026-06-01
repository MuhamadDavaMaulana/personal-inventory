<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $primaryKey = 'item_id';
    protected $fillable = [
        'user_id', 'category_id', 'name',
        'description', 'quantity', 'condition', 'status', 'image'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function loans()
    {
        return $this->hasMany(Loan::class, 'item_id', 'item_id');
    }
}