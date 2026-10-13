// Official BMTC Dataset Extracted Directly from BMTC Open Data Portal
// Sources: ac150-stops.csv, fda5d502-4e92-4616-a9a1-bd5d2abfb3f7.csv, 56f6deb2-c7ad-4ade-88fb-92190eafe19b.csv

export interface BMTCStopRecord {
  name: string;
  lat: number;
  lng: number;
  dailyTrips: number;
  routesCount: number;
  topRoutes: string[];
}

export interface BMTCRouteRecord {
  route: string;
  trips: number;
  type: string;
  corridor: string;
}

export interface BMTCFleetStats {
  depotsCount: number;
  totalFleet: number;
  electricBuses: number;
  dailySchedules: number;
  dailyEffectiveKm: string;
  fleetUtilization: string;
  fuelMileageKmpl: number;
  staffStrength: number;
  divisionBuses: Record<string, number>;
}

export const BMTC_FLEET_STATISTICS: BMTCFleetStats = {
  depotsCount: 50,
  totalFleet: 6981,
  electricBuses: 1489, // EV additions across 2022-2026 batches
  dailySchedules: 6281,
  dailyEffectiveKm: "12.16 Lakh km/day",
  fleetUtilization: "84.8%",
  fuelMileageKmpl: 3.79,
  staffStrength: 29114,
  divisionBuses: {
    "North Division (Yelahanka / Hebbal / Doddaballapur)": 1416,
    "West Division (Yeshwantpur / Peenya / Kengeri)": 1175,
    "South Division (Banashankari / Electronic City / Jayanagar)": 1138,
    "East Division (Whitefield / Indiranagar / KR Puram)": 1027,
    "North East Division (Nagavara / Thanisandra / Kalyan Nagar)": 907,
    "Central Division (Kempegowda Majestic / Shivajinagar / Shantinagar)": 852
  }
};

export const OFFICIAL_BMTC_STOPS: BMTCStopRecord[] = [
  {
    "name": "Yelahanka Santhe Circle",
    "lat": 13.09797757,
    "lng": 77.59658843,
    "dailyTrips": 1977,
    "routesCount": 269,
    "topRoutes": [
      "356-CW-FLY",
      "55-B",
      "401-K",
      "401-A",
      "289-A"
    ]
  },
  {
    "name": "Jakkur Aerodrum",
    "lat": 13.07623121,
    "lng": 77.59294404,
    "dailyTrips": 1791,
    "routesCount": 212,
    "topRoutes": [
      "356-CW-FLY",
      "402-B",
      "285-M",
      "402-D",
      "284-D"
    ]
  },
  {
    "name": "Kogilu Cross",
    "lat": 13.10388385,
    "lng": 77.60025157,
    "dailyTrips": 1562,
    "routesCount": 243,
    "topRoutes": [
      "356-CW-FLY",
      "55-B",
      "289-A",
      "290-E",
      "KIAS-9"
    ]
  },
  {
    "name": "Yelahanka Satellite Town",
    "lat": 13.09563048,
    "lng": 77.57898433,
    "dailyTrips": 1318,
    "routesCount": 130,
    "topRoutes": [
      "55-B",
      "401-K",
      "402-B",
      "401-A",
      "402-D"
    ]
  },
  {
    "name": "Chikkabidarakallu",
    "lat": 13.0524131,
    "lng": 77.48755572,
    "dailyTrips": 1252,
    "routesCount": 188,
    "topRoutes": [
      "258-C",
      "258-CB",
      "MF-27",
      "362-C",
      "258-CC"
    ]
  },
  {
    "name": "Puttenahalli",
    "lat": 13.11079251,
    "lng": 77.57844463,
    "dailyTrips": 1240,
    "routesCount": 223,
    "topRoutes": [
      "285-M",
      "285-MC",
      "215-C",
      "K-6",
      "285-MF"
    ]
  },
  {
    "name": "Jindal",
    "lat": 13.05397828,
    "lng": 77.48317663,
    "dailyTrips": 1225,
    "routesCount": 185,
    "topRoutes": [
      "258-C",
      "258-CB",
      "MF-27",
      "362-C",
      "258-CC"
    ]
  },
  {
    "name": "Madanayakanahalli",
    "lat": 13.0609732,
    "lng": 77.46183756,
    "dailyTrips": 1200,
    "routesCount": 188,
    "topRoutes": [
      "258-C",
      "258-CB",
      "MF-27",
      "258-CC",
      "G-11"
    ]
  },
  {
    "name": "Yelahanka Old Town",
    "lat": 13.10068796,
    "lng": 77.59434879,
    "dailyTrips": 1186,
    "routesCount": 134,
    "topRoutes": [
      "401-K",
      "401-A",
      "289-A",
      "290-E",
      "401-R"
    ]
  },
  {
    "name": "Venkatala",
    "lat": 13.1113861,
    "lng": 77.60455583,
    "dailyTrips": 1176,
    "routesCount": 178,
    "topRoutes": [
      "356-CW-FLY",
      "289-A",
      "KIAS-9",
      "289-CA",
      "289-F"
    ]
  },
  {
    "name": "Madavara",
    "lat": 13.05673694,
    "lng": 77.47458816,
    "dailyTrips": 1168,
    "routesCount": 178,
    "topRoutes": [
      "258-C",
      "258-CB",
      "MF-27",
      "258-CC",
      "G-11"
    ]
  },
  {
    "name": "Makali",
    "lat": 13.06558747,
    "lng": 77.45447591,
    "dailyTrips": 1124,
    "routesCount": 180,
    "topRoutes": [
      "258-C",
      "258-CB",
      "258-CC",
      "G-11",
      "G-8"
    ]
  },
  {
    "name": "Gollarahatti",
    "lat": 12.98842852,
    "lng": 77.47286618,
    "dailyTrips": 978,
    "routesCount": 162,
    "topRoutes": [
      "242-B",
      "240-R",
      "G-7",
      "241-CB",
      "241-B"
    ]
  },
  {
    "name": "Arishinakunte",
    "lat": 13.0797522,
    "lng": 77.42398115,
    "dailyTrips": 950,
    "routesCount": 149,
    "topRoutes": [
      "298-P",
      "258-C",
      "258-CB",
      "258-CC",
      "G-8"
    ]
  },
  {
    "name": "Palanahalli Gate",
    "lat": 13.11708153,
    "lng": 77.60806561,
    "dailyTrips": 935,
    "routesCount": 156,
    "topRoutes": [
      "356-CW-FLY",
      "289-A",
      "289-CA",
      "289-F",
      "289-P"
    ]
  },
  {
    "name": "Dasanapura",
    "lat": 13.07516758,
    "lng": 77.43594626,
    "dailyTrips": 909,
    "routesCount": 160,
    "topRoutes": [
      "258-C",
      "258-CB",
      "258-CC",
      "G-8",
      "256-F"
    ]
  },
  {
    "name": "Kendriya Vihara",
    "lat": 13.10652852,
    "lng": 77.60158772,
    "dailyTrips": 908,
    "routesCount": 149,
    "topRoutes": [
      "356-CW-FLY",
      "289-A",
      "289-CA",
      "289-F",
      "289-P"
    ]
  },
  {
    "name": "Seegehalli Gate",
    "lat": 12.98403234,
    "lng": 77.44389563,
    "dailyTrips": 906,
    "routesCount": 171,
    "topRoutes": [
      "242-B",
      "241-H",
      "500-C",
      "334-E",
      "12F-5"
    ]
  },
  {
    "name": "Adakimaranahalli",
    "lat": 13.07011249,
    "lng": 77.44585432,
    "dailyTrips": 891,
    "routesCount": 152,
    "topRoutes": [
      "258-C",
      "258-CB",
      "258-CC",
      "G-8",
      "256-F"
    ]
  },
  {
    "name": "Devannanapalya",
    "lat": 13.07719806,
    "lng": 77.43158513,
    "dailyTrips": 871,
    "routesCount": 141,
    "topRoutes": [
      "258-C",
      "258-CB",
      "258-CC",
      "G-8",
      "256-F"
    ]
  },
  {
    "name": "Kachohalli Gate",
    "lat": 12.99049758,
    "lng": 77.46865707,
    "dailyTrips": 847,
    "routesCount": 146,
    "topRoutes": [
      "242-B",
      "240-R",
      "G-7",
      "240-C",
      "245-M"
    ]
  },
  {
    "name": "IAF Yelahanka",
    "lat": 13.13107889,
    "lng": 77.61502881,
    "dailyTrips": 782,
    "routesCount": 119,
    "topRoutes": [
      "356-CW-FLY",
      "KIAS-9",
      "282-A",
      "63-B",
      "KIAS-8"
    ]
  },
  {
    "name": "Wheel and Axle Plant NES",
    "lat": 13.10577033,
    "lng": 77.5823164,
    "dailyTrips": 781,
    "routesCount": 104,
    "topRoutes": [
      "285-M",
      "285-MC",
      "285-MF",
      "285-MA",
      "285-MP"
    ]
  },
  {
    "name": "Chikka Bettahalli",
    "lat": 13.08942723,
    "lng": 77.55613517,
    "dailyTrips": 772,
    "routesCount": 90,
    "topRoutes": [
      "401-K",
      "401-A",
      "401-R",
      "401-B",
      "401-BR"
    ]
  },
  {
    "name": "Chikka Gollarahatti",
    "lat": 12.99148289,
    "lng": 77.46521579,
    "dailyTrips": 767,
    "routesCount": 143,
    "topRoutes": [
      "242-B",
      "G-7",
      "245-M",
      "242-Z",
      "245-H"
    ]
  },
  {
    "name": "Machohalli Gate",
    "lat": 12.99079029,
    "lng": 77.45428043,
    "dailyTrips": 766,
    "routesCount": 141,
    "topRoutes": [
      "242-B",
      "G-7",
      "245-M",
      "242-Z",
      "245-H"
    ]
  },
  {
    "name": "Forest Gate",
    "lat": 12.99175731,
    "lng": 77.45965557,
    "dailyTrips": 763,
    "routesCount": 140,
    "topRoutes": [
      "242-B",
      "G-7",
      "245-M",
      "242-Z",
      "245-H"
    ]
  },
  {
    "name": "Vishwa Shanti Ashrama Nelamangala",
    "lat": 13.08406595,
    "lng": 77.41710731,
    "dailyTrips": 748,
    "routesCount": 108,
    "topRoutes": [
      "258-C",
      "258-CB",
      "258-CC",
      "G-8",
      "256-F"
    ]
  },
  {
    "name": "Kadabagere Cross",
    "lat": 12.98910156,
    "lng": 77.4497147,
    "dailyTrips": 743,
    "routesCount": 147,
    "topRoutes": [
      "242-B",
      "G-7",
      "245-M",
      "242-Z",
      "245-H"
    ]
  },
  {
    "name": "Escorts Yelahanka",
    "lat": 13.10260937,
    "lng": 77.58565843,
    "dailyTrips": 743,
    "routesCount": 98,
    "topRoutes": [
      "285-M",
      "285-MC",
      "285-MF",
      "285-MA",
      "285-MP"
    ]
  },
  {
    "name": "Rajanukunte",
    "lat": 13.17320933,
    "lng": 77.56431291,
    "dailyTrips": 681,
    "routesCount": 94,
    "topRoutes": [
      "285-M",
      "285-MC",
      "251-B",
      "285-MF",
      "285-MA"
    ]
  },
  {
    "name": "Soladevanahalli Police Station",
    "lat": 13.09344236,
    "lng": 77.48887866,
    "dailyTrips": 607,
    "routesCount": 77,
    "topRoutes": [
      "251-B",
      "248-BB",
      "251-G",
      "253-J",
      "248-J"
    ]
  },
  {
    "name": "Yelahanka NES Office",
    "lat": 13.09779197,
    "lng": 77.59169501,
    "dailyTrips": 589,
    "routesCount": 138,
    "topRoutes": [
      "55-B",
      "401-BR",
      "401-MK",
      "401-F",
      "V-500DA"
    ]
  },
  {
    "name": "Hesaraghatta TB Cross",
    "lat": 13.13031535,
    "lng": 77.48439365,
    "dailyTrips": 572,
    "routesCount": 62,
    "topRoutes": [
      "251-B",
      "248-BB",
      "251-G",
      "253-J",
      "248-J"
    ]
  },
  {
    "name": "Vidyaranyapura Bus Station",
    "lat": 13.08386613,
    "lng": 77.56028473,
    "dailyTrips": 511,
    "routesCount": 50,
    "topRoutes": [
      "MF-23",
      "401-K",
      "276-A",
      "V-500DE",
      "248-D"
    ]
  },
  {
    "name": "Thore Nagasandra Cross",
    "lat": 13.111938,
    "lng": 77.48192534,
    "dailyTrips": 507,
    "routesCount": 52,
    "topRoutes": [
      "251-B",
      "248-BB",
      "251-G",
      "253-J",
      "248-J"
    ]
  },
  {
    "name": "Sheshadripuram College Yelahanka",
    "lat": 13.09941703,
    "lng": 77.58811534,
    "dailyTrips": 442,
    "routesCount": 60,
    "topRoutes": [
      "55-B",
      "401-BR",
      "401-MK",
      "401-F",
      "V-500DA"
    ]
  },
  {
    "name": "Chikka Bommasandra Yelahanka",
    "lat": 13.09352382,
    "lng": 77.58239957,
    "dailyTrips": 441,
    "routesCount": 59,
    "topRoutes": [
      "55-B",
      "401-BR",
      "401-MK",
      "401-F",
      "V-500DA"
    ]
  },
  {
    "name": "Vidyaranyapura Durga Parameshwari Temple",
    "lat": 13.08167356,
    "lng": 77.55974808,
    "dailyTrips": 428,
    "routesCount": 43,
    "topRoutes": [
      "401-K",
      "401-R",
      "401-B",
      "401-E",
      "V-500DE"
    ]
  },
  {
    "name": "Vidyaranyapura Echalamara",
    "lat": 13.07980117,
    "lng": 77.55929432,
    "dailyTrips": 428,
    "routesCount": 43,
    "topRoutes": [
      "401-K",
      "401-R",
      "401-B",
      "401-E",
      "V-500DE"
    ]
  },
  {
    "name": "Yelahanka 5th Phase",
    "lat": 13.10575465,
    "lng": 77.57250622,
    "dailyTrips": 416,
    "routesCount": 41,
    "topRoutes": [
      "55-B",
      "402-B",
      "402-D",
      "G-9",
      "404-E"
    ]
  },
  {
    "name": "Hamsa Farm",
    "lat": 12.98173961,
    "lng": 77.43961953,
    "dailyTrips": 393,
    "routesCount": 80,
    "topRoutes": [
      "G-11",
      "293-H",
      "242-TB",
      "293-K",
      "242-X"
    ]
  },
  {
    "name": "Aradeshanahalli Gate",
    "lat": 13.21650657,
    "lng": 77.55254879,
    "dailyTrips": 377,
    "routesCount": 41,
    "topRoutes": [
      "285-M",
      "285-MC",
      "285-MF",
      "285-MA",
      "285-MP"
    ]
  },
  {
    "name": "Sri Ramanahalli",
    "lat": 13.19510058,
    "lng": 77.56294616,
    "dailyTrips": 376,
    "routesCount": 41,
    "topRoutes": [
      "285-M",
      "285-MC",
      "285-MF",
      "285-MA",
      "285-MP"
    ]
  },
  {
    "name": "Vidyaranyapura",
    "lat": 13.08364081,
    "lng": 77.56078966,
    "dailyTrips": 372,
    "routesCount": 48,
    "topRoutes": [
      "401-R",
      "401-B",
      "401-BR",
      "401-MK",
      "401-E"
    ]
  },
  {
    "name": "Sapthagiri Layout",
    "lat": 13.10459616,
    "lng": 77.61049737,
    "dailyTrips": 356,
    "routesCount": 53,
    "topRoutes": [
      "55-B",
      "290-E",
      "507-DY",
      "280-A",
      "280-K"
    ]
  },
  {
    "name": "Maruthinagara Kogilu",
    "lat": 13.10445265,
    "lng": 77.60633466,
    "dailyTrips": 316,
    "routesCount": 33,
    "topRoutes": [
      "55-B",
      "290-E",
      "507-DY",
      "280-A",
      "280-K"
    ]
  },
  {
    "name": "Ittige Factory Kogilu",
    "lat": 13.10255814,
    "lng": 77.62946387,
    "dailyTrips": 314,
    "routesCount": 32,
    "topRoutes": [
      "55-B",
      "290-E",
      "507-DY",
      "280-A",
      "280-K"
    ]
  },
  {
    "name": "Srinivasapura Kogilu",
    "lat": 13.1034819,
    "lng": 77.62346149,
    "dailyTrips": 314,
    "routesCount": 31,
    "topRoutes": [
      "55-B",
      "290-E",
      "507-DY",
      "280-A",
      "280-K"
    ]
  },
  {
    "name": "Marasandra Govt School",
    "lat": 13.23076315,
    "lng": 77.55015835,
    "dailyTrips": 283,
    "routesCount": 27,
    "topRoutes": [
      "285-M",
      "285-MC",
      "285-MF",
      "285-MA",
      "285-MG"
    ]
  },
  {
    "name": "Channenahalli Arch",
    "lat": 12.97977674,
    "lng": 77.43546881,
    "dailyTrips": 267,
    "routesCount": 58,
    "topRoutes": [
      "242-TB",
      "242-X",
      "242-U",
      "242-J",
      "242-T"
    ]
  },
  {
    "name": "Bagalur Cross DVH Road",
    "lat": 13.12186064,
    "lng": 77.61135255,
    "dailyTrips": 265,
    "routesCount": 28,
    "topRoutes": [
      "289-A",
      "289-CA",
      "289-F",
      "289-P",
      "295-G"
    ]
  },
  {
    "name": "Bettahalli Layout Yelahanka",
    "lat": 13.09247554,
    "lng": 77.55948592,
    "dailyTrips": 261,
    "routesCount": 40,
    "topRoutes": [
      "401-BR",
      "401-MK",
      "401-F",
      "401-BC",
      "MF-23A"
    ]
  },
  {
    "name": "Thirumala Dhaba Attur Layout",
    "lat": 13.09773354,
    "lng": 77.56316898,
    "dailyTrips": 260,
    "routesCount": 39,
    "topRoutes": [
      "401-BR",
      "401-MK",
      "401-F",
      "401-BC",
      "MF-23A"
    ]
  },
  {
    "name": "Atturu Layout Yelahanka",
    "lat": 13.09790705,
    "lng": 77.5675039,
    "dailyTrips": 260,
    "routesCount": 39,
    "topRoutes": [
      "401-BR",
      "401-MK",
      "401-F",
      "401-BC",
      "MF-23A"
    ]
  },
  {
    "name": "MS Palya Yelahanka",
    "lat": 13.08182206,
    "lng": 77.54849306,
    "dailyTrips": 259,
    "routesCount": 36,
    "topRoutes": [
      "MF-23",
      "401-F",
      "MF-23A",
      "271-E",
      "502-V"
    ]
  },
  {
    "name": "Mother Dairy Yelahanka",
    "lat": 13.0994689,
    "lng": 77.57707882,
    "dailyTrips": 237,
    "routesCount": 50,
    "topRoutes": [
      "401-MK",
      "401-F",
      "401-BJ",
      "PHS-34",
      "407-B"
    ]
  },
  {
    "name": "Mutturayanaswamy Temple Kadabagere Cross",
    "lat": 12.99178773,
    "lng": 77.44262442,
    "dailyTrips": 215,
    "routesCount": 34,
    "topRoutes": [
      "G-7",
      "245-M",
      "245-H",
      "245-GA",
      "245-J"
    ]
  },
  {
    "name": "Dodda Byalakere",
    "lat": 13.11192429,
    "lng": 77.52559372,
    "dailyTrips": 186,
    "routesCount": 25,
    "topRoutes": [
      "291-G",
      "290-QA",
      "407-B",
      "266-C",
      "266-K"
    ]
  },
  {
    "name": "Janapriya Township",
    "lat": 12.99889342,
    "lng": 77.44273798,
    "dailyTrips": 181,
    "routesCount": 33,
    "topRoutes": [
      "G-7",
      "245-M",
      "245-J",
      "245-E",
      "245-D"
    ]
  }
];

export const OFFICIAL_BMTC_ROUTES: BMTCRouteRecord[] = [
  {
    "route": "55-B",
    "trips": 10519,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-MK",
    "trips": 6112,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "401-BR",
    "trips": 5848,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "401-K",
    "trips": 5429,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "289-A",
    "trips": 5141,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "356-CW-FLY",
    "trips": 4899,
    "type": "Ordinary Non-AC",
    "corridor": "Electronic City Elevated Tollway"
  },
  {
    "route": "401-A",
    "trips": 4648,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "402-B",
    "trips": 4389,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Majestic (KBS Platform 22)"
  },
  {
    "route": "290-E",
    "trips": 4368,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Shivajinagar"
  },
  {
    "route": "401-F",
    "trips": 4320,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "401-R",
    "trips": 4048,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "401-B",
    "trips": 3696,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "MF-27",
    "trips": 3600,
    "type": "Metro Feeder",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-C",
    "trips": 3276,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-CB",
    "trips": 3150,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "407-B",
    "trips": 3052,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-MP",
    "trips": 2940,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapura / Rajankunte ⇄ Majestic"
  },
  {
    "route": "507-DY",
    "trips": 2940,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-E",
    "trips": 2816,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "V-500DA",
    "trips": 2755,
    "type": "Volvo Vajra AC",
    "corridor": "Hebbal ⇄ Central Silk Board (ORR)"
  },
  {
    "route": "289-CA",
    "trips": 2716,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-F",
    "trips": 2716,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-AF",
    "trips": 2656,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "MBS-2",
    "trips": 2584,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-M",
    "trips": 2538,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapura / Rajankunte ⇄ Majestic"
  },
  {
    "route": "289-P",
    "trips": 2522,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "502-FA",
    "trips": 2328,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-CC",
    "trips": 2268,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "402-D",
    "trips": 2173,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Majestic (KBS Platform 22)"
  },
  {
    "route": "G-9",
    "trips": 2135,
    "type": "Big Circle (G-Series)",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-BC",
    "trips": 2128,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "401-BJ",
    "trips": 2106,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "G-11",
    "trips": 2100,
    "type": "Big Circle (G-Series)",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-B",
    "trips": 2052,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-E",
    "trips": 2002,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-MC",
    "trips": 1978,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapura / Rajankunte ⇄ Majestic"
  },
  {
    "route": "407-C",
    "trips": 1920,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-MF",
    "trips": 1786,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapura / Rajankunte ⇄ Majestic"
  },
  {
    "route": "285-MA",
    "trips": 1786,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapura / Rajankunte ⇄ Majestic"
  },
  {
    "route": "G-8",
    "trips": 1764,
    "type": "Big Circle (G-Series)",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "G-7",
    "trips": 1763,
    "type": "Big Circle (G-Series)",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-BA",
    "trips": 1760,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "282-A",
    "trips": 1725,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "63-B",
    "trips": 1725,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-RB",
    "trips": 1720,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "401-Y",
    "trips": 1656,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri"
  },
  {
    "route": "MF-23A",
    "trips": 1624,
    "type": "Metro Feeder",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-C",
    "trips": 1584,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "256-F",
    "trips": 1575,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-TC",
    "trips": 1575,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala ⇄ Peenya ⇄ Majestic"
  }
];
