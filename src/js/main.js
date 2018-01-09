//= ../../bower_components/jquery/dist/jquery.min.js
//= ../../bower_components/jquery-mask-plugin/dist/jquery.mask.min.js

//= partials/axis.js
//= partials/equal.js
//= partials/appAxis2.js

$(document).ready(function() {
    var
        axisApp = new window.AppAxis();
    axisApp.init();
});