<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Market extends Model
{
    protected $primaryKey = 'market_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'market_id',
        'city_id',
        'market_name',
        'address',
        'latitude',
        'longitude',
        'market_type',
        'monitoring_status',
        'is_active',
        'is_prepopulated',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function brands()
    {
        return $this->belongsToMany(SugarBrand::class, 'market_sugar_brand', 'market_id', 'brand_id')
            ->withTimestamps();
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }
}
