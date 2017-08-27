/**
 * Created by jesseonolememen on 23/02/2017.
 */
window.onload = function () {
    var socket = io();

    socket.on('order', function (order) {
        console.log('Showing toast for new order');
        Materialize.toast('You got a new order!', 10000);

        var notifications = document.getElementById("notifications-dropdown");

        var a = document.createElement("<li>Jessse</li>");
        $('#notifications-dropdown').append(a);
    });

    socket.on('reservation', function (order) {
        console.log('Showing toast for new reservation');
        Materialize.toast('You got a new reservation!', 10000);

        var notifications = document.getElementById("notifications-dropdown");

        var a = document.createElement("<li>Jessse</li>");
        $('#notifications-dropdown').append(a);
    });

};


function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}