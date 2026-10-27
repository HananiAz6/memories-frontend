import { TravelMemory, User, NotificationItem } from '../types/travel';

import goldenCoastImg from '../assets/images/golden_coast_sunset_1791174430675.jpg';
import winterSnowImg from '../assets/images/winter_snow_village_1791174444783.jpg';
import sundayMarketImg from '../assets/images/sunday_market_coffee_1791174456815.jpg';
import lateNightFriendsImg from '../assets/images/late_night_friends_1791174468983.jpg';
import kyotoBambooImg from '../assets/images/kyoto_bamboo_trail_1791174479424.jpg';

export const CURRENT_USER: User = {
  id: 'user_walter_motsi',
  name: 'Walter Motsi',
  email: 'walter.motsi@explorers.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Documentary photographer & slow-travel enthusiast. Chasing golden light, quiet mountain cabins, and morning coffee across coastal towns.',
  homeBase: 'Lisbon & Cape Town',
  travelStyle: 'Slow Travel & Photography',
  totalTrips: 18,
  countriesVisited: 24,
  joinedDate: 'March 2024',
};

export const DEMO_EXPLORERS: User[] = [
  CURRENT_USER,
  {
    id: 'user_elena_rostova',
    name: 'Elena Rostova',
    email: 'elena.rostova@wanderer.org',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Solo alpine hiker and remote gear tester. Always searching for high-altitude passes and quiet winter snowscapes.',
    homeBase: 'Innsbruck, Austria',
    travelStyle: 'Alpine Trekking & Wilderness',
    totalTrips: 31,
    countriesVisited: 19,
    joinedDate: 'January 2024',
  },
  {
    id: 'user_kaito_tanaka',
    name: 'Kaito Tanaka',
    email: 'kaito.tanaka@kyotowander.jp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Architectural archivist & morning market hunter. Documenting ancient cedar forests, bamboo groves, and neighborhood roasteries.',
    homeBase: 'Kyoto, Japan',
    travelStyle: 'Cultural Heritage & Foodie',
    totalTrips: 22,
    countriesVisited: 14,
    joinedDate: 'September 2024',
  },
  {
    id: 'user_sofia_morales',
    name: 'Sofia Morales',
    email: 'sofia.morales@coastways.es',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    bio: 'Coastal van explorer. Mediterranean coves, seafood markets, and evening cliffside sunsets with good friends.',
    homeBase: 'Valencia, Spain',
    travelStyle: 'Coastal Escape & Road Trip',
    totalTrips: 27,
    countriesVisited: 21,
    joinedDate: 'May 2024',
  }
];

export const INITIAL_MEMORIES: TravelMemory[] = [
  {
    id: 'mem_1',
    title: 'Sunday market, first coffee',
    description: 'Got there early before the crowds, grabbed a single-origin pour over, walked the fruit and antique stalls slowly. Bought nothing I actually needed except three blood oranges and a worn linen notebook.',
    photoUrl: sundayMarketImg,
    photoCaption: 'Morning stall aromas in the historic square',
    location: 'Aix-en-Provence',
    country: 'France',
    travelStyle: 'Food & Markets',
    tags: ['weekend', 'coffee', 'market', 'slowtravel'],
    author: {
      id: 'user_walter_motsi',
      name: 'Walter Motsi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      email: 'walter.motsi@explorers.io',
    },
    createdAt: 'AUG 18, 2026',
    likes: ['user_elena_rostova', 'user_kaito_tanaka', 'user_sofia_morales'],
    comments: [
      {
        id: 'c_1',
        author: {
          id: 'user_kaito_tanaka',
          name: 'Kaito Tanaka',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        },
        text: 'Which roastery stall did you visit? That light coming through the canvas awnings is immaculate.',
        createdAt: '2 hours ago',
      },
      {
        id: 'c_2',
        author: {
          id: 'user_sofia_morales',
          name: 'Sofia Morales',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        },
        text: 'The Sunday flower market right next to the bakery is pure magic. Did you try the lavender honey?',
        createdAt: '45 mins ago',
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival & Evening Fountains',
        activities: [
          'Arrive at Aix TGV station and check into boutique stone guesthouse',
          'Aperitivo at Place des Cardeurs under plane trees',
          'Sunset stroll along Cours Mirabeau'
        ],
        budgetEstimate: '€85 / day',
        tips: 'Buses from TGV run every 15 mins. Take line 40.'
      },
      {
        dayNumber: 2,
        title: 'Market Immersion & Atelier Cézanne',
        activities: [
          '07:30 AM: Coffee & warm pain au chocolat before crowd arrival',
          '08:30 AM: Browse Marché aux Fleurs and antique book sellers',
          '01:00 PM: Picnic in Pavillon de Vendôme garden',
          '03:30 PM: Visit Paul Cézanne’s hillside studio'
        ],
        budgetEstimate: '€55 / day',
        tips: 'Cash preferred by the farm vegetable and cheese stalls.'
      }
    ],
    isOfflineCached: true,
    savedBy: ['user_elena_rostova', 'user_sofia_morales']
  },
  {
    id: 'mem_2',
    title: 'First snow of the year',
    description: 'Woke up to everything white and quiet. Made coffee, stood by the window for way too long before actually going outside. The street looked like it belonged to nobody yet.',
    photoUrl: winterSnowImg,
    photoCaption: 'A solitary lantern casting warm glow on fresh powder',
    location: 'Zermatt',
    country: 'Switzerland',
    travelStyle: 'Alpine Trekking',
    tags: ['winter', 'snow', 'cabin', 'alps'],
    author: {
      id: 'user_elena_rostova',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      email: 'elena.rostova@wanderer.org',
    },
    createdAt: 'AUG 19, 2026',
    likes: ['user_walter_motsi', 'user_kaito_tanaka'],
    comments: [
      {
        id: 'c_3',
        author: {
          id: 'user_walter_motsi',
          name: 'Walter Motsi',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
        text: 'That stillness when the first real powder settles is unmatched. Were you near the old wooden chalets?',
        createdAt: '3 hours ago',
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Ascent to the Glacier Valley',
        activities: [
          'Cogwheel train from Täsch into car-free Zermatt village',
          'Gear check and hot mulled spiced cider at the alpine tavern',
          'Evening twilight photography along Hinterdorfstrasse chalets'
        ],
        budgetEstimate: 'CHF 140 / day',
        tips: 'Bring microspikes for icy cobblestones.'
      },
      {
        dayNumber: 2,
        title: 'Gornergrat High Ridge Trail',
        activities: [
          'First cable car up to 3,089m viewpoint for sunrise over the Matterhorn',
          'Winter snowshoe trek down to Riffelsee',
          'Raclette dinner at traditional mountain hut'
        ],
        budgetEstimate: 'CHF 120 / day',
        tips: 'Battery drains twice as fast in sub-zero temps. Keep phone inside your fleece layer.'
      }
    ],
    isOfflineCached: true,
    savedBy: ['user_walter_motsi']
  },
  {
    id: 'mem_3',
    title: 'Late night with old friends',
    description: 'Nobody planned this, it just happened — one text message turned into a midnight beach bonfire, cold beers, and ridiculous shadow hand-puppets against the sandstone wall.',
    photoUrl: lateNightFriendsImg,
    photoCaption: 'Shadows dancing on the cliff face at midnight',
    location: 'Sagres',
    country: 'Portugal',
    travelStyle: 'Coastal Escape',
    tags: ['friends', 'night', 'bonfire', 'ocean'],
    author: {
      id: 'user_walter_motsi',
      name: 'Walter Motsi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      email: 'walter.motsi@explorers.io',
    },
    createdAt: 'AUG 19, 2026',
    likes: ['user_elena_rostova', 'user_sofia_morales'],
    comments: [
      {
        id: 'c_4',
        author: {
          id: 'user_sofia_morales',
          name: 'Sofia Morales',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        },
        text: 'The best nights are always the spontaneous ones. The Atlantic wind at Sagres is wild!',
        createdAt: '1 hour ago',
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'South Coast Surf & Sunset Point',
        activities: [
          'Morning surf session at Praia do Beliche',
          'Fresh grilled sardines at harbor cantina',
          'Sunset at Cabo de São Vicente - the end of the world',
          'Campfire gathering on protected beach cove'
        ],
        budgetEstimate: '€40 / day',
        tips: 'Atlantic cliff winds get chilly after dusk; pack a windbreaker and blanket.'
      }
    ],
    isOfflineCached: true,
    savedBy: []
  },
  {
    id: 'mem_4',
    title: 'Golden hour on the coast',
    description: 'Sat on the rocks until the sun dropped into the water. The horizon turned from amber to violet. Swam in the calm cove when everyone else had packed up and left.',
    photoUrl: goldenCoastImg,
    photoCaption: 'Amber sea spray at twilight',
    location: 'Costa Brava',
    country: 'Spain',
    travelStyle: 'Coastal Escape',
    tags: ['sunset', 'coast', 'sea', 'goldenhour'],
    author: {
      id: 'user_sofia_morales',
      name: 'Sofia Morales',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      email: 'sofia.morales@coastways.es',
    },
    createdAt: 'AUG 19, 2026',
    likes: ['user_walter_motsi', 'user_elena_rostova', 'user_kaito_tanaka'],
    comments: [
      {
        id: 'c_5',
        author: {
          id: 'user_walter_motsi',
          name: 'Walter Motsi',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
        text: 'The light in this photo captures that exact warm salt air feeling. Beautiful memory.',
        createdAt: '30 mins ago',
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Camí de Ronda Coastal Hike',
        activities: [
          'Hike the clifftop trail between Calella de Palafrugell and Llafranc',
          'Stop at secluded pebbled coves for snorkeling in crystal water',
          'Seafood paella overlooking the fishing boats'
        ],
        budgetEstimate: '€65 / day',
        tips: 'Wear sturdy trainers for the rocky steps, not flip-flops.'
      }
    ],
    isOfflineCached: true,
    savedBy: ['user_walter_motsi']
  },
  {
    id: 'mem_5',
    title: 'Mist through the Arashiyama bamboo',
    description: 'Entered the grove at 05:45 AM before any tour buses arrived. The wind makes this gentle hollow wooden clicking sound as the bamboo trunks sway against one another in the mountain breeze.',
    photoUrl: kyotoBambooImg,
    photoCaption: 'Green canopy filtering early morning mist',
    location: 'Kyoto',
    country: 'Japan',
    travelStyle: 'Cultural Heritage',
    tags: ['kyoto', 'bamboo', 'serenity', 'morning'],
    author: {
      id: 'user_kaito_tanaka',
      name: 'Kaito Tanaka',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      email: 'kaito.tanaka@kyotowander.jp',
    },
    createdAt: 'AUG 20, 2026',
    likes: ['user_walter_motsi', 'user_elena_rostova'],
    comments: [
      {
        id: 'c_6',
        author: {
          id: 'user_walter_motsi',
          name: 'Walter Motsi',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
        text: 'Early morning is the only way to experience Arashiyama. The acoustic atmosphere is unforgettable.',
        createdAt: '10 mins ago',
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Sagano Zen & Riverside Tea',
        activities: [
          '05:45 AM: Bamboo path walk in silent fog',
          '07:30 AM: Tenryu-ji temple garden reflection pond',
          '10:00 AM: Matcha and wagashi sweet on the Katsura river terrace',
          '02:00 PM: Sagano romantic train ride through the autumn canyon'
        ],
        budgetEstimate: '¥6,800 / day',
        tips: 'Tenryu-ji north gate leads directly into the bamboo grove.'
      }
    ],
    isOfflineCached: true,
    savedBy: ['user_walter_motsi', 'user_sofia_morales']
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'like',
    actor: {
      name: 'Sofia Morales',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
    memoryId: 'mem_1',
    memoryTitle: 'Sunday market, first coffee',
    message: 'liked your scrapbook memory "Sunday market, first coffee"',
    createdAt: '25 mins ago',
    read: false,
  },
  {
    id: 'notif_2',
    type: 'comment',
    actor: {
      name: 'Kaito Tanaka',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    memoryId: 'mem_1',
    memoryTitle: 'Sunday market, first coffee',
    message: 'commented: "Which roastery stall did you visit? That light coming through the canvas awnings is immaculate."',
    createdAt: '2 hours ago',
    read: false,
  },
  {
    id: 'notif_3',
    type: 'new_trip',
    actor: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    memoryId: 'mem_2',
    memoryTitle: 'First snow of the year',
    message: 'shared a new winter itinerary in Zermatt, Switzerland',
    createdAt: '5 hours ago',
    read: true,
  }
];

export const TRAVEL_STYLES = [
  'All Styles',
  'Food & Markets',
  'Alpine Trekking',
  'Coastal Escape',
  'Cultural Heritage',
  'Slow Travel',
  'Road Trip'
];

export const POPULAR_DESTINATIONS = [
  'All Destinations',
  'Aix-en-Provence',
  'Zermatt',
  'Costa Brava',
  'Kyoto',
  'Sagres',
  'Reykjavik',
  'Oaxaca'
];
