import {generateId} from "../util/baseUtils";

export const ProjectFeedMock = [
  {
    id: generateId(),
    name: 'Elder Scrolls V: Skyrim',
    desc: 'The player may freely roam over the land of Skyrim, an open world environment consisting of wilderness expanses, dungeons, caves, cities, towns, fortresses, and villages.',
    img: './img/witcher3.jpg',
    created: Date.now(),
    createdBy: Date.now(),
    lastModified: Date.now(),
    lastModifiedBy: Date.now(),
  },
  {
    id: generateId(),
    name: 'The Witcher 3: Wild Hunt',
    desc: 'Join Geralt the Witcher once again, as he seeks to find Ciri and Yennifer',
    img: './img/skyrim.png',
    created: Date.now(),
    createdBy: Date.now(),
    lastModified: Date.now(),
    lastModifiedBy: Date.now(),
  },
  {
    id: generateId(),
    name: 'Cyberpunk 2077',
    desc: "It's a city of dreams, and I'm a big dreamer. Play as V as they attempt to become the biggest legend in NightCity. Buckle up Samurai, we got a city to burn",
    img: './img/cyberpunk2077.jpg',
    created: Date.now(),
    createdBy: Date.now(),
    lastModified: Date.now(),
    lastModifiedBy: Date.now(),
  },
]

