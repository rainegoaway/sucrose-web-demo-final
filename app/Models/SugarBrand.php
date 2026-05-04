<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SugarBrand extends Model
{
    protected $primaryKey = 'brand_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'brand_id',
        'brand_name',
        'is_active',
    ];

    protected $appends = ['sugar_types'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function getSugarTypesAttribute()
    {
        return $this->hasMany(BrandSugarType::class, 'brand_id', 'brand_id')
            ->pluck('sugar_type')
            ->toArray();
    }

    public function sugarTypeRecords()
    {
        return $this->hasMany(BrandSugarType::class, 'brand_id', 'brand_id');
    }

    public function markets()
    {
        return $this->belongsToMany(Market::class, 'market_sugar_brand', 'brand_id', 'market_id')
            ->withTimestamps();
    }
}

