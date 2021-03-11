var mongoose = require('mongoose');
var Campgrounds = require('./models/campground');
var Comment = require('./models/comments');

var data = [{
        title: "Solang Valley",
        image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/best-time-to-visit.jpg",
        details: "Solang Valley derives its name from combination of words Solang and Nallah. It is a side valley at the top of the Kullu Valley in Himachal Pradesh, India 14 km northwest of the resort town Manali on the way to Rohtang Pass, and is known for its summer and winter sport conditions. ",
    },
    {
        title: "Solang Valley",
        image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/best-time-to-visit.jpg",
        details: "Solang Valley derives its name from combination of words Solang and Nallah. It is a side valley at the top of the Kullu Valley in Himachal Pradesh, India 14 km northwest of the resort town Manali on the way to Rohtang Pass, and is known for its summer and winter sport conditions. ",
    },
    {
        title: "Solang Valley",
        image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/10/best-time-to-visit.jpg",
        details: "Solang Valley derives its name from combination of words Solang and Nallah. It is a side valley at the top of the Kullu Valley in Himachal Pradesh, India 14 km northwest of the resort town Manali on the way to Rohtang Pass, and is known for its summer and winter sport conditions. ",
    },
];


function SeedDB() {
    Campgrounds.remove(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('removed');
            /*  data.forEach(function (seed) {
                 Campgrounds.create(seed, function (err, data) {
                     if (err) {
                         console.log(err);
                     } else {
                         console.log('created');
                         Comment.create({
                             text: 'this place is awesome',
                             author: 'deep'
                         }, function (err, create) {
                             if (err) {
                                 console.log();
                             } else {
                                 data.comments.push(create);
                                 data.save(function (err, data) {
                                     if (err) {
                                         console.log(err);
                                     } else {
                                         console.log('comment created');
                                     }
                                 });
                             }

                         });

                     }
                 });
             }); */
        }
    });
}


module.exports = SeedDB;