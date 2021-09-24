const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 + 10);
    const camp = new Campground({
      // Your user ID
      author: '613ba145a7914e899c6f1e01',
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      images: [
        {
          url: 'https://res.cloudinary.com/dqfjdcset/image/upload/v1631821223/YelpCamp/mcu7sgniwvdodmljjxmm.jpg',
          filename: 'YelpCamp/mcu7sgniwvdodmljjxmm',
        },
        {
          url: 'https://res.cloudinary.com/dqfjdcset/image/upload/v1631821225/YelpCamp/oa6yblfwwbbrklhlpekd.jpg',
          filename: 'YelpCamp/oa6yblfwwbbrklhlpekd',
        },
        {
          url: 'https://res.cloudinary.com/dqfjdcset/image/upload/v1631821227/YelpCamp/fvmqpz8zere9otwwd47z.jpg',
          filename: 'YelpCamp/fvmqpz8zere9otwwd47z',
        },
        {
          url: 'https://res.cloudinary.com/dqfjdcset/image/upload/v1631821230/YelpCamp/iwqwi1lxd3hmatosf3zf.jpg',
          filename: 'YelpCamp/iwqwi1lxd3hmatosf3zf',
        },
        {
          url: 'https://res.cloudinary.com/dqfjdcset/image/upload/v1631821232/YelpCamp/xtxogkiofqnx0acrbdly.jpg',
          filename: 'YelpCamp/xtxogkiofqnx0acrbdly',
        },
        {
          url: 'https://res.cloudinary.com/dqfjdcset/image/upload/v1631821235/YelpCamp/sticaogpulngqsbzl43v.jpg',
          filename: 'YelpCamp/sticaogpulngqsbzl43v',
        },
        {
          url: 'https://res.cloudinary.com/dqfjdcset/image/upload/v1631821237/YelpCamp/hluav8jbtz63ohjkn1xg.jpg',
          filename: 'YelpCamp/hluav8jbtz63ohjkn1xg',
        },
      ],
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Viverra nibh cras pulvinar mattis nunc sed blandit libero volutpat. Phasellus vestibulum lorem sed risus ultricies tristique. Fames ac turpis egestas maecenas pharetra convallis posuere morbi leo.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => {
  console.log('Database Closing');
  mongoose.connection.close();
});
