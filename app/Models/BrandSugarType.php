<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandSugarType extends Model
{
    protected $table = 'brand_sugar_types';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'brand_id',
        'sugar_type',
    ];

    public function brand()
    {
        return $this->belongsTo(SugarBrand::class, 'brand_id', 'brand_id');
    }
}
