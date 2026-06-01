<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $primaryKey = 'loan_id';
    protected $fillable = [
        'item_id', 'borrower_name',
        'borrowed_at', 'returned_at', 'note'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'item_id');
    }
}