angular.module('app.filters', [])

.filter('distance', function ($filter)
{
    return function(distance){
        if (distance < 1)
        {
            distance = distance * 100;
            distance = $filter('number')(distance, 2) +' m';
        }else{
            distance = $filter('number')(distance, 2) +' km';
        }

        return distance;
    }
})

;