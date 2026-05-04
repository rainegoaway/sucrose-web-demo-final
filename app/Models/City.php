<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class City extends Model
{
    protected $primaryKey = 'city_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'city_id',
        'city_name',
        'is_active',
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

    public function markets()
    {
        return $this->hasMany(Market::class, 'city_id');
    }
}
