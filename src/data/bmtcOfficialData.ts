// Official BMTC Dataset Extracted Directly from BMTC Open Data Portal
// Sources: ac150-stops.csv, 56f6deb2-c7ad-4ade-88fb-92190eafe19b.csv

export interface BMTCStopRecord {
  name: string;
  lat: number;
  lng: number;
  dailyTrips: number;
  routesCount: number;
  topRoutes: string[];
  boothCodes?: string[];
  routesMap?: Record<string, number>;
}

export interface BMTCRouteRecord {
  route: string;
  trips: number;
  type: string;
  corridor: string;
}

export interface BMTCFleetDivisionRecord {
  division: string;
  year: string;
  busesHeld: number;
  busesOnRoad: number;
  busesOffRoad: number;
  roadWorthySpare: number;
  offRoadPercent: number;
  fleetUtilisation: number;
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

// 1. Comprehensive High-Level BMTC Fleet Operational Baseline
export const BMTC_FLEET_STATISTICS: BMTCFleetStats = {
  depotsCount: 50,
  totalFleet: 6981,
  electricBuses: 1489,
  dailySchedules: 6281,
  dailyEffectiveKm: "12.16 Lakh km/day",
  fleetUtilization: "85.1%",
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

// 2. Complete Official Division-by-Division Fleet Operational Statistics (from 56f6deb2-c7ad-4ade-88fb-92190eafe19b.csv)
export const BMTC_DIVISIONAL_FLEET_DATA: BMTCFleetDivisionRecord[] = [
  {
    "division": "East",
    "year": "2019-20",
    "busesHeld": 1026.6,
    "busesOnRoad": 864.4,
    "busesOffRoad": 57.2,
    "roadWorthySpare": 105,
    "offRoadPercent": 5.6,
    "fleetUtilisation": 84.2
  },
  {
    "division": "East",
    "year": "2018-19",
    "busesHeld": 1037.4,
    "busesOnRoad": 867.6,
    "busesOffRoad": 99,
    "roadWorthySpare": 70.8,
    "offRoadPercent": 9.5,
    "fleetUtilisation": 83.6
  },
  {
    "division": "East",
    "year": "2017-18",
    "busesHeld": 961,
    "busesOnRoad": 838.6,
    "busesOffRoad": 62.4,
    "roadWorthySpare": 60,
    "offRoadPercent": 6.5,
    "fleetUtilisation": 87.3
  },
  {
    "division": "East",
    "year": "2016-17",
    "busesHeld": 1118.8,
    "busesOnRoad": 995.9,
    "busesOffRoad": 66.2,
    "roadWorthySpare": 56.7,
    "offRoadPercent": 5.9,
    "fleetUtilisation": 89
  },
  {
    "division": "West",
    "year": "2019-20",
    "busesHeld": 1174.8,
    "busesOnRoad": 1004.8,
    "busesOffRoad": 103.7,
    "roadWorthySpare": 66.3,
    "offRoadPercent": 8.8,
    "fleetUtilisation": 85.5
  },
  {
    "division": "West",
    "year": "2018-19",
    "busesHeld": 1208.1,
    "busesOnRoad": 1021.6,
    "busesOffRoad": 150.2,
    "roadWorthySpare": 36.3,
    "offRoadPercent": 12.4,
    "fleetUtilisation": 84.6
  },
  {
    "division": "West",
    "year": "2017-18",
    "busesHeld": 1143.9,
    "busesOnRoad": 1025.7,
    "busesOffRoad": 84.4,
    "roadWorthySpare": 33.8,
    "offRoadPercent": 7.4,
    "fleetUtilisation": 89.7
  },
  {
    "division": "West",
    "year": "2016-17",
    "busesHeld": 1132.4,
    "busesOnRoad": 1024.9,
    "busesOffRoad": 63,
    "roadWorthySpare": 44.5,
    "offRoadPercent": 5.6,
    "fleetUtilisation": 90.5
  },
  {
    "division": "North",
    "year": "2019-20",
    "busesHeld": 1416.4,
    "busesOnRoad": 1239.9,
    "busesOffRoad": 110.1,
    "roadWorthySpare": 66.4,
    "offRoadPercent": 7.8,
    "fleetUtilisation": 87.5
  },
  {
    "division": "North",
    "year": "2018-19",
    "busesHeld": 1452.8,
    "busesOnRoad": 1267.8,
    "busesOffRoad": 155.3,
    "roadWorthySpare": 29.7,
    "offRoadPercent": 10.7,
    "fleetUtilisation": 87.3
  },
  {
    "division": "North",
    "year": "2017-18",
    "busesHeld": 1375.2,
    "busesOnRoad": 1247.3,
    "busesOffRoad": 95.2,
    "roadWorthySpare": 32.7,
    "offRoadPercent": 6.9,
    "fleetUtilisation": 90.7
  },
  {
    "division": "North",
    "year": "2016-17",
    "busesHeld": 1788.8,
    "busesOnRoad": 1622.9,
    "busesOffRoad": 109.7,
    "roadWorthySpare": 56.2,
    "offRoadPercent": 6.1,
    "fleetUtilisation": 90.7
  },
  {
    "division": "South",
    "year": "2019-20",
    "busesHeld": 1138.2,
    "busesOnRoad": 1003.9,
    "busesOffRoad": 76.1,
    "roadWorthySpare": 58.2,
    "offRoadPercent": 6.7,
    "fleetUtilisation": 88.2
  },
  {
    "division": "South",
    "year": "2018-19",
    "busesHeld": 1198.8,
    "busesOnRoad": 1022.2,
    "busesOffRoad": 151.3,
    "roadWorthySpare": 25.3,
    "offRoadPercent": 12.6,
    "fleetUtilisation": 85.3
  },
  {
    "division": "South",
    "year": "2017-18",
    "busesHeld": 1239.3,
    "busesOnRoad": 1109.1,
    "busesOffRoad": 89.6,
    "roadWorthySpare": 40.6,
    "offRoadPercent": 7.2,
    "fleetUtilisation": 89.5
  },
  {
    "division": "South",
    "year": "2016-17",
    "busesHeld": 1524,
    "busesOnRoad": 1379.5,
    "busesOffRoad": 92.5,
    "roadWorthySpare": 52,
    "offRoadPercent": 6.1,
    "fleetUtilisation": 90.5
  },
  {
    "division": "North East",
    "year": "2019-20",
    "busesHeld": 906.5,
    "busesOnRoad": 788.7,
    "busesOffRoad": 47.4,
    "roadWorthySpare": 70.4,
    "offRoadPercent": 5.2,
    "fleetUtilisation": 87
  },
  {
    "division": "North East",
    "year": "2018-19",
    "busesHeld": 925.5,
    "busesOnRoad": 786,
    "busesOffRoad": 96.4,
    "roadWorthySpare": 43.1,
    "offRoadPercent": 10.4,
    "fleetUtilisation": 84.9
  },
  {
    "division": "North East",
    "year": "2017-18",
    "busesHeld": 895,
    "busesOnRoad": 790.8,
    "busesOffRoad": 59.9,
    "roadWorthySpare": 44.3,
    "offRoadPercent": 6.7,
    "fleetUtilisation": 88.4
  },
  {
    "division": "North East",
    "year": "2016-17",
    "busesHeld": 0,
    "busesOnRoad": 0,
    "busesOffRoad": 0,
    "roadWorthySpare": 0,
    "offRoadPercent": 0,
    "fleetUtilisation": 0
  },
  {
    "division": "Central",
    "year": "2019-20",
    "busesHeld": 852.2,
    "busesOnRoad": 640.7,
    "busesOffRoad": 72.9,
    "roadWorthySpare": 138.6,
    "offRoadPercent": 8.6,
    "fleetUtilisation": 75.2
  },
  {
    "division": "Central",
    "year": "2018-19",
    "busesHeld": 851.7,
    "busesOnRoad": 649.5,
    "busesOffRoad": 97.2,
    "roadWorthySpare": 105,
    "offRoadPercent": 11.4,
    "fleetUtilisation": 76.3
  },
  {
    "division": "Central",
    "year": "2017-18",
    "busesHeld": 779.7,
    "busesOnRoad": 586,
    "busesOffRoad": 90.4,
    "roadWorthySpare": 103.3,
    "offRoadPercent": 11.6,
    "fleetUtilisation": 75.2
  },
  {
    "division": "Central",
    "year": "2016-17",
    "busesHeld": 705.7,
    "busesOnRoad": 556.2,
    "busesOffRoad": 85.2,
    "roadWorthySpare": 64.3,
    "offRoadPercent": 12.1,
    "fleetUtilisation": 78.8
  },
  {
    "division": "Total",
    "year": "2019-20",
    "busesHeld": 6514.9,
    "busesOnRoad": 5542.4,
    "busesOffRoad": 467.4,
    "roadWorthySpare": 504.9,
    "offRoadPercent": 7.1,
    "fleetUtilisation": 85.1
  },
  {
    "division": "Total",
    "year": "2018-19",
    "busesHeld": 6674.3,
    "busesOnRoad": 5614.7,
    "busesOffRoad": 749.4,
    "roadWorthySpare": 310.2,
    "offRoadPercent": 11.2,
    "fleetUtilisation": 84.1
  },
  {
    "division": "Total",
    "year": "2017-18",
    "busesHeld": 6394.1,
    "busesOnRoad": 5597.5,
    "busesOffRoad": 481.9,
    "roadWorthySpare": 314.7,
    "offRoadPercent": 7.7,
    "fleetUtilisation": 86.8
  },
  {
    "division": "Total",
    "year": "2016-17",
    "busesHeld": 6269.7,
    "busesOnRoad": 5579.4,
    "busesOffRoad": 416.6,
    "roadWorthySpare": 273.7,
    "offRoadPercent": 7.2,
    "fleetUtilisation": 87.9
  }
];

// 3. Complete Official Stops Network with Coordinates, Daily Trips, and Routes (from ac150-stops.csv)
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
      "289-A",
      "290-E",
      "401-R",
      "401-B"
    ],
    "boothCodes": [
      "29150194",
      "29150147",
      "29150172",
      "29150173",
      "29150174",
      "29150183",
      "29150184",
      "29150186",
      "29150195",
      "29150196",
      "29150197",
      "29150198",
      "29150199",
      "29150200",
      "29150201",
      "29150202",
      "29150203",
      "29150175",
      "29150190",
      "29150191",
      "29150192"
    ],
    "routesMap": {
      "289-D": 11,
      "401-AM": 11,
      "PHS-34": 15,
      "BYH-PTH": 1,
      "YTTMC-OASIS": 1,
      "YHKOT-TMK-KMT": 5,
      "DVHGH-PTH": 4,
      "GKVK-YHKOT": 1,
      "YHKOT-YTTMC": 8,
      "290-EA": 0,
      "290-E SBS-PTH": 0,
      "282-H": 7,
      "YSTF-ITPL": 2,
      "401-AB": 5,
      "401-R": 46,
      "290-EB YHK-KGR": 0,
      "290-EB KGR-YHK": 0,
      "401-KA": 3,
      "507-C YPRS-KRPG": 2,
      "401-A": 56,
      "407-F": 8,
      "336-B SNBS-KMP": 2,
      "401-AF": 32,
      "43-E SNBS-SVN": 2,
      "289-CA": 28,
      "RJP- PTH": 1,
      "282-F": 11,
      "PTH-MNH": 1,
      "PTH-BSF": 1,
      "CVB-JDLO": 2,
      "289-F PTH-HSK": 3,
      "507-D": 9,
      "289-F": 28,
      "HMV-ADTH": 2,
      "401-AE": 7,
      "JHC-YHK": 4,
      "356-CD HSR BC-DTG": 1,
      "290-EB": 0,
      "296-K": 4,
      "D10G-RCH": 2,
      "285-MP": 30,
      "V-500DA": 19,
      "401-RA": 8,
      "289-H": 9,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "YHK-MLH": 1,
      "KBS-BDL": 1,
      "407-C": 6,
      "GDH-PTH": 1,
      "297-G": 1,
      "289-L": 13,
      "401-BJ": 18,
      "YRSTN-YHK": 4,
      "401-RB YHK-MTR": 1,
      "401-RB": 10,
      "YHKOT-BDL": 2,
      "PTH-KLP": 1,
      "YHKOT-DVH": 1,
      "BC-8": 9,
      "289-A YHKOT-BKH": 6,
      "PTH-KIAS": 1,
      "KBS-KIAS": 4,
      "PTH-BDL": 1,
      "507-DY": 35,
      "CHAKRA-10": 12,
      "280-F YSTF-HSK": 1,
      "297-A": 12,
      "KBS-ISNH": 1,
      "282-A": 25,
      "283-E": 11,
      "356-CW-FLY": 71,
      "280-A": 26,
      "281-F": 7,
      "KMT-BYH": 0,
      "282-B": 13,
      "KMT-HBL-YHKOT": 12,
      "298-PD": 2,
      "ACC B-56": 2,
      "289-C": 8,
      "283-D": 3,
      "282-D": 8,
      "298-ME": 8,
      "298-MS": 9,
      "295-G": 17,
      "289-K": 4,
      "GPO-CVB-YSTF": 1,
      "KLP-PTH": 1,
      "284-G": 8,
      "BYH-KBS": 5,
      "298Y PTH-YHS": 1,
      "281-C": 18,
      "281-A": 7,
      "281-G": 10,
      "300-F": 17,
      "280-E": 12,
      "280-K": 21,
      "63-B": 25,
      "283-B": 8,
      "298-MH": 8,
      "289-B": 8,
      "YHKOT-MLPH": 3,
      "283-A": 14,
      "291-D": 22,
      "PTH-KNR": 1,
      "YHK-KNR": 1,
      "CKH-YHK": 3,
      "BMH-PTH": 3,
      "DVH-YHKOT": 6,
      "KNR-PTH": 1,
      "401-JB": 8,
      "V-285M": 18,
      "V-HBL-YHKOT": 2,
      "297-F": 4,
      "CRISTAL-5": 3,
      "407-B": 14,
      "YHK-MSP-VTTMC": 1,
      "D10G-YHKOT": 2,
      "D10G-TNS-YHKOT": 3,
      "291-L": 3,
      "281-H": 4,
      "289-LA": 11,
      "KMT-BSFY": 6,
      "289-E": 14,
      "298-M": 18,
      "YHKOT-HSG": 3,
      "PTH-CKH": 1,
      "298-MC": 4,
      "298-MA": 7,
      "298-MG": 6,
      "297-H": 1,
      "YTTMC-MSP-CHRS": 1,
      "KRPRS-HMRH": 1,
      "HNS-YLKOT": 2,
      "298-A": 8,
      "401-BR": 34,
      "401-Y": 9,
      "401-MK": 32,
      "401-MS": 8,
      "401-BA": 20,
      "401-B": 42,
      "401-B YHKOT-MSP-HPN": 6,
      "60-L VTTMC-EASTEND": 2,
      "297-K": 16,
      "291-K": 7,
      "284-K": 19,
      "284-KA": 22,
      "280-L": 9,
      "PTH-KNDC": 1,
      "YLKOT-TRPT-KNDC": 1,
      "298-E": 10,
      "289-M": 8,
      "298-MY": 16,
      "401-AR": 13,
      "290 KBS-YLKOT": 2,
      "290-EY": 0,
      "290-EN": 0,
      "290-EN KLNB-YHKOT": 0,
      "362-K": 5,
      "KMT-VSNP": 2,
      "297-B": 5,
      "401-T": 8,
      "289-P": 26,
      "401-JC YTTMC-BKH": 3,
      "299-E": 9,
      "YTTMC-YLK-BMES": 1,
      "YLKOT-BMES": 1,
      "282-C YHK-BLR": 2,
      "YHK-YTTMC-PSB": 5,
      "BCS-BMSITY": 1,
      "V-500DR": 9,
      "ADT-IAF": 1,
      "ADT-BMH": 1,
      "ADT-NMG": 1,
      "YHKOT-BMSIT": 4,
      "JKR-SRSRA": 1,
      "298M KBS-VTHM": 1,
      "290-E STJHS-YLKOT": 0,
      "VNS-YHK-TRT": 1,
      "BMSIT-PTH-YHK": 1,
      "YHKOT-HRTAD": 1,
      "YHKOT-VRP": 1,
      "298-B": 6,
      "407-E YLKOT-LGNH": 1,
      "297-B KBS-DGH": 2,
      "401-A NMG-YHKOT": 0,
      "241-CD": 11,
      "406 YLKOT-NMG": 1,
      "401 BMT45-YHKOT": 1,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "289-L YSTF-MVJ": 1,
      "289-L YHKOT-CKHL": 1,
      "290-E PTH-RKH": 0,
      "289-LA YSTF-HSK": 1,
      "285 PTH-YHKOT": 3,
      "297-G PTH-DCH": 1,
      "297 STP-AFSY": 2,
      "V-YHK-KRPH": 1,
      "401-A JHC-YHK": 2,
      "IAF-HMPN": 2,
      "283E PTML-THS": 2,
      "278-A": 8,
      "297 YHKOT-BVP": 5,
      "297F PTH-BVP": 1,
      "289 PTH-BKHL": 1,
      "297 YHK-HGH": 1,
      "298M PTH-DVHOB": 2,
      "285V YHK-SNH": 2,
      "MBS-2": 17,
      "284 PTH-KVRYHK": 1,
      "284 KBS-KVRYHK": 1,
      "290E PTH-AJB": 0,
      "289CA PTH-HNH": 2,
      "401BJ PTH-YHK-BLR": 3,
      "289 YHKOT-ARS": 2,
      "298 PTH-DVH": 2,
      "298Y YHKOT-YLR": 2,
      "289-F MDR-YHOT": 1,
      "282-A PTH-HSH": 1,
      "290E YHKOT-RKH": 0,
      "401 YHKOT-MSP": 2,
      "298 PTH-IAF": 1,
      "290EY KMT-YHKOT": 0,
      "401-PS": 13,
      "298PD PTH-NLR": 1,
      "401-K": 61,
      "MBS2 PTH-MRHSPG": 1,
      "290-E ITCF-YHKOT": 0,
      "401-BJ BMSITY-BGLR": 1,
      "284-K KMT-AGS-JSNL": 1,
      "401 BMT45-JSNL": 1,
      "V-500DA YSTF-ELCW": 1,
      "V-500DA CSB-BGC": 1,
      "V-CSB-YLK": 1,
      "280-F": 17,
      "285 YHKOT-BMSITY": 1,
      "500AA-YHK-CSB": 1,
      "YHKOT-DVH-BMW": 1,
      "298 KMT-BYNH": 2,
      "298 YHKOT-BYNH": 1,
      "401-E": 32,
      "290-E": 52,
      "HNH-PTH": 1,
      "224-DA": 14,
      "YHK-KDGC": 2,
      "KDH-PTH": 1,
      "PTH-MYH": 12,
      "CRPF-KBS": 3,
      "PTH-CHK": 1,
      "PTH-KVRYHK": 1,
      "PTH-HNS": 1,
      "55-B": 67,
      "PTH-NGH": 1,
      "PTH-IAF": 1,
      "YHK-CKH": 4,
      "243-L": 12,
      "243-L KMT-LDH": 2,
      "265-E": 6,
      "289-A": 53,
      "64 DPN-SBS": 1,
      "PTH-SBS": 3,
      "MEBP-21B": 0,
      "378 KGR-ELCW": 2,
      "PSS-NMS": 2,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3,
      "YHK-NITT": 7,
      "285-CA NES-JKBH": 1
    }
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
      "284-D",
      "285-MF",
      "285-MA",
      "284-A"
    ],
    "boothCodes": [
      "29150212"
    ],
    "routesMap": {
      "GKVK-YHKOT": 1,
      "282-H": 7,
      "YSTF-ITPL": 2,
      "HALLCA-PTH": 1,
      "282-F": 11,
      "CVB-JDLO": 2,
      "HMV-ADTH": 2,
      "356-CD HSR BC-DTG": 1,
      "D06G-BMSIT": 2,
      "380 KMT-KTO": 6,
      "V-500DA": 19,
      "KBS-BDL": 1,
      "YRSTN-YHK": 4,
      "KBS-KIAS": 4,
      "500-A BSK-YSTF": 7,
      "PTH-JKRA": 1,
      "CHAKRA-10": 12,
      "297-A": 12,
      "402-A": 17,
      "KBS-ISNH": 1,
      "284-C": 24,
      "KHC-JLO": 4,
      "285-MK": 16,
      "284-A": 36,
      "285-MF": 38,
      "282-A": 25,
      "285-M": 54,
      "283-E": 11,
      "AS-7": 16,
      "285-L": 11,
      "356-CW-FLY": 71,
      "285-J": 12,
      "285-MG": 23,
      "PTH-SRP": 2,
      "280-A": 26,
      "281-F": 7,
      "KMT-BYH": 0,
      "282-B": 13,
      "KDG-CSB-D34": 5,
      "285-MA": 38,
      "KMT-HBL-YHKOT": 12,
      "285-T": 12,
      "402-B": 57,
      "402-D": 53,
      "KBS-YST-PTH": 8,
      "PTH-SBSH": 4,
      "404-E": 20,
      "284-B": 24,
      "PTH-SBS1": 4,
      "285-K": 14,
      "285-H": 14,
      "285-P": 13,
      "285-AA": 16,
      "285-CC": 4,
      "PTH-KDG": 3,
      "KDG-PTH": 5,
      "298-PD": 2,
      "SGH-YHK-HBL-CSB": 1,
      "ACC B-56": 2,
      "285-CA": 9,
      "289-C": 8,
      "283-D": 3,
      "282-D": 8,
      "298-ME": 8,
      "298-MS": 9,
      "G-9A": 14,
      "G-9": 35,
      "402-M": 7,
      "PTH-CSB": 3,
      "PTH-MRHB": 2,
      "295-G": 17,
      "289-K": 4,
      "PTH- BPS": 3,
      "285-M HBL-SGH": 2,
      "GPO-CVB-YSTF": 1,
      "YSTF-SBS": 6,
      "284-E": 13,
      "284-G": 8,
      "BYH-KBS": 5,
      "298Y PTH-YHS": 1,
      "281-C": 18,
      "281-A": 7,
      "281-G": 10,
      "300-F": 17,
      "280-E": 12,
      "280-K": 21,
      "285-C": 12,
      "285-N": 15,
      "285-D": 13,
      "63-B": 25,
      "283-B": 8,
      "298-MH": 8,
      "289-B": 8,
      "SBS-NES-PTH": 2,
      "500-Y": 13,
      "283-A": 14,
      "YSTF-JBS": 1,
      "YSTF-CSB": 11,
      "285-G": 10,
      "298-Y": 6,
      "291-D": 22,
      "PTH-DSHL": 2,
      "285-M HBL-DBP": 2,
      "VSD-YST5": 1,
      "285-RB": 10,
      "V-285M": 18,
      "V-HBL-YHKOT": 2,
      "SBS-PTH": 8,
      "PTH-BSK": 3,
      "297-F": 4,
      "CRISTAL-5": 3,
      "402-C": 33,
      "D10G-YHKOT": 2,
      "D10G-YSTF": 1,
      "281-H": 4,
      "KMT-BSFY": 6,
      "285-JB THDL-KBS": 1,
      "289-E": 14,
      "298-M": 18,
      "285-JE": 17,
      "285-RC": 9,
      "356-J": 7,
      "284-D": 44,
      "298-MC": 4,
      "298-MA": 7,
      "298-MG": 6,
      "297-H": 1,
      "285-V": 18,
      "SBS-JKR-ALSG-PTH": 1,
      "KBS-MVL": 1,
      "KRPRS-HMRH": 1,
      "V-500DA BSK-YHK5": 12,
      "298-A": 8,
      "KBS-ADTS": 1,
      "SBS-ALS": 0,
      "PTH-DSKN": 2,
      "284-K": 19,
      "284-KA": 22,
      "280-L": 9,
      "289-M": 8,
      "KMT-VSNP": 2,
      "297-B": 5,
      "284-H": 5,
      "299-E": 9,
      "BCS-BMSITY": 1,
      "SBS-RTN-BMSIT": 1,
      "V-500DR": 9,
      "KBS-YST-ADT": 4,
      "PTH-NDRD": 1,
      "ALS-SBDFD": 1,
      "PTH-SDNIBK": 1,
      "SDNIBK-YSTF": 1,
      "YSTF-BEMLF": 1,
      "JKR-SRSRA": 1,
      "PTH-VNSHBL": 1,
      "298M KBS-VTHM": 1,
      "285-TA": 11,
      "402-B SHS-YST": 1,
      "KBS-HBL-BMSIT": 1,
      "VNS-YHK-TRT": 1,
      "KBS-YSTF-PTH": 8,
      "BMT45-YST-DSH": 1,
      "KBS-ADT": 5,
      "298-B": 6,
      "285-K KMT-PMTL": 2,
      "285-K KBS-PTML": 7,
      "285-C KBS-DTMKR": 2,
      "285-H KBS-KLH": 2,
      "285-P KBS-BTH": 1,
      "297-B KBS-DGH": 2,
      "285-M KBS-PTH": 7,
      "284-D VSD- YST": 1,
      "285-M PTH-HBLP": 1,
      "297 STP-AFSY": 2,
      "285-R": 16,
      "285-RA": 13,
      "V-YHK-KRPH": 1,
      "286-H PTH-GKVKLT": 1,
      "285-W": 8,
      "500-DY": 4,
      "356J YSTF-AGS-ATB": 1,
      "284 SBS-MKC-PTH": 1,
      "BELF-NES-DBP": 1,
      "287-K PTH-DSHL": 1,
      "287G PTH-CBL": 1,
      "288C PTH-KDG": 1,
      "285M SBS-DBP": 0,
      "501C KGR-HBLB-PTH": 2,
      "PTH-SVN": 1,
      "500D PTH-MRH SPG": 3,
      "285MA PTML-CVB": 2,
      "285M KBS-KRC-DBP": 1,
      "285-Y": 8,
      "285 BPS-NES": 1,
      "284-K KMT-AGS-JSNL": 1,
      "285-M KBS-GITAM": 2,
      "V-500DA YSTF-ELCW": 1,
      "V-500DA CSB-BGC": 1,
      "V-CSB-YLK": 1,
      "KRP-YHK-HBL-GITHM": 6,
      "GITAM-YHK-HBL-KRP": 5,
      "500-A BSK-HBLB-PTH": 3,
      "285-M KBS-APEL": 1,
      "285-A": 12,
      "285-A KBS-NDH": 1,
      "500AA-YHK-CSB": 1,
      "500-DA": 7,
      "298 KMT-BYNH": 2,
      "KDH-PTH": 1,
      "CRPF-KBS": 3,
      "265-E": 6,
      "D13G-ISRO": 4
    }
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
      "KIAS-9",
      "507-DY",
      "289-CA",
      "289-F"
    ],
    "boothCodes": [
      "29150108",
      "29150109",
      "29150123",
      "29150127",
      "29150128",
      "29150173",
      "29150174",
      "29150196",
      "29150202",
      "29150203",
      "29150107",
      "29150111",
      "29150119",
      "29150175",
      "29150190",
      "29150191"
    ],
    "routesMap": {
      "289-D": 11,
      "401-AM": 11,
      "BYH-PTH": 1,
      "YTTMC-OASIS": 1,
      "DVHGH-PTH": 4,
      "290-EA": 0,
      "290-E SBS-PTH": 0,
      "282-H": 7,
      "YSTF-ITPL": 2,
      "401-AB": 5,
      "290-EB YHK-KGR": 0,
      "290-EB KGR-YHK": 0,
      "336-B SNBS-KMP": 2,
      "43-E SNBS-SVN": 2,
      "289-CA": 28,
      "RJP- PTH": 1,
      "282-F": 11,
      "PTH-MNH": 1,
      "PTH-BSF": 1,
      "289-F PTH-HSK": 3,
      "507-D": 9,
      "289-F": 28,
      "401-AE": 7,
      "356-CD HSR BC-DTG": 1,
      "290-EB": 0,
      "296-K": 4,
      "D10G-RCH": 2,
      "V-500DA": 19,
      "289-H": 9,
      "YHK-MLH": 1,
      "KBS-BDL": 1,
      "407-C": 6,
      "GDH-PTH": 1,
      "297-G": 1,
      "289-L": 13,
      "401-BJ": 18,
      "YHKOT-BDL": 2,
      "PTH-KLP": 1,
      "YHKOT-DVH": 1,
      "289-A YHKOT-BKH": 6,
      "PTH-KIAS": 1,
      "KBS-KIAS": 4,
      "PTH-BDL": 1,
      "507-DY": 35,
      "CHAKRA-10": 12,
      "280-F YSTF-HSK": 1,
      "297-A": 12,
      "KBS-ISNH": 1,
      "282-A": 25,
      "283-E": 11,
      "356-CW-FLY": 71,
      "280-A": 26,
      "281-F": 7,
      "KMT-BYH": 0,
      "282-B": 13,
      "298-PD": 2,
      "ACC B-56": 2,
      "289-C": 8,
      "283-D": 3,
      "282-D": 8,
      "298-ME": 8,
      "298-MS": 9,
      "295-G": 17,
      "289-K": 4,
      "KLP-PTH": 1,
      "284-G": 8,
      "BYH-KBS": 5,
      "298Y PTH-YHS": 1,
      "281-C": 18,
      "281-A": 7,
      "281-G": 10,
      "300-F": 17,
      "280-E": 12,
      "280-K": 21,
      "63-B": 25,
      "283-B": 8,
      "298-MH": 8,
      "289-B": 8,
      "283-A": 14,
      "298-Y": 6,
      "PTH-KNR": 1,
      "YHK-KNR": 1,
      "CKH-YHK": 3,
      "BMH-PTH": 3,
      "DVH-YHKOT": 6,
      "KNR-PTH": 1,
      "401-JB": 8,
      "297-F": 4,
      "407-B": 14,
      "D10G-TNS-YHKOT": 3,
      "291-L": 3,
      "281-H": 4,
      "289-LA": 11,
      "KMT-BSFY": 6,
      "289-E": 14,
      "298-M": 18,
      "PTH-CKH": 1,
      "298-MC": 4,
      "298-MA": 7,
      "298-MG": 6,
      "297-H": 1,
      "YTTMC-MSP-CHRS": 1,
      "KRPRS-HMRH": 1,
      "HNS-YLKOT": 2,
      "298-A": 8,
      "401-Y": 9,
      "401-J": 5,
      "297-K": 16,
      "291-K": 7,
      "280-L": 9,
      "PTH-KNDC": 1,
      "YLKOT-TRPT-KNDC": 1,
      "298-E": 10,
      "289-M": 8,
      "298-MY": 16,
      "BEMLA-7": 2,
      "ITPL-9A": 2,
      "290 KBS-YLKOT": 2,
      "290-EY": 0,
      "290-EN": 0,
      "290-EN KLNB-YHKOT": 0,
      "KMT-VSNP": 2,
      "297-B": 5,
      "289-P": 26,
      "401-JC YTTMC-BKH": 3,
      "299-E": 9,
      "YTTMC-YLK-BMES": 1,
      "YLKOT-BMES": 1,
      "CRHS-6": 2,
      "282-C YHK-BLR": 2,
      "ADT-IAF": 1,
      "ADT-BMH": 1,
      "ADT-NMG": 1,
      "JKR-SRSRA": 1,
      "VNS-22": 2,
      "298M KBS-VTHM": 1,
      "BMES-5A": 3,
      "290-E STJHS-YLKOT": 0,
      "VNS-YHK-TRT": 1,
      "VCS-JFWTC-22 YHK-JFWTC": 1,
      "BELGS-26": 3,
      "BTP-25": 1,
      "ITI-01": 2,
      "VCS-ORRCA-012 BGC-ORRCA": 0,
      "MTR-27": 2,
      "298-B": 6,
      "MADT-BCP": 1,
      "297-B PTML-DGH": 1,
      "297-B KBS-DGH": 2,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "289-L YSTF-MVJ": 1,
      "289-L YHKOT-CKHL": 1,
      "290-E PTH-RKH": 0,
      "289-LA YSTF-HSK": 1,
      "PTH-DVHGH": 2,
      "297-G PTH-DCH": 1,
      "297 STP-AFSY": 2,
      "KIAS-7": 15,
      "KIAS-4": 9,
      "KIAS-4A": 9,
      "KIAS-6A": 7,
      "KIAS-5": 20,
      "KIAS-6K": 3,
      "KIAS-7A": 11,
      "KIAS-9": 38,
      "KIAS-12": 15,
      "KIAS-8": 22,
      "KIAS-5A": 8,
      "KIAS-8A": 15,
      "KIAS-5B": 6,
      "KIAS-8B": 6,
      "KIAS-8C": 8,
      "KIAS-8D": 10,
      "KIAS-5G": 2,
      "KIAS-8EW": 9,
      "IAF-HMPN": 2,
      "283E PTML-THS": 2,
      "278-A": 8,
      "297 YHKOT-BVP": 5,
      "297F PTH-BVP": 1,
      "289 PTH-BKHL": 1,
      "297 YHK-HGH": 1,
      "298M PTH-DVHOB": 2,
      "MBS-2": 17,
      "284 PTH-KVRYHK": 1,
      "284 KBS-KVRYHK": 1,
      "290E PTH-AJB": 0,
      "289CA PTH-HNH": 2,
      "280K PTH-MTH": 1,
      "401BJ PTH-YHK-BLR": 3,
      "289 YHKOT-ARS": 2,
      "298 PTH-DVH": 2,
      "298Y YHKOT-YLR": 2,
      "289-F MDR-YHOT": 1,
      "KIAS-6": 16,
      "282-A PTH-HSH": 1,
      "298ME PTH-DVHGH": 1,
      "290E YHKOT-RKH": 0,
      "298 PTH-IAF": 1,
      "290EY KMT-YHKOT": 0,
      "298PD PTH-NLR": 1,
      "MBS2 PTH-MRHSPG": 1,
      "290-E ITCF-YHKOT": 0,
      "401-BJ BMSITY-BGLR": 1,
      "284-K KMT-AGS-JSNL": 1,
      "401 BMT45-JSNL": 1,
      "CHAKRA-10A": 6,
      "CHAKRA-10 BMT10-HNRJ": 1,
      "V-500DA YSTF-ELCW": 1,
      "V-500DA CSB-BGC": 1,
      "280-F": 17,
      "KIAS-14": 6,
      "YHKOT-DVH-BMW": 1,
      "GITAM-2": 2,
      "298 KMT-BYNH": 2,
      "298 YHKOT-BYNH": 1,
      "290-E": 52,
      "HNH-PTH": 1,
      "224-DA": 14,
      "YHK-KDGC": 2,
      "PTH-MYH": 12,
      "CRPF-KBS": 3,
      "PTH-CHK": 1,
      "PTH-KVRYHK": 1,
      "PTH-HNS": 1,
      "55-B": 67,
      "PTH-NGH": 1,
      "PTH-IAF": 1,
      "YHK-CKH": 4,
      "243-L": 12,
      "243-L KMT-LDH": 2,
      "BSK-DPJN": 5,
      "265-E": 6,
      "289-A": 53,
      "64 DPN-SBS": 1,
      "TR-4 JJN-PLG": 2,
      "PTH-MGH": 2,
      "PTH-SBS": 3,
      "MEBP-21B": 0,
      "227-J KMT-TVK": 1,
      "YTTMC-PTC": 3,
      "285-CA NES-JKBH": 1
    }
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
      "402-D",
      "401-R",
      "284-D",
      "401-B"
    ],
    "boothCodes": [
      "29150218",
      "29150222",
      "29150145",
      "29150148",
      "29150179",
      "29150181",
      "29150219",
      "29150220",
      "29150221",
      "29150223",
      "29150224",
      "29150225",
      "29150226",
      "29150213",
      "29150215",
      "29150176",
      "29150177",
      "29150178",
      "29150180",
      "29150182",
      "29150189",
      "29150214"
    ],
    "routesMap": {
      "401-AM": 11,
      "PHS-34": 15,
      "YTTMC-OASIS": 1,
      "YHKOT-TMK-KMT": 5,
      "YHKOT-YTTMC": 8,
      "290-EA": 0,
      "YSTF-ITPL": 2,
      "401-AB": 5,
      "401-R": 46,
      "KBS-VSD-NGV": 1,
      "401-KA": 3,
      "507-C YPRS-KRPG": 2,
      "401-A": 56,
      "407-F": 8,
      "401-AF": 32,
      "507-D": 9,
      "401-AE": 7,
      "JHC-YHK": 4,
      "296-K": 4,
      "380 KMT-KTO": 6,
      "V-500DA": 19,
      "401-RA": 8,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "407-C": 6,
      "401-BJ": 18,
      "401-RB YHK-MTR": 1,
      "401-RB": 10,
      "401-K CLO-YHKOT": 4,
      "BC-8": 9,
      "500-A BSK-YSTF": 7,
      "280-F YSTF-HSK": 1,
      "402-A": 17,
      "284-A": 36,
      "AS-7": 16,
      "402-B": 57,
      "402-D": 53,
      "KBS-YST-PTH": 8,
      "404-E": 20,
      "284-B": 24,
      "G-9A": 14,
      "G-9": 35,
      "402-M": 7,
      "GPO-CVB-YSTF": 1,
      "YSTF-SBS": 6,
      "500-Y": 13,
      "YSTF-JBS": 1,
      "YSTF-CSB": 11,
      "VSD-YST5": 1,
      "401-JB": 8,
      "407-B": 14,
      "YHK-MSP-VTTMC": 1,
      "402-C": 33,
      "D10G-YSTF": 1,
      "356-J": 7,
      "284-D": 44,
      "297-M": 2,
      "YTTMC-MSP-CHRS": 1,
      "V-500DA BSK-YHK5": 12,
      "KBS-ADTS": 1,
      "401-D": 3,
      "401-BR": 34,
      "401-Y": 9,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "401-BA": 20,
      "401-BC": 14,
      "401-B": 42,
      "401-J": 5,
      "401 NLO-YHK": 10,
      "401-B YHKOT-MSP-HPN": 6,
      "60-L VTTMC-EASTEND": 2,
      "401-F": 32,
      "401-AR": 13,
      "401-T": 8,
      "284-H": 5,
      "401-JC YTTMC-BKH": 3,
      "YTTMC-YLK-BMES": 1,
      "YHK-YTTMC-PSB": 5,
      "KBS-YST-ADT": 4,
      "ADT-BMH": 1,
      "MADT-ALS": 1,
      "SDNIBK-YSTF": 1,
      "YSTF-BEMLF": 1,
      "402-B SHS-YST": 1,
      "401A BMSIT-PSS": 1,
      "KBS-YSTF-PTH": 8,
      "YNTAEH-BMSITY": 4,
      "401-B YNTAEH-YTTMC": 3,
      "BMT30-YST": 2,
      "BMT45-YST-DSH": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "YHKOT-VRP": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "KBS-ADT": 5,
      "401-A NMG-YHKOT": 0,
      "401-B DPJN-YHKOT": 2,
      "401 BMT45-YHKOT": 1,
      "284-B PTH-YST": 1,
      "284-D VSD- YST": 1,
      "289-L YSTF-MVJ": 1,
      "289-LA YSTF-HSK": 1,
      "401-A JHC-YHK": 2,
      "IAF-HMPN": 2,
      "500-DY": 4,
      "MF-23A": 14,
      "356J YSTF-AGS-ATB": 1,
      "MBS-2": 17,
      "284 PTH-YST": 1,
      "401 YHKOT-MSP": 2,
      "401-PS": 13,
      "401-K": 61,
      "401 PTMTL-YTTMC": 1,
      "401 YHKPS-YTTMC": 1,
      "401 BMT45-JSNL": 1,
      "V-500DA YSTF-ELCW": 1,
      "500-DA": 7,
      "401-E": 32,
      "PTH-YST": 4,
      "55-B": 67,
      "243-L KMT-LDH": 2,
      "MEBP-21B": 0,
      "378 KGR-ELCW": 2,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3,
      "285-CA NES-JKBH": 1
    }
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
      "258-CC",
      "G-11",
      "G-8",
      "256-F"
    ],
    "boothCodes": [
      "29150271",
      "29150272",
      "29150273",
      "29150274",
      "29150275",
      "29150276",
      "29150277",
      "29150305",
      "29150306",
      "29150278"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "258-S": 10,
      "G-8": 28,
      "257-H": 9,
      "502-FA": 24,
      "255-D": 15,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "258-TC": 25,
      "500-DG": 10,
      "248-AN": 13,
      "258-K": 9,
      "257-A": 4,
      "KBS-HRH": 2,
      "257-B": 5,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "ASK-GGP-KRP": 3,
      "YTTMC-NML-KNW": 3,
      "289-C": 8,
      "MNH-HBL": 2,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "257-D": 10,
      "NICE-7": 3,
      "NICE-7A": 5,
      "BSK-MNH": 2,
      "258-U": 13,
      "500-AC": 9,
      "362-C": 39,
      "258-VC": 13,
      "258-E": 9,
      "256 KBS-SVNC": 3,
      "G-11": 35,
      "257-G": 10,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "258-F KMT-SVP": 1,
      "256-K": 7,
      "256-MB": 6,
      "258-C": 52,
      "255-E": 22,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "258-VG": 5,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255-L": 12,
      "255-N": 11,
      "BEMLA-10": 3,
      "258-CC": 36,
      "258-B": 17,
      "MF-27": 40,
      "BEMLB-10": 1,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "JHC-TAPL": 1,
      "258-CB BELF-YTTMC-NMG": 1,
      "BTP-29": 2,
      "256-B YTTMC-GJDH": 2,
      "258-CB YTTMC-ASK": 1,
      "256-D KBS-RVT": 1,
      "258-M KBS-YMH": 2,
      "258-CB YTTMC-HGP": 2,
      "258- KMT-LKH": 2,
      "258 KMT-ASK": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-C KBS-ASK": 2,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "256 YTTMC-VNC": 1,
      "258-N VSD-ASK": 1,
      "258-N YTTMC-ASK": 3,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258 JHC-ASK": 2,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "258 KMT-DSP": 2,
      "255-B KBS-NGR": 1,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "258 JHC-ADK": 1,
      "258-MC YTTMC-KBH": 2,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "258-CB YTTMC-ADK": 3,
      "257-D YTTMC-KDG": 1,
      "257-H YTTMC-ALR": 1,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258-CB YTTMC-DSP": 5,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-C KBS-DSP": 3,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "500-DG NML-JKLOA": 2,
      "258-GA KBS-BMSH": 2,
      "258-VG YTTMC-PLN": 1,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "G-8 MGRM-DSP": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-CC KBS-DSP": 1,
      "258-VA": 5,
      "263-R": 9,
      "263 KMT-KMS": 1,
      "VCS-MEBP-76 MNH-MEBP": 1,
      "263-K": 8,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "254B KBH-DSP": 1,
      "254-A  DSP-KGT": 2,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "250SA KDG-ASK": 1,
      "258C NGS-ASK": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "258-M": 25,
      "258-DN": 8,
      "502-FA NMG-SMH": 1,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "255-AC": 3,
      "258-WA": 11,
      "256-B": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "257-E": 17,
      "258-X": 24,
      "263-E": 23,
      "258-SA": 11,
      "242-RA": 8,
      "NML-KGR": 3
    }
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
      "285-MF",
      "285-MA",
      "285-MP",
      "507-C"
    ],
    "boothCodes": [
      "29150101",
      "29150140",
      "29150152",
      "29150157",
      "29150158",
      "29150159",
      "29150141",
      "29150160",
      "29150161",
      "29150147",
      "29150139"
    ],
    "routesMap": {
      "PTH-PSS": 3,
      "BYH-PTH": 1,
      "PTN-YHKOT": 7,
      "DVHGH-PTH": 4,
      "D11-PTN": 9,
      "290-E SBS-PTH": 0,
      "NES-SDP": 1,
      "HALLCA-PTH": 1,
      "PTH-VRP-KBS": 4,
      "507-C": 29,
      "CS-JDV-ACC B6": 10,
      "215-E": 23,
      "234-E GOODSHED": 9,
      "336-B SNBS-KMP": 2,
      "215-Y": 14,
      "43-E SNBS-SVN": 2,
      "RJP- PTH": 1,
      "PTH-MNH": 1,
      "PTH-BSF": 1,
      "289-F PTH-HSK": 3,
      "V-215H": 14,
      "YTTMC-D34G": 1,
      "215-W": 14,
      "D06G-BMSIT": 2,
      "D34G-JBS-KMT": 5,
      "D34G-KBS": 7,
      "285-MP": 30,
      "D34G-JBS": 4,
      "215-HA": 13,
      "D34G-KMT": 4,
      "GTG-D34G-KMT": 3,
      "V-500BM": 12,
      "GDH-PTH": 1,
      "PTH-VRP-TDL": 2,
      "VSD-KMT-JSD-RLO": 3,
      "PTH-KLP": 1,
      "215-C": 42,
      "PTH-KIAS": 1,
      "PTH-BDL": 1,
      "PTH-JKRA": 1,
      "215-HB": 18,
      "285-MK": 16,
      "285-MF": 38,
      "285-M": 54,
      "285-L": 11,
      "285-J": 12,
      "285-MG": 23,
      "PTH-SRP": 2,
      "KDG-CSB-D34": 5,
      "285-MA": 38,
      "285-T": 12,
      "KBS-YST-PTH": 8,
      "PTH-SBSH": 4,
      "284-B": 24,
      "PTH-SBS1": 4,
      "285-K": 14,
      "285-H": 14,
      "285-B": 26,
      "285-P": 13,
      "285-AA": 16,
      "285-CC": 4,
      "PTH-KDG": 3,
      "KDG-PTH": 5,
      "SGH-YHK-HBL-CSB": 1,
      "285-CA": 9,
      "PTH-CSB": 3,
      "PTH-MRHB": 2,
      "PTH- BPS": 3,
      "285-M HBL-SGH": 2,
      "KLP-PTH": 1,
      "285-C": 12,
      "285-N": 15,
      "285-D": 13,
      "SBS-NES-PTH": 2,
      "YNALL-DBP": 2,
      "YHKOT-MLPH": 3,
      "285-G": 10,
      "PTH-KNR": 1,
      "PTH-DSHL": 2,
      "285-M HBL-DBP": 2,
      "BMH-PTH": 3,
      "KNR-PTH": 1,
      "285-RB": 10,
      "V-285M": 18,
      "SBS-PTH": 8,
      "PTH-BSK": 3,
      "CRISTAL-5": 3,
      "285-JB THDL-KBS": 1,
      "285-JE": 17,
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "PTH-CKH": 1,
      "ANJP10B-JSD-BSK": 3,
      "285-V": 18,
      "SBS-JKR-ALSG-PTH": 1,
      "KBS-MVL": 1,
      "KMT-MVL": 1,
      "PTH-DSKN": 2,
      "PTH-KNDC": 1,
      "K-6": 41,
      "BCS-BMSITY": 1,
      "SBS-RTN-BMSIT": 1,
      "PTH-MADT": 1,
      "PTH-NDRD": 1,
      "PTH-SDNIBK": 1,
      "YHKOT-BMSIT": 4,
      "PTH-VNSHBL": 1,
      "285-TA": 11,
      "401A BMSIT-PSS": 1,
      "KBS-HBL-BMSIT": 1,
      "PTH-MSP-PTCA": 1,
      "D34-JNMS": 2,
      "KBS-YSTF-PTH": 8,
      "PTH-MADTL": 1,
      "401 YTTMC-BMSIT": 1,
      "BMSIT-PTH-YHK": 1,
      "YNTAEH-BMSITY": 4,
      "YHKOT-HRTAD": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "285-CA NES-JKBH": 1,
      "285-K KMT-PMTL": 2,
      "285-K PTML-NES": 2,
      "285-CC NES-CTMK": 1,
      "285-K KBS-PTML": 7,
      "407-E YLKOT-LGNH": 1,
      "285-E NES-KKLV": 1,
      "285-C KBS-DTMKR": 2,
      "285-H KBS-KLH": 2,
      "285-JC NES-JTH": 1,
      "285-K NES-SDH": 1,
      "285-L NES-BYTH": 1,
      "285-MF NES-KDH": 1,
      "285-MG NES-BMGL": 1,
      "285-P NES-BTH": 1,
      "285-P KBS-BTH": 1,
      "285-X NES-DBR": 1,
      "297-B PTML-DGH": 1,
      "258-WA NMG-JTS": 2,
      "406 YLKOT-NMG": 1,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "285-M KBS-PTH": 7,
      "284-B PTH-YST": 1,
      "290-E PTH-RKH": 0,
      "285 PTH-YHKOT": 3,
      "285-K NES-PTML": 7,
      "285-M PTH-HBLP": 1,
      "PTH-DVHGH": 2,
      "297-G PTH-DCH": 1,
      "285-R": 16,
      "285-R NES-CHL": 2,
      "285-RA": 13,
      "285-RA NES-HNYR": 2,
      "KIAS-5A": 8,
      "286-H PTH-GKVKLT": 1,
      "283E PTML-THS": 2,
      "285-W": 8,
      "297F PTH-BVP": 1,
      "289 PTH-BKHL": 1,
      "298M PTH-DVHOB": 2,
      "285V YHK-SNH": 2,
      "284 PTH-KVRYHK": 1,
      "284 SBS-MKC-PTH": 1,
      "290E PTH-AJB": 0,
      "284 PTH-YST": 1,
      "401AM PTH-PSS": 1,
      "289CA PTH-HNH": 2,
      "280K PTH-MTH": 1,
      "401BJ PTH-YHK-BLR": 3,
      "BELF-NES-DBP": 1,
      "298 PTH-DVH": 2,
      "298Y PTH-YHS": 1,
      "401-B PTH-VRP-TDL": 0,
      "282-A PTH-HSH": 1,
      "287-K PTH-DSHL": 1,
      "287G PTH-CBL": 1,
      "298ME PTH-DVHGH": 1,
      "V-BRGM-HBL": 1,
      "288C PTH-KDG": 1,
      "285M SBS-DBP": 0,
      "298 PTH-IAF": 1,
      "501C KGR-HBLB-PTH": 2,
      "298PD PTH-NLR": 1,
      "PTH-SVN": 1,
      "500D PTH-MRH SPG": 3,
      "MBS2 PTH-MRHSPG": 1,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "285M KBS-KRC-DBP": 1,
      "401 PTMTL-YTTMC": 1,
      "285-Y": 8,
      "401-BJ BMSITY-BGLR": 1,
      "285-M KBS-GITAM": 2,
      "KRP-YHK-HBL-GITHM": 6,
      "GITAM-YHK-HBL-KRP": 5,
      "500-A BSK-HBLB-PTH": 3,
      "285-M KBS-APEL": 1,
      "285-A": 12,
      "285-A KBS-NDH": 1,
      "ANJP10B-JSD-KBS": 2,
      "285 YHKOT-BMSITY": 1,
      "HNH-PTH": 1,
      "PTH-YST": 4,
      "KDH-PTH": 1,
      "PTH-MYH": 12,
      "CRPF-KBS": 3,
      "PTH-JLO": 3,
      "285-MC": 43,
      "PTH-CHK": 1,
      "PTH-KVRYHK": 1,
      "PTH-HNS": 1,
      "PTH-NGH": 1,
      "PTH-IAF": 1,
      "PTH-YSTF": 6,
      "243-L": 12,
      "BSK-DPJN": 5,
      "PTH-MGH": 2,
      "PTH-SBS": 3,
      "D13G-ISRO": 4,
      "PSS-NMS": 2,
      "258-WA": 11,
      "YHK-NITT": 7
    }
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
      "258-CC",
      "G-11",
      "G-8",
      "256-F"
    ],
    "boothCodes": [
      "29150271",
      "29150272",
      "29150273",
      "29150274",
      "29150275",
      "29150276",
      "29150326",
      "29150301",
      "29150302",
      "29150304",
      "29150305"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "258-S": 10,
      "G-8": 28,
      "257-H": 9,
      "502-FA": 24,
      "255-D": 15,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "258-TC": 25,
      "500-DG": 10,
      "248-AN": 13,
      "258-K": 9,
      "257-A": 4,
      "KBS-HRH": 2,
      "257-B": 5,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "ASK-GGP-KRP": 3,
      "YTTMC-NML-KNW": 3,
      "289-C": 8,
      "MNH-HBL": 2,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "257-D": 10,
      "NICE-7": 3,
      "NICE-7A": 5,
      "BSK-MNH": 2,
      "258-U": 13,
      "500-AC": 9,
      "362-C": 39,
      "258-VC": 13,
      "258-E": 9,
      "256 KBS-SVNC": 3,
      "G-11": 35,
      "257-G": 10,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "258-F KMT-SVP": 1,
      "256-K": 7,
      "256-MB": 6,
      "258-C": 52,
      "255-E": 22,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "JINDAL-1": 1,
      "258-VG": 5,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255-L": 12,
      "255-N": 11,
      "258-CC": 36,
      "258-B": 17,
      "MF-27": 40,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "JHC-TAPL": 1,
      "258-CB BELF-YTTMC-NMG": 1,
      "256-B YTTMC-GJDH": 2,
      "258-CB YTTMC-ASK": 1,
      "256-D KBS-RVT": 1,
      "258-M KBS-YMH": 2,
      "258-CB YTTMC-HGP": 2,
      "258- KMT-LKH": 2,
      "258 KMT-ASK": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-C KBS-ASK": 2,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "256 YTTMC-VNC": 1,
      "258-N VSD-ASK": 1,
      "258-N YTTMC-ASK": 3,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258 JHC-ASK": 2,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "258 KMT-DSP": 2,
      "255-B KBS-NGR": 1,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "258 JHC-ADK": 1,
      "258-MC YTTMC-KBH": 2,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "258-CB YTTMC-ADK": 3,
      "257-D YTTMC-KDG": 1,
      "257-H YTTMC-ALR": 1,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258-CB YTTMC-DSP": 5,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-C KBS-DSP": 3,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "500-DG NML-JKLOA": 2,
      "258-GA KBS-BMSH": 2,
      "258-VG YTTMC-PLN": 1,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "G-8 MGRM-DSP": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-CC KBS-DSP": 1,
      "258-VA": 5,
      "263-R": 9,
      "263 KMT-KMS": 1,
      "VCS-MEBP-76 MNH-MEBP": 1,
      "263-K": 8,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "254B KBH-DSP": 1,
      "254-A  DSP-KGT": 2,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "250SA KDG-ASK": 1,
      "258C NGS-ASK": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "258-M": 25,
      "258-DN": 8,
      "502-FA NMG-SMH": 1,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "255-AC": 3,
      "258-WA": 11,
      "256-B": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "257-E": 17,
      "258-X": 24,
      "258-SA": 11,
      "242-RA": 8,
      "NML-KGR": 3
    }
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
      "G-11",
      "G-8",
      "256-F",
      "258-TC"
    ],
    "boothCodes": [
      "29150293",
      "29150309",
      "29150324",
      "29150287",
      "29150288",
      "29150289",
      "29150290",
      "29150294",
      "29150307"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "256-M": 9,
      "MEBP-76": 1,
      "258-X VNC-MTNT": 1,
      "258-S": 10,
      "G-8": 28,
      "257-H": 9,
      "502-FA": 24,
      "255-D": 15,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "240-F": 13,
      "258-TC": 25,
      "500-DG": 10,
      "248-AN": 13,
      "258-K": 9,
      "245-AA": 4,
      "257-A": 4,
      "KBS-HRH": 2,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "ASK-GGP-KRP": 3,
      "YTTMC-NML-KNW": 3,
      "289-C": 8,
      "MNH-HBL": 2,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "257-D": 10,
      "BSK-MNH": 2,
      "258-U": 13,
      "500-AC": 9,
      "258-VC": 13,
      "258-E": 9,
      "256 KBS-SVNC": 3,
      "G-11": 35,
      "257-G": 10,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "258-F KMT-SVP": 1,
      "256-K": 7,
      "256-MB": 6,
      "258-C": 52,
      "255-E": 22,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "258-VG": 5,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255-L": 12,
      "255-N": 11,
      "258-CC": 36,
      "258-B": 17,
      "MF-27": 40,
      "NICE-8": 2,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "JHC-TAPL": 1,
      "258-CB BELF-YTTMC-NMG": 1,
      "256-B YTTMC-GJDH": 2,
      "258-CB YTTMC-ASK": 1,
      "256-D KBS-RVT": 1,
      "258-M KBS-YMH": 2,
      "258- KMT-LKH": 2,
      "258 KMT-ASK": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-C KBS-ASK": 2,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "256 YTTMC-VNC": 1,
      "258-N VSD-ASK": 1,
      "258-N YTTMC-ASK": 3,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258 JHC-ASK": 2,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "240-F KMT-MDH": 3,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "258 KMT-DSP": 2,
      "255-B KBS-NGR": 1,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "258 JHC-ADK": 1,
      "258-MC YTTMC-KBH": 2,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "258-CB YTTMC-ADK": 3,
      "257-D YTTMC-KDG": 1,
      "257-H YTTMC-ALR": 1,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258-CB YTTMC-DSP": 5,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-C KBS-DSP": 3,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "500-DG NML-JKLOA": 2,
      "258-GA KBS-BMSH": 2,
      "258-VG YTTMC-PLN": 1,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "G-8 MGRM-DSP": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-CC KBS-DSP": 1,
      "258-VA": 5,
      "263-R": 9,
      "263 KMT-KMS": 1,
      "263-K": 8,
      "245-M MNKH-MRTG": 1,
      "KDBC-MNKH": 1,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "254B KBH-DSP": 1,
      "254-A  DSP-KGT": 2,
      "257B DSP-MKPL": 1,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "250SA KDG-ASK": 1,
      "258C NGS-ASK": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "258-M": 25,
      "258-DN": 8,
      "502-FA NMG-SMH": 1,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "255-AC": 3,
      "258-WA": 11,
      "256-B": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "257-E": 17,
      "258-X": 24,
      "258-SA": 11,
      "242-RA": 8,
      "NML-KGR": 3
    }
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
      "401-R",
      "401-B",
      "507-DY",
      "401-BR"
    ],
    "boothCodes": [
      "29150194",
      "29150108",
      "29150109",
      "29150123",
      "29150124",
      "29150125",
      "29150126",
      "29150127",
      "29150128",
      "29150136",
      "29150138",
      "29150147",
      "29150172",
      "29150173",
      "29150174",
      "29150183",
      "29150184",
      "29150186",
      "29150195",
      "29150196",
      "29150197",
      "29150198",
      "29150199",
      "29150200",
      "29150201",
      "29150202",
      "29150203",
      "29150175",
      "29150190"
    ],
    "routesMap": {
      "289-D": 11,
      "PHS-34": 15,
      "YHKOT-TMK-KMT": 5,
      "PTN-YHKOT": 7,
      "GKVK-YHKOT": 1,
      "YHKOT-YTTMC": 8,
      "401-R": 46,
      "290-EB YHK-KGR": 0,
      "290-EB KGR-YHK": 0,
      "401-KA": 3,
      "507-C YPRS-KRPG": 2,
      "401-A": 56,
      "407-F": 8,
      "401-AF": 32,
      "289-CA": 28,
      "289-F": 28,
      "JHC-YHK": 4,
      "356-CD HSR BC-DTG": 1,
      "290-EB": 0,
      "D10G-RCH": 2,
      "285-MP": 30,
      "401-RA": 8,
      "289-H": 9,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "YHK-MLH": 1,
      "407-C": 6,
      "297-G": 1,
      "289-L": 13,
      "YRSTN-YHK": 4,
      "401-RB YHK-MTR": 1,
      "401-RB": 10,
      "YHKOT-BDL": 2,
      "401-K CLO-YHKOT": 4,
      "YHKOT-DVH": 1,
      "BC-8": 9,
      "289-A YHKOT-BKH": 6,
      "507-DY": 35,
      "CHAKRA-10": 12,
      "KMT-HBL-YHKOT": 12,
      "YHKOT-MLPH": 3,
      "291-D": 22,
      "YHK-KNR": 1,
      "CKH-YHK": 3,
      "DVH-YHKOT": 6,
      "V-HBL-YHKOT": 2,
      "407-B": 14,
      "YHK-MSP-VTTMC": 1,
      "D10G-YHKOT": 2,
      "D10G-TNS-YHKOT": 3,
      "291-L": 3,
      "289-LA": 11,
      "YHKOT-HSG": 3,
      "HNS-YLKOT": 2,
      "401-BR": 34,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "401-BA": 20,
      "401-BC": 14,
      "401-B": 42,
      "401 NLO-YHK": 10,
      "401-B YHKOT-MSP-HPN": 6,
      "60-L VTTMC-EASTEND": 2,
      "297-K": 16,
      "284-K": 19,
      "284-KA": 22,
      "YLKOT-TRPT-KNDC": 1,
      "298-E": 10,
      "298-MY": 16,
      "401-AR": 13,
      "290 KBS-YLKOT": 2,
      "290-EY": 0,
      "290-EN": 0,
      "290-EN KLNB-YHKOT": 0,
      "362-K": 5,
      "401-T": 8,
      "289-P": 26,
      "YLKOT-BMES": 1,
      "282-C YHK-BLR": 2,
      "YHK-YTTMC-PSB": 5,
      "V-500DR": 9,
      "YHKOT-BMSIT": 4,
      "290-E STJHS-YLKOT": 0,
      "BMSIT-PTH-YHK": 1,
      "YHKOT-HRTAD": 1,
      "YHKOT-VRP": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "407-E YLKOT-LGNH": 1,
      "401-A NMG-YHKOT": 0,
      "401-B DPJN-YHKOT": 2,
      "241-CD": 11,
      "406 YLKOT-NMG": 1,
      "401 BMT45-YHKOT": 1,
      "289-L YHKOT-CKHL": 1,
      "285 PTH-YHKOT": 3,
      "V-YHK-KRPH": 1,
      "401-A JHC-YHK": 2,
      "278-A": 8,
      "297 YHKOT-BVP": 5,
      "297 YHK-HGH": 1,
      "285V YHK-SNH": 2,
      "MBS-2": 17,
      "289 YHKOT-ARS": 2,
      "298Y YHKOT-YLR": 2,
      "289-F MDR-YHOT": 1,
      "290E YHKOT-RKH": 0,
      "401 YHKOT-MSP": 2,
      "290EY KMT-YHKOT": 0,
      "401-PS": 13,
      "401-K": 61,
      "MBS2 PTH-MRHSPG": 1,
      "290-E ITCF-YHKOT": 0,
      "V-CSB-YLK": 1,
      "280-F": 17,
      "285 YHKOT-BMSITY": 1,
      "500AA-YHK-CSB": 1,
      "YHKOT-DVH-BMW": 1,
      "298 YHKOT-BYNH": 1,
      "401-E": 32,
      "290-E": 52,
      "224-DA": 14,
      "YHK-KDGC": 2,
      "YHK-CKH": 4,
      "289-A": 53,
      "64 DPN-SBS": 1,
      "TR-4 JJN-PLG": 2,
      "378 KGR-ELCW": 2,
      "PSS-NMS": 2,
      "227-J KMT-TVK": 1,
      "401-A PSB-YKHOT": 7,
      "YHK-NITT": 7
    }
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
      "289-F",
      "289-P",
      "282-A",
      "63-B"
    ],
    "boothCodes": [
      "29150108",
      "29150109",
      "29150107",
      "29150111",
      "29150113",
      "29150114",
      "29150116",
      "29150117",
      "29150110",
      "29150112",
      "29150115",
      "29150118"
    ],
    "routesMap": {
      "289-D": 11,
      "401-AM": 11,
      "BYH-PTH": 1,
      "DVHGH-PTH": 4,
      "282-H": 7,
      "401-AB": 5,
      "336-B SNBS-KMP": 2,
      "43-E SNBS-SVN": 2,
      "289-CA": 28,
      "RJP- PTH": 1,
      "282-F": 11,
      "PTH-MNH": 1,
      "PTH-BSF": 1,
      "289-F PTH-HSK": 3,
      "289-F": 28,
      "401-AE": 7,
      "356-CD HSR BC-DTG": 1,
      "D10G-RCH": 2,
      "289-H": 9,
      "YHK-MLH": 1,
      "KBS-BDL": 1,
      "407-C": 6,
      "GDH-PTH": 1,
      "297-G": 1,
      "289-L": 13,
      "401-BJ": 18,
      "YHKOT-BDL": 2,
      "PTH-KLP": 1,
      "YHKOT-DVH": 1,
      "289-A YHKOT-BKH": 6,
      "PTH-KIAS": 1,
      "KBS-KIAS": 4,
      "PTH-BDL": 1,
      "297-A": 12,
      "KBS-ISNH": 1,
      "282-A": 25,
      "283-E": 11,
      "356-CW-FLY": 71,
      "281-F": 7,
      "KMT-BYH": 0,
      "282-B": 13,
      "298-PD": 2,
      "ACC B-56": 2,
      "289-C": 8,
      "283-D": 3,
      "282-D": 8,
      "298-ME": 8,
      "298-MS": 9,
      "295-G": 17,
      "289-K": 4,
      "KLP-PTH": 1,
      "BYH-KBS": 5,
      "298Y PTH-YHS": 1,
      "281-C": 18,
      "281-A": 7,
      "281-G": 10,
      "63-B": 25,
      "283-B": 8,
      "298-MH": 8,
      "289-B": 8,
      "283-A": 14,
      "298-Y": 6,
      "CKH-YHK": 3,
      "BMH-PTH": 3,
      "DVH-YHKOT": 6,
      "401-JB": 8,
      "297-F": 4,
      "407-B": 14,
      "291-L": 3,
      "281-H": 4,
      "KMT-BSFY": 6,
      "289-E": 14,
      "298-M": 18,
      "298-MC": 4,
      "298-MA": 7,
      "298-MG": 6,
      "297-H": 1,
      "KRPRS-HMRH": 1,
      "HNS-YLKOT": 2,
      "298-A": 8,
      "401-Y": 9,
      "401-J": 5,
      "297-K": 16,
      "291-K": 7,
      "PTH-KNDC": 1,
      "YLKOT-TRPT-KNDC": 1,
      "298-E": 10,
      "289-M": 8,
      "298-MY": 16,
      "KMT-VSNP": 2,
      "297-B": 5,
      "289-P": 26,
      "401-JC YTTMC-BKH": 3,
      "299-E": 9,
      "282-C YHK-BLR": 2,
      "ADT-IAF": 1,
      "ADT-BMH": 1,
      "ADT-NMG": 1,
      "298M KBS-VTHM": 1,
      "BMES-5A": 3,
      "VNS-YHK-TRT": 1,
      "BELGS-26": 3,
      "298-B": 6,
      "MADT-BCP": 1,
      "297-B PTML-DGH": 1,
      "297-B KBS-DGH": 2,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "289-L YSTF-MVJ": 1,
      "289-L YHKOT-CKHL": 1,
      "PTH-DVHGH": 2,
      "297-G PTH-DCH": 1,
      "297 STP-AFSY": 2,
      "KIAS-7": 15,
      "KIAS-4": 9,
      "KIAS-4A": 9,
      "KIAS-6A": 7,
      "KIAS-5": 20,
      "KIAS-6K": 3,
      "KIAS-7A": 11,
      "KIAS-9": 38,
      "KIAS-12": 15,
      "KIAS-8": 22,
      "KIAS-5A": 8,
      "KIAS-8A": 15,
      "KIAS-5B": 6,
      "KIAS-8B": 6,
      "KIAS-8C": 8,
      "KIAS-8D": 10,
      "KIAS-5G": 2,
      "KIAS-8EW": 9,
      "IAF-HMPN": 2,
      "283E PTML-THS": 2,
      "278-A": 8,
      "297 YHKOT-BVP": 5,
      "297F PTH-BVP": 1,
      "289 PTH-BKHL": 1,
      "297 YHK-HGH": 1,
      "298M PTH-DVHOB": 2,
      "289CA PTH-HNH": 2,
      "401BJ PTH-YHK-BLR": 3,
      "289 YHKOT-ARS": 2,
      "298 PTH-DVH": 2,
      "298Y YHKOT-YLR": 2,
      "289-F MDR-YHOT": 1,
      "KIAS-6": 16,
      "282-A PTH-HSH": 1,
      "298ME PTH-DVHGH": 1,
      "298 PTH-IAF": 1,
      "298PD PTH-NLR": 1,
      "401-BJ BMSITY-BGLR": 1,
      "CHAKRA-10A": 6,
      "CHAKRA-10 BMT10-HNRJ": 1,
      "V-500DA CSB-BGC": 1,
      "KIAS-14": 6,
      "YHKOT-DVH-BMW": 1,
      "298 KMT-BYNH": 2,
      "298 YHKOT-BYNH": 1,
      "HNH-PTH": 1,
      "224-DA": 14,
      "YHK-KDGC": 2,
      "PTH-MYH": 12,
      "PTH-CHK": 1,
      "PTH-HNS": 1,
      "PTH-NGH": 1,
      "PTH-IAF": 1,
      "YHK-CKH": 4,
      "243-L": 12,
      "BSK-DPJN": 5,
      "265-E": 6,
      "289-A": 53,
      "64 DPN-SBS": 1,
      "TR-4 JJN-PLG": 2,
      "PTH-MGH": 2,
      "MEBP-21B": 0,
      "227-J KMT-TVK": 1,
      "YTTMC-PTC": 3,
      "285-CA NES-JKBH": 1
    }
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
      "G-11",
      "G-8",
      "256-F",
      "258-TC"
    ],
    "boothCodes": [
      "29150322",
      "29150324",
      "29150325",
      "29150290",
      "29150292",
      "29150321",
      "29150323",
      "29150326",
      "29150298",
      "29150302",
      "29150303"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "258-S": 10,
      "G-8": 28,
      "257-H": 9,
      "502-FA": 24,
      "255-D": 15,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "258-TC": 25,
      "500-DG": 10,
      "248-AN": 13,
      "258-K": 9,
      "257-A": 4,
      "KBS-HRH": 2,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "ASK-GGP-KRP": 3,
      "YTTMC-NML-KNW": 3,
      "289-C": 8,
      "MNH-HBL": 2,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "257-D": 10,
      "BSK-MNH": 2,
      "258-U": 13,
      "500-AC": 9,
      "258-VC": 13,
      "258-E": 9,
      "256 KBS-SVNC": 3,
      "G-11": 35,
      "257-G": 10,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "258-F KMT-SVP": 1,
      "256-K": 7,
      "256-MB": 6,
      "258-C": 52,
      "255-E": 22,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "258-VG": 5,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255-L": 12,
      "255-N": 11,
      "258-CC": 36,
      "258-B": 17,
      "MF-27": 40,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "JHC-TAPL": 1,
      "258-CB BELF-YTTMC-NMG": 1,
      "256-B YTTMC-GJDH": 2,
      "258-CB YTTMC-ASK": 1,
      "256-D KBS-RVT": 1,
      "258-M KBS-YMH": 2,
      "258- KMT-LKH": 2,
      "258 KMT-ASK": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-C KBS-ASK": 2,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "256 YTTMC-VNC": 1,
      "258-N VSD-ASK": 1,
      "258-N YTTMC-ASK": 3,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258 JHC-ASK": 2,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "258 KMT-DSP": 2,
      "255-B KBS-NGR": 1,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "258 JHC-ADK": 1,
      "258-MC YTTMC-KBH": 2,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "258-CB YTTMC-ADK": 3,
      "257-D YTTMC-KDG": 1,
      "257-H YTTMC-ALR": 1,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258-CB YTTMC-DSP": 5,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-C KBS-DSP": 3,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "500-DG NML-JKLOA": 2,
      "258-GA KBS-BMSH": 2,
      "258-VG YTTMC-PLN": 1,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "G-8 MGRM-DSP": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-CC KBS-DSP": 1,
      "258-VA": 5,
      "263-R": 9,
      "263 KMT-KMS": 1,
      "263-K": 8,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "254B KBH-DSP": 1,
      "254-A  DSP-KGT": 2,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "250SA KDG-ASK": 1,
      "258C NGS-ASK": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "258-M": 25,
      "258-DN": 8,
      "502-FA NMG-SMH": 1,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "255-AC": 3,
      "258-WA": 11,
      "256-B": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "257-E": 17,
      "258-X": 24,
      "258-SA": 11,
      "242-RA": 8,
      "NML-KGR": 3
    }
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
      "G-8",
      "256-F",
      "258-TC",
      "258-M"
    ],
    "boothCodes": [
      "29150284",
      "29150285",
      "29150286",
      "29150293",
      "29150287",
      "29150311"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "258-S": 10,
      "G-8": 28,
      "257-H": 9,
      "502-FA": 24,
      "255-D": 15,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "240-F": 13,
      "258-TC": 25,
      "500-DG": 10,
      "248-AN": 13,
      "258-K": 9,
      "257-A": 4,
      "KBS-HRH": 2,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "ASK-GGP-KRP": 3,
      "YTTMC-NML-KNW": 3,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "257-D": 10,
      "258-U": 13,
      "500-AC": 9,
      "258-VC": 13,
      "258-E": 9,
      "256 KBS-SVNC": 3,
      "G-11": 35,
      "257-G": 10,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "258-F KMT-SVP": 1,
      "256-K": 7,
      "256-MB": 6,
      "258-C": 52,
      "255-E": 22,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "258-VG": 5,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255-L": 12,
      "255-N": 11,
      "BEMLA-10": 3,
      "258-CC": 36,
      "258-B": 17,
      "NICE-8": 2,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "TAPL-1": 2,
      "JHC-TAPL": 1,
      "BELGS-18": 2,
      "258-CB BELF-YTTMC-NMG": 1,
      "256-B YTTMC-GJDH": 2,
      "258-CB YTTMC-ASK": 1,
      "256-D KBS-RVT": 1,
      "258-M KBS-YMH": 2,
      "258- KMT-LKH": 2,
      "258 KMT-ASK": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-C KBS-ASK": 2,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "256 YTTMC-VNC": 1,
      "258-N VSD-ASK": 1,
      "258-N YTTMC-ASK": 3,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258 JHC-ASK": 2,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "258 KMT-DSP": 2,
      "255-B KBS-NGR": 1,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "258 JHC-ADK": 1,
      "258-MC YTTMC-KBH": 2,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "258-CB YTTMC-ADK": 3,
      "257-D YTTMC-KDG": 1,
      "257-H DSP-ALR": 1,
      "257-H YTTMC-ALR": 1,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258-CB YTTMC-DSP": 5,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-C KBS-DSP": 3,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "500-DG NML-JKLOA": 2,
      "258-GA KBS-BMSH": 2,
      "258-VG YTTMC-PLN": 1,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "G-8 MGRM-DSP": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-CC KBS-DSP": 1,
      "258-VA": 5,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "254B KBH-DSP": 1,
      "254-A  DSP-KGT": 2,
      "257B DSP-MKPL": 1,
      "257E DSP-ALR": 1,
      "ASK-NGS": 2,
      "257A DSP-HRH": 1,
      "ASK-DBKL": 1,
      "250SA KDG-ASK": 1,
      "258C NGS-ASK": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "258-M": 25,
      "258-DN": 8,
      "502-FA NMG-SMH": 1,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "255-AC": 3,
      "258-WA": 11,
      "256-B": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "257-E": 17,
      "258-X": 24,
      "258-SA": 11,
      "242-RA": 8,
      "NML-KGR": 3
    }
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
      "241-B",
      "240-C",
      "245-M",
      "240-D"
    ],
    "boothCodes": [
      "29150374",
      "29150371",
      "29150372"
    ],
    "routesMap": {
      "TVK-VSD": 1,
      "238-H": 6,
      "240-D": 17,
      "242-B": 57,
      "242-B D31G-TVK": 4,
      "240-R": 45,
      "D31G-KCH": 2,
      "335-P D35G-KDG": 2,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-GA": 13,
      "PSS-KTNH": 4,
      "242-VA": 4,
      "242-FA": 8,
      "240-E": 11,
      "241-P": 12,
      "242-J": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-N": 12,
      "242-LA": 8,
      "242-L": 6,
      "G-7": 43,
      "240-A": 12,
      "242-M": 9,
      "242-RA": 8,
      "240-C": 23,
      "241-C": 11,
      "241-CB": 28,
      "241-G": 6,
      "242-F": 9,
      "242-H": 8,
      "242-JK": 7,
      "242-MA": 6,
      "242-TA KBS-MTK": 2,
      "242-Q": 9,
      "242-TA": 4,
      "242-Y": 6,
      "242-X": 12,
      "KBS-MGDRD-D35G": 13,
      "D35G-MGDRD-KBS": 4,
      "242 D35G-SJT-KBS": 2,
      "265-A KBS-D35G": 2,
      "245-MA": 6,
      "CLO-AVH": 1,
      "245-K": 8,
      "VBN-TVK": 4,
      "242-Z": 17,
      "240-F": 13,
      "G-7 D31G-JTS": 1,
      "245-AA": 4,
      "SGH-KBS": 5,
      "KBS-SGH": 5,
      "D31G-NGHN": 1,
      "242-R": 9,
      "336-B SNBS-KMP": 2,
      "245-C": 10,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "D35G-SBS": 3,
      "SBS-KBS-D35G": 3,
      "242-ZB": 8,
      "242-JA": 7,
      "242-U": 10,
      "240-J": 8,
      "D35G-TGP": 1,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "TPH-D35G": 1,
      "245-Q": 8,
      "GKH-D35G": 1,
      "D35G-STH": 1,
      "245-D": 9,
      "D31G-KCP": 1,
      "241-B": 26,
      "242-W": 6,
      "245-A": 9,
      "242-B KBS-BKPN": 2,
      "242-FB": 13,
      "242-ZD": 9,
      "242-ZD D31G-KLR": 1,
      "410-FC BSK-TVK": 3,
      "248-V KMT-D35G": 1,
      "241 D35G-KMT": 3,
      "242-TC": 12,
      "242-E": 2,
      "D-31G-KDG": 1,
      "252-C": 14,
      "248-HA": 9,
      "241-M": 6,
      "240-N": 8,
      "JTS-PSS": 4,
      "NICE-6": 3,
      "240-M": 8,
      "242-B BSN-TVK": 3,
      "KBS-SSPC": 2,
      "241-CD": 11,
      "410-FC TVK-DPN": 2,
      "241-E": 9,
      "CFLS-KMT": 2,
      "KMT-VDH-CFLS": 3,
      "242-ZC CFLS-KBS": 1,
      "JHC-SSPCM": 1,
      "KBS-SSPCM": 1,
      "V-KBS-GOLT": 3,
      "248-J CKB-JPLK": 1,
      "240-A KBS-MCH": 3,
      "242-W KMT-DBGL": 1,
      "240-F KMT-MDH": 3,
      "240-MB": 6,
      "243-M": 7,
      "240-K": 7,
      "242-ZC": 6,
      "242-ZC KMT-BMH-KGH": 1,
      "240-MB KMT-MGD": 1,
      "242-V D31G-CKH": 1,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "KMT-SGHG": 1,
      "248-BA CLO-CKB": 1,
      "D35G-MGDT": 2,
      "240-K MRTG-BSKR": 1,
      "240-MB MRTG-MGD": 1,
      "245-M MNKH-MRTG": 1,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "241 MRTG-KCP": 1,
      "241-CB MRTG-YKH": 1,
      "241-M MRTG-SVND": 1,
      "242-TC KMT-SNDKP": 1,
      "242-B MRTG-SGHG": 1,
      "242-E KBS-CNH": 1,
      "242-F MRTG-YLG": 1,
      "242-H MRTG-MDP": 1,
      "242-J MRTG-DMH": 1,
      "242-JA KMT-GNK": 2,
      "242-N MRTG-GDH": 1,
      "D35G-SMH": 1,
      "242-P": 8,
      "242-P SMH-HLH": 1,
      "242-Q MRTG-GNGH": 1,
      "242-R MRTG-JGH": 1,
      "242-U MRTG-LKP": 1,
      "242-Y MRTG-AMP": 1,
      "242-B CVB-D35G": 1,
      "243-M MRTG-SPH": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1,
      "D35G-BDH": 1,
      "D35G-SWTK-SBS": 1,
      "361-B CPR-CHD": 1,
      "D35G-HRH-TGP": 1,
      "SGHG-SKT-JHC": 1,
      "D35G-KGR": 3,
      "D35G-YBS": 1,
      "410-T": 6,
      "D35G-BHL": 1,
      "V-GOLT-KDG": 0
    }
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
      "G-8",
      "256-F",
      "258-TC",
      "258-M"
    ],
    "boothCodes": [
      "29150263",
      "29150259"
    ],
    "routesMap": {
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "258-S": 10,
      "G-8": 28,
      "502-FA": 24,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "240-F": 13,
      "258-TC": 25,
      "500-DG": 10,
      "248-AN": 13,
      "258-K": 9,
      "D43-ASK NML": 5,
      "298-P": 64,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "ASK-GGP-KRP": 3,
      "YTTMC-NML-KNW": 3,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "258-U": 13,
      "500-AC": 9,
      "258-VC": 13,
      "258-E": 9,
      "256 KBS-SVNC": 3,
      "258-F KMT-SVP": 1,
      "256-K": 7,
      "256-MB": 6,
      "BMT43-ASK": 2,
      "258-C": 52,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "258-VG": 5,
      "258-CC": 36,
      "258-B": 17,
      "NICE-8": 2,
      "BELGS-22": 1,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "TAPL-NMG": 1,
      "258-CB BELF-YTTMC-NMG": 1,
      "256-B YTTMC-GJDH": 2,
      "258-CB YTTMC-ASK": 1,
      "257-C ASK-RVT": 1,
      "257-G ASK-AKMV": 1,
      "258-C ASK-NMG": 3,
      "258-M KBS-YMH": 2,
      "258- KMT-LKH": 2,
      "258 KMT-ASK": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-C KBS-ASK": 2,
      "258-F ASK-SVP": 1,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "256 YTTMC-VNC": 1,
      "258-N VSD-ASK": 1,
      "258-N YTTMC-ASK": 3,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258-Y ASK-MBWD": 1,
      "258 JHC-ASK": 2,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "258 ADK-NMG": 2,
      "258-MC YTTMC-KBH": 2,
      "256-MB DSP-MTG": 1,
      "258 DSP-NMG": 3,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "500-DG NML-JKLOA": 2,
      "258-GA KBS-BMSH": 2,
      "258-R DSP-HNS": 1,
      "258-VC DSP-YLG": 1,
      "258-VG DSP-BNV": 1,
      "258-VG YTTMC-PLN": 1,
      "258-YA DSP-HCP": 1,
      "500-DG NMG-KRPRS": 2,
      "G-8 DSP-ISM": 1,
      "258-H DSP-VDH": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-VA": 5,
      "NLM-BEL LT": 2,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "250SA KDG-ASK": 1,
      "258C NGS-ASK": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "258-M": 25,
      "258-DN": 8,
      "502-FA NMG-SMH": 1,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "258-WA": 11,
      "256-B": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "256-MA VNC-TRHH": 2,
      "255-AC VNC-VDH": 1,
      "258-X": 24,
      "258-SA": 11,
      "242-RA": 8,
      "NML-KGR": 3
    }
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
      "289-P",
      "282-A",
      "63-B",
      "401-BJ"
    ],
    "boothCodes": [
      "29150108",
      "29150118"
    ],
    "routesMap": {
      "289-D": 11,
      "401-AM": 11,
      "BYH-PTH": 1,
      "DVHGH-PTH": 4,
      "282-H": 7,
      "401-AB": 5,
      "336-B SNBS-KMP": 2,
      "43-E SNBS-SVN": 2,
      "289-CA": 28,
      "RJP- PTH": 1,
      "282-F": 11,
      "PTH-MNH": 1,
      "PTH-BSF": 1,
      "289-F PTH-HSK": 3,
      "289-F": 28,
      "401-AE": 7,
      "356-CD HSR BC-DTG": 1,
      "D10G-RCH": 2,
      "289-H": 9,
      "YHK-MLH": 1,
      "KBS-BDL": 1,
      "407-C": 6,
      "GDH-PTH": 1,
      "297-G": 1,
      "289-L": 13,
      "401-BJ": 18,
      "YHKOT-BDL": 2,
      "PTH-KLP": 1,
      "YHKOT-DVH": 1,
      "289-A YHKOT-BKH": 6,
      "PTH-KIAS": 1,
      "KBS-KIAS": 4,
      "PTH-BDL": 1,
      "297-A": 12,
      "KBS-ISNH": 1,
      "282-A": 25,
      "283-E": 11,
      "356-CW-FLY": 71,
      "281-F": 7,
      "KMT-BYH": 0,
      "282-B": 13,
      "298-PD": 2,
      "ACC B-56": 2,
      "289-C": 8,
      "283-D": 3,
      "282-D": 8,
      "298-ME": 8,
      "298-MS": 9,
      "295-G": 17,
      "289-K": 4,
      "KLP-PTH": 1,
      "BYH-KBS": 5,
      "298Y PTH-YHS": 1,
      "281-C": 18,
      "281-A": 7,
      "281-G": 10,
      "63-B": 25,
      "283-B": 8,
      "298-MH": 8,
      "289-B": 8,
      "283-A": 14,
      "298-Y": 6,
      "CKH-YHK": 3,
      "BMH-PTH": 3,
      "DVH-YHKOT": 6,
      "401-JB": 8,
      "297-F": 4,
      "407-B": 14,
      "291-L": 3,
      "281-H": 4,
      "KMT-BSFY": 6,
      "289-E": 14,
      "298-M": 18,
      "298-MC": 4,
      "298-MA": 7,
      "298-MG": 6,
      "297-H": 1,
      "KRPRS-HMRH": 1,
      "HNS-YLKOT": 2,
      "298-A": 8,
      "401-Y": 9,
      "401-J": 5,
      "297-K": 16,
      "291-K": 7,
      "PTH-KNDC": 1,
      "YLKOT-TRPT-KNDC": 1,
      "298-E": 10,
      "289-M": 8,
      "298-MY": 16,
      "KMT-VSNP": 2,
      "297-B": 5,
      "289-P": 26,
      "401-JC YTTMC-BKH": 3,
      "299-E": 9,
      "282-C YHK-BLR": 2,
      "ADT-IAF": 1,
      "ADT-BMH": 1,
      "ADT-NMG": 1,
      "298M KBS-VTHM": 1,
      "VNS-YHK-TRT": 1,
      "298-B": 6,
      "MADT-BCP": 1,
      "297-B PTML-DGH": 1,
      "297-B KBS-DGH": 2,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "289-L YSTF-MVJ": 1,
      "289-L YHKOT-CKHL": 1,
      "PTH-DVHGH": 2,
      "297-G PTH-DCH": 1,
      "297 STP-AFSY": 2,
      "IAF-HMPN": 2,
      "283E PTML-THS": 2,
      "278-A": 8,
      "297 YHKOT-BVP": 5,
      "297F PTH-BVP": 1,
      "289 PTH-BKHL": 1,
      "297 YHK-HGH": 1,
      "298M PTH-DVHOB": 2,
      "289CA PTH-HNH": 2,
      "401BJ PTH-YHK-BLR": 3,
      "289 YHKOT-ARS": 2,
      "298 PTH-DVH": 2,
      "298Y YHKOT-YLR": 2,
      "289-F MDR-YHOT": 1,
      "282-A PTH-HSH": 1,
      "298ME PTH-DVHGH": 1,
      "298 PTH-IAF": 1,
      "298PD PTH-NLR": 1,
      "401-BJ BMSITY-BGLR": 1,
      "CHAKRA-10A": 6,
      "CHAKRA-10 BMT10-HNRJ": 1,
      "V-500DA CSB-BGC": 1,
      "YHKOT-DVH-BMW": 1,
      "298 KMT-BYNH": 2,
      "298 YHKOT-BYNH": 1,
      "HNH-PTH": 1,
      "224-DA": 14,
      "YHK-KDGC": 2,
      "PTH-MYH": 12,
      "PTH-CHK": 1,
      "PTH-HNS": 1,
      "PTH-NGH": 1,
      "PTH-IAF": 1,
      "YHK-CKH": 4,
      "243-L": 12,
      "BSK-DPJN": 5,
      "265-E": 6,
      "289-A": 53,
      "64 DPN-SBS": 1,
      "TR-4 JJN-PLG": 2,
      "PTH-MGH": 2,
      "MEBP-21B": 0,
      "227-J KMT-TVK": 1,
      "YTTMC-PTC": 3,
      "285-CA NES-JKBH": 1
    }
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
      "256-F",
      "258-TC",
      "258-M",
      "502-FA"
    ],
    "boothCodes": [
      "29150262",
      "29150263",
      "29150260",
      "29150261"
    ],
    "routesMap": {
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "258-S": 10,
      "G-8": 28,
      "502-FA": 24,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "240-F": 13,
      "258-TC": 25,
      "500-DG": 10,
      "248-AN": 13,
      "258-K": 9,
      "360-Q": 7,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "ASK-GGP-KRP": 3,
      "YTTMC-NML-KNW": 3,
      "KBS-DSP": 1,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "D40-DSP": 5,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "258-U": 13,
      "500-AC": 9,
      "258-VC": 13,
      "258-E": 9,
      "256 KBS-SVNC": 3,
      "258-F KMT-SVP": 1,
      "256-K": 7,
      "256-MB": 6,
      "258-C": 52,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "258-VG": 5,
      "258-CC": 36,
      "258-B": 17,
      "NICE-8": 2,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "TAPL-NMG": 1,
      "258-CB BELF-YTTMC-NMG": 1,
      "256-B YTTMC-GJDH": 2,
      "258-CB YTTMC-ASK": 1,
      "257-C ASK-RVT": 1,
      "257-G ASK-AKMV": 1,
      "258-M KBS-YMH": 2,
      "258- KMT-LKH": 2,
      "258 KMT-ASK": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-C KBS-ASK": 2,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "256 YTTMC-VNC": 1,
      "258-N VSD-ASK": 1,
      "258-N YTTMC-ASK": 3,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258 JHC-ASK": 2,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "258 ADK-NMG": 2,
      "258 KMT-DSP": 2,
      "258-MC YTTMC-KBH": 2,
      "255-J  DSP-HNS": 1,
      "256-MB DSP-MTG": 1,
      "257-H DSP-ALR": 1,
      "258 DSP-NMG": 3,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258-CB YTTMC-DSP": 5,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-C KBS-DSP": 3,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "500-DG NML-JKLOA": 2,
      "258-GA KBS-BMSH": 2,
      "258-R DSP-HNS": 1,
      "258-VC DSP-YLG": 1,
      "258-VG DSP-BNV": 1,
      "258-VG YTTMC-PLN": 1,
      "258-YA DSP-HCP": 1,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "G-8 DSP-ISM": 1,
      "G-8 MGRM-DSP": 1,
      "258-H DSP-VDH": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-CC KBS-DSP": 1,
      "258-VA": 5,
      "NLM-BEL LT": 2,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "254B KBH-DSP": 1,
      "254-A  DSP-KGT": 2,
      "257B DSP-MKPL": 1,
      "257E DSP-ALR": 1,
      "ASK-NGS": 2,
      "257A DSP-HRH": 1,
      "ASK-DBKL": 1,
      "255H DSP-GDP": 1,
      "250SA KDG-ASK": 1,
      "258C NGS-ASK": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "258-M": 25,
      "258-DN": 8,
      "502-FA NMG-SMH": 1,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "258-WA": 11,
      "256-B": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "255-AC VNC-VDH": 1,
      "258-X": 24,
      "258-SA": 11,
      "242-RA": 8,
      "NML-KGR": 3
    }
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
      "289-P",
      "282-A",
      "63-B",
      "401-BJ"
    ],
    "boothCodes": [
      "29150108",
      "29150109",
      "29150107",
      "29150111",
      "29150113",
      "29150114",
      "29150116",
      "29150119",
      "29150175",
      "29150190",
      "29150191",
      "29150112"
    ],
    "routesMap": {
      "289-D": 11,
      "401-AM": 11,
      "DVHGH-PTH": 4,
      "401-AB": 5,
      "336-B SNBS-KMP": 2,
      "43-E SNBS-SVN": 2,
      "289-CA": 28,
      "RJP- PTH": 1,
      "282-F": 11,
      "PTH-MNH": 1,
      "PTH-BSF": 1,
      "289-F PTH-HSK": 3,
      "289-F": 28,
      "401-AE": 7,
      "356-CD HSR BC-DTG": 1,
      "D10G-RCH": 2,
      "289-H": 9,
      "YHK-MLH": 1,
      "KBS-BDL": 1,
      "407-C": 6,
      "GDH-PTH": 1,
      "297-G": 1,
      "289-L": 13,
      "401-BJ": 18,
      "YHKOT-BDL": 2,
      "PTH-KLP": 1,
      "YHKOT-DVH": 1,
      "289-A YHKOT-BKH": 6,
      "PTH-KIAS": 1,
      "KBS-KIAS": 4,
      "PTH-BDL": 1,
      "297-A": 12,
      "KBS-ISNH": 1,
      "282-A": 25,
      "283-E": 11,
      "356-CW-FLY": 71,
      "KMT-BYH": 0,
      "282-B": 13,
      "298-PD": 2,
      "ACC B-56": 2,
      "289-C": 8,
      "283-D": 3,
      "282-D": 8,
      "298-ME": 8,
      "298-MS": 9,
      "295-G": 17,
      "289-K": 4,
      "KLP-PTH": 1,
      "284-G": 8,
      "BYH-KBS": 5,
      "298Y PTH-YHS": 1,
      "281-C": 18,
      "281-A": 7,
      "281-G": 10,
      "63-B": 25,
      "283-B": 8,
      "298-MH": 8,
      "289-B": 8,
      "283-A": 14,
      "298-Y": 6,
      "CKH-YHK": 3,
      "BMH-PTH": 3,
      "DVH-YHKOT": 6,
      "401-JB": 8,
      "297-F": 4,
      "407-B": 14,
      "291-L": 3,
      "281-H": 4,
      "KMT-BSFY": 6,
      "289-E": 14,
      "298-M": 18,
      "298-MA": 7,
      "298-MG": 6,
      "KRPRS-HMRH": 1,
      "HNS-YLKOT": 2,
      "298-A": 8,
      "401-Y": 9,
      "401-J": 5,
      "297-K": 16,
      "PTH-KNDC": 1,
      "YLKOT-TRPT-KNDC": 1,
      "298-E": 10,
      "289-M": 8,
      "298-MY": 16,
      "KMT-VSNP": 2,
      "297-B": 5,
      "289-P": 26,
      "401-JC YTTMC-BKH": 3,
      "299-E": 9,
      "282-C YHK-BLR": 2,
      "ADT-IAF": 1,
      "ADT-BMH": 1,
      "ADT-NMG": 1,
      "298M KBS-VTHM": 1,
      "VNS-YHK-TRT": 1,
      "298-B": 6,
      "MADT-BCP": 1,
      "297-B PTML-DGH": 1,
      "297-B KBS-DGH": 2,
      "289-K BMT46-KDYH": 1,
      "289-L YSTF-MVJ": 1,
      "289-L YHKOT-CKHL": 1,
      "PTH-DVHGH": 2,
      "297-G PTH-DCH": 1,
      "297 STP-AFSY": 2,
      "IAF-HMPN": 2,
      "283E PTML-THS": 2,
      "278-A": 8,
      "297 YHKOT-BVP": 5,
      "297F PTH-BVP": 1,
      "289 PTH-BKHL": 1,
      "297 YHK-HGH": 1,
      "298M PTH-DVHOB": 2,
      "284 PTH-KVRYHK": 1,
      "284 KBS-KVRYHK": 1,
      "289CA PTH-HNH": 2,
      "401BJ PTH-YHK-BLR": 3,
      "289 YHKOT-ARS": 2,
      "298 PTH-DVH": 2,
      "298Y YHKOT-YLR": 2,
      "289-F MDR-YHOT": 1,
      "282-A PTH-HSH": 1,
      "298ME PTH-DVHGH": 1,
      "298 PTH-IAF": 1,
      "298PD PTH-NLR": 1,
      "401-BJ BMSITY-BGLR": 1,
      "V-500DA CSB-BGC": 1,
      "YHKOT-DVH-BMW": 1,
      "298 KMT-BYNH": 2,
      "298 YHKOT-BYNH": 1,
      "HNH-PTH": 1,
      "224-DA": 14,
      "YHK-KDGC": 2,
      "PTH-MYH": 12,
      "PTH-CHK": 1,
      "PTH-KVRYHK": 1,
      "PTH-HNS": 1,
      "PTH-NGH": 1,
      "PTH-IAF": 1,
      "YHK-CKH": 4,
      "243-L": 12,
      "BSK-DPJN": 5,
      "265-E": 6,
      "289-A": 53,
      "64 DPN-SBS": 1,
      "PTH-MGH": 2,
      "MEBP-21B": 0,
      "YTTMC-PTC": 3,
      "285-CA NES-JKBH": 1
    }
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
      "12F-5",
      "398-H",
      "V-335EK",
      "399-A"
    ],
    "boothCodes": [
      "29150363",
      "29150355",
      "29150365",
      "29150353"
    ],
    "routesMap": {
      "D35G-JPT": 3,
      "D35G-MCH": 3,
      "D35G-TVK": 3,
      "D35G-GDH": 1,
      "D35G-BVRH": 1,
      "TVK-VSD": 1,
      "D35G-KDB": 1,
      "D35G-BKH": 1,
      "D35G-KTH": 1,
      "D35G-KCH": 2,
      "D35G-VDHTC": 1,
      "238-H": 6,
      "242-B": 57,
      "242-B D31G-TVK": 4,
      "335-P D35G-KDG": 2,
      "242-VA": 4,
      "242-FA": 8,
      "242-J": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-N": 12,
      "242-LA": 8,
      "242-L": 6,
      "242-M": 9,
      "242-RA": 8,
      "241-G": 6,
      "242-F": 9,
      "242-H": 8,
      "242-JK": 7,
      "242-MA": 6,
      "242-TA KBS-MTK": 2,
      "242-Q": 9,
      "242-TA": 4,
      "242-Y": 6,
      "242-X": 12,
      "KBS-MGDRD-D35G": 13,
      "D35G-MGDRD-KBS": 4,
      "JPT-D35G": 6,
      "242 D35G-SJT-KBS": 2,
      "98-F VSDLO-VSD": 1,
      "D35G-KKP": 1,
      "D35G-MTK": 1,
      "265-A KBS-D35G": 2,
      "D35G-AMP": 1,
      "VBN-TVK": 4,
      "242-Z": 17,
      "398-H": 26,
      "399-F": 16,
      "SGH-KBS": 5,
      "KBS-SGH": 5,
      "242-R": 9,
      "D35G-SBS": 3,
      "SBS-KBS-D35G": 3,
      "242-ZB": 8,
      "242-JA": 7,
      "D35G-GNK": 1,
      "242-U": 10,
      "240-J": 8,
      "JGH-D35G": 1,
      "D35G-TGP": 1,
      "SRYN-HSK": 3,
      "SRN-HSK": 2,
      "TPH-D35G": 1,
      "D35G-BTH": 1,
      "GKH-D35G": 1,
      "D35G-STH": 1,
      "12F-5": 28,
      "242-W": 6,
      "242-B KBS-BKPN": 2,
      "242-FB": 13,
      "242-ZD": 9,
      "242-ZD D31G-KLR": 1,
      "410-FC BSK-TVK": 3,
      "KTH-D35G": 1,
      "248-V KMT-D35G": 1,
      "242-TC": 12,
      "V-335EK": 22,
      "242-E": 2,
      "242-X D35G-DDR": 1,
      "248-HA": 9,
      "606 DVG-HSK": 1,
      "241-M": 6,
      "240-N": 8,
      "240-M": 8,
      "242-B BSN-TVK": 3,
      "242-TB D35G-KVH": 1,
      "500-C": 42,
      "HBL-ITPL-NBWSC": 1,
      "NBWSC-KDG": 1,
      "SBS-SVR-HSKGH": 4,
      "410-FC TVK-DPN": 2,
      "245-H NML-D35G": 1,
      "BSPB-BEML": 1,
      "BSPB-KBS": 3,
      "321-A": 9,
      "V-KBS-KTMN": 6,
      "BSK-HSK": 2,
      "V-319HK": 9,
      "V-319KH": 12,
      "CFLS-KMT": 2,
      "KMT-VDH-CFLS": 3,
      "242-ZC CFLS-KBS": 1,
      "GNH-D35G": 1,
      "242-W KMT-DBGL": 1,
      "MDR-KMG-DGN": 1,
      "304-V MDR-CKT": 2,
      "MDR-KDGB": 3,
      "240-MB": 6,
      "243-M": 7,
      "240-K": 7,
      "242-ZC": 6,
      "242-ZC KMT-BMH-KGH": 1,
      "240-MB KMT-MGD": 1,
      "326-E HSK-KBS": 3,
      "326-E KBS-HSK": 3,
      "V-TNF-HOD-ITPL-KDG-HSK": 2,
      "242-V D31G-CKH": 1,
      "KMT-SGHG": 1,
      "248-BA CLO-CKB": 1,
      "D35G-MGDT": 2,
      "240-K MRTG-BSKR": 1,
      "240-MB MRTG-MGD": 1,
      "D35G-KDBC": 1,
      "241-M MRTG-SVND": 1,
      "242-TC KMT-SNDKP": 1,
      "242-B MRTG-SGHG": 1,
      "SGHG-TVK": 1,
      "242-E KBS-CNH": 1,
      "KDG-AVH-RMP": 1,
      "242-F MRTG-YLG": 1,
      "328-H HSK-ATB": 6,
      "328-HV": 1,
      "242-H MRTG-MDP": 1,
      "242-J MRTG-DMH": 1,
      "326-C MDR-KDGB": 1,
      "242-JA KMT-GNK": 2,
      "242-N MRTG-GDH": 1,
      "D35G-SMH": 1,
      "242-P": 8,
      "242-P SMH-HLH": 1,
      "242-Q MRTG-GNGH": 1,
      "242-R MRTG-JGH": 1,
      "242-U MRTG-LKP": 1,
      "242-Y MRTG-AMP": 1,
      "399-A SVP-HSK": 2,
      "242-B CVB-D35G": 1,
      "243-M MRTG-SPH": 1,
      "D35G-BDH": 1,
      "D35G-SWTK-SBS": 1,
      "12F-3 MDR-WFTTMC": 1,
      "V-500BH": 4,
      "334-E HSK-HALM": 1,
      "MDR-CNS": 1,
      "D35G-HRH-TGP": 1,
      "D35G-SKP": 1,
      "SGHG-SKT-JHC": 1,
      "D35G-TVK-NML": 1,
      "D35G-KGR": 3,
      "D35G-YBS": 1,
      "410-T": 6,
      "328-H": 0,
      "D35G-BHL": 1,
      "241-H": 49,
      "328-C": 6,
      "319 BMT24G-KSH": 1,
      "334-E": 30,
      "334-EA": 8,
      "399-A": 22,
      "HSK-KDG": 7,
      "12F-3": 18,
      "HSK-SRN": 1
    }
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
      "256-F",
      "258-TC",
      "258-M",
      "502-FA"
    ],
    "boothCodes": [
      "29150262",
      "29150260",
      "29150282",
      "29150284",
      "29150285",
      "29150286"
    ],
    "routesMap": {
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "258-S": 10,
      "G-8": 28,
      "502-FA": 24,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "240-F": 13,
      "258-TC": 25,
      "500-DG": 10,
      "248-AN": 13,
      "258-K": 9,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "ASK-GGP-KRP": 3,
      "YTTMC-NML-KNW": 3,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "258-U": 13,
      "500-AC": 9,
      "258-VC": 13,
      "258-E": 9,
      "256 KBS-SVNC": 3,
      "258-F KMT-SVP": 1,
      "256-K": 7,
      "256-MB": 6,
      "258-C": 52,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "258-VG": 5,
      "BMT40-ADK": 2,
      "258-CC": 36,
      "258-B": 17,
      "NICE-8": 2,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "TAPL-NMG": 1,
      "258-CB BELF-YTTMC-NMG": 1,
      "256-B YTTMC-GJDH": 2,
      "258-CB YTTMC-ASK": 1,
      "257-C ASK-RVT": 1,
      "256-D KBS-RVT": 1,
      "257-G ASK-AKMV": 1,
      "258-M KBS-YMH": 2,
      "258- KMT-LKH": 2,
      "258 KMT-ASK": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-C KBS-ASK": 2,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "256 YTTMC-VNC": 1,
      "258-N VSD-ASK": 1,
      "258-N YTTMC-ASK": 3,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258 JHC-ASK": 2,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "258 ADK-NMG": 2,
      "258 KMT-DSP": 2,
      "258 JHC-ADK": 1,
      "258-MC YTTMC-KBH": 2,
      "255-J  DSP-HNS": 1,
      "258-CB YTTMC-ADK": 3,
      "257-H DSP-ALR": 1,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258-CB YTTMC-DSP": 5,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-C KBS-DSP": 3,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "500-DG NML-JKLOA": 2,
      "258-GA KBS-BMSH": 2,
      "258-VG YTTMC-PLN": 1,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "G-8 MGRM-DSP": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-CC KBS-DSP": 1,
      "258-VA": 5,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "254B KBH-DSP": 1,
      "254-A  DSP-KGT": 2,
      "257B DSP-MKPL": 1,
      "257E DSP-ALR": 1,
      "ASK-NGS": 2,
      "257A DSP-HRH": 1,
      "ASK-DBKL": 1,
      "255H DSP-GDP": 1,
      "250SA KDG-ASK": 1,
      "258C NGS-ASK": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "258-M": 25,
      "258-DN": 8,
      "502-FA NMG-SMH": 1,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "258-WA": 11,
      "256-B": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "255-AC VNC-VDH": 1,
      "258-X": 24,
      "258-SA": 11,
      "242-RA": 8,
      "NML-KGR": 3
    }
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
      "256-F",
      "258-TC",
      "258-M",
      "502-FA"
    ],
    "boothCodes": [
      "29150262",
      "29150263",
      "29150261"
    ],
    "routesMap": {
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "258-S": 10,
      "G-8": 28,
      "502-FA": 24,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "240-F": 13,
      "258-TC": 25,
      "500-DG": 10,
      "248-AN": 13,
      "258-K": 9,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "ASK-GGP-KRP": 3,
      "YTTMC-NML-KNW": 3,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "258-U": 13,
      "500-AC": 9,
      "258-VC": 13,
      "258-E": 9,
      "256 KBS-SVNC": 3,
      "258-F KMT-SVP": 1,
      "256-K": 7,
      "256-MB": 6,
      "258-C": 52,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "258-VG": 5,
      "258-CC": 36,
      "258-B": 17,
      "NICE-8": 2,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "TAPL-NMG": 1,
      "258-CB BELF-YTTMC-NMG": 1,
      "256-B YTTMC-GJDH": 2,
      "258-CB YTTMC-ASK": 1,
      "257-C ASK-RVT": 1,
      "257-G ASK-AKMV": 1,
      "258-M KBS-YMH": 2,
      "258- KMT-LKH": 2,
      "258 KMT-ASK": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-C KBS-ASK": 2,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "256 YTTMC-VNC": 1,
      "258-N VSD-ASK": 1,
      "258-N YTTMC-ASK": 3,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258 JHC-ASK": 2,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "258 ADK-NMG": 2,
      "258-MC YTTMC-KBH": 2,
      "256-MB DSP-MTG": 1,
      "258 DSP-NMG": 3,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "500-DG NML-JKLOA": 2,
      "258-GA KBS-BMSH": 2,
      "258-R DSP-HNS": 1,
      "258-VC DSP-YLG": 1,
      "258-VG DSP-BNV": 1,
      "258-VG YTTMC-PLN": 1,
      "258-YA DSP-HCP": 1,
      "500-DG NMG-KRPRS": 2,
      "G-8 DSP-ISM": 1,
      "258-H DSP-VDH": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-VA": 5,
      "NLM-BEL LT": 2,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "250SA KDG-ASK": 1,
      "258C NGS-ASK": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "258-M": 25,
      "258-DN": 8,
      "502-FA NMG-SMH": 1,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "258-WA": 11,
      "256-B": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "255-AC VNC-VDH": 1,
      "258-X": 24,
      "258-SA": 11,
      "242-RA": 8,
      "NML-KGR": 3
    }
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
      "245-M",
      "242-Z",
      "245-H",
      "242-TB"
    ],
    "boothCodes": [
      "29150374",
      "29150368",
      "29150369",
      "29150370",
      "29150371",
      "29150372",
      "29150373"
    ],
    "routesMap": {
      "TVK-VSD": 1,
      "D35G-KCH": 2,
      "238-H": 6,
      "242-B": 57,
      "242-B D31G-TVK": 4,
      "240-R": 45,
      "D31G-KCH": 2,
      "335-P D35G-KDG": 2,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-GA": 13,
      "PSS-KTNH": 4,
      "242-VA": 4,
      "242-FA": 8,
      "240-E": 11,
      "242-J": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-N": 12,
      "242-LA": 8,
      "242-L": 6,
      "G-7": 43,
      "240-A": 12,
      "242-M": 9,
      "242-RA": 8,
      "240-C": 23,
      "241-G": 6,
      "242-F": 9,
      "242-H": 8,
      "242-JK": 7,
      "242-MA": 6,
      "242-TA KBS-MTK": 2,
      "242-Q": 9,
      "242-TA": 4,
      "242-Y": 6,
      "242-X": 12,
      "KBS-MGDRD-D35G": 13,
      "D35G-MGDRD-KBS": 4,
      "242 D35G-SJT-KBS": 2,
      "265-A KBS-D35G": 2,
      "245-MA": 6,
      "CLO-AVH": 1,
      "245-K": 8,
      "VBN-TVK": 4,
      "242-Z": 17,
      "240-F": 13,
      "G-7 D31G-JTS": 1,
      "245-AA": 4,
      "SGH-KBS": 5,
      "242-R": 9,
      "336-B SNBS-KMP": 2,
      "245-C": 10,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "D35G-SBS": 3,
      "SBS-KBS-D35G": 3,
      "242-ZB": 8,
      "242-JA": 7,
      "242-U": 10,
      "240-J": 8,
      "D35G-TGP": 1,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "TPH-D35G": 1,
      "245-Q": 8,
      "GKH-D35G": 1,
      "D35G-STH": 1,
      "245-D": 9,
      "242-W": 6,
      "245-A": 9,
      "242-B KBS-BKPN": 2,
      "242-FB": 13,
      "242-ZD": 9,
      "242-ZD D31G-KLR": 1,
      "410-FC BSK-TVK": 3,
      "248-V KMT-D35G": 1,
      "242-TC": 12,
      "242-E": 2,
      "D-31G-KDG": 1,
      "252-C": 14,
      "248-HA": 9,
      "241-M": 6,
      "240-N": 8,
      "JTS-PSS": 4,
      "240-M": 8,
      "242-B BSN-TVK": 3,
      "KBS-SSPC": 2,
      "410-FC TVK-DPN": 2,
      "CFLS-KMT": 2,
      "KMT-VDH-CFLS": 3,
      "242-ZC CFLS-KBS": 1,
      "JHC-SSPCM": 1,
      "KBS-SSPCM": 1,
      "248-J CKB-JPLK": 1,
      "240-A KBS-MCH": 3,
      "242-W KMT-DBGL": 1,
      "240-F KMT-MDH": 3,
      "240-MB": 6,
      "243-M": 7,
      "240-K": 7,
      "242-ZC": 6,
      "242-ZC KMT-BMH-KGH": 1,
      "240-MB KMT-MGD": 1,
      "242-V D31G-CKH": 1,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "KMT-SGHG": 1,
      "248-BA CLO-CKB": 1,
      "D35G-MGDT": 2,
      "240-K MRTG-BSKR": 1,
      "240-MB MRTG-MGD": 1,
      "245-M MNKH-MRTG": 1,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "241-M MRTG-SVND": 1,
      "242-TC KMT-SNDKP": 1,
      "242-B MRTG-SGHG": 1,
      "242-E KBS-CNH": 1,
      "242-F MRTG-YLG": 1,
      "242-H MRTG-MDP": 1,
      "242-J MRTG-DMH": 1,
      "242-JA KMT-GNK": 2,
      "242-N MRTG-GDH": 1,
      "D35G-SMH": 1,
      "242-P": 8,
      "242-P SMH-HLH": 1,
      "242-Q MRTG-GNGH": 1,
      "242-R MRTG-JGH": 1,
      "242-U MRTG-LKP": 1,
      "242-Y MRTG-AMP": 1,
      "242-B CVB-D35G": 1,
      "243-M MRTG-SPH": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1,
      "D35G-BDH": 1,
      "D35G-SWTK-SBS": 1,
      "361-B CPR-CHD": 1,
      "D35G-HRH-TGP": 1,
      "SGHG-SKT-JHC": 1,
      "D35G-KGR": 3,
      "D35G-YBS": 1,
      "410-T": 6
    }
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
      "KIAS-8",
      "KIAS-5",
      "281-C",
      "298-M"
    ],
    "boothCodes": [
      "29150108",
      "29150118"
    ],
    "routesMap": {
      "289-D": 11,
      "282-H": 7,
      "336-B SNBS-KMP": 2,
      "43-E SNBS-SVN": 2,
      "282-F": 11,
      "PTH-MNH": 1,
      "401-AE": 7,
      "356-CD HSR BC-DTG": 1,
      "YHK-MLH": 1,
      "KBS-BDL": 1,
      "407-C": 6,
      "297-G": 1,
      "YHKOT-BDL": 2,
      "PTH-KLP": 1,
      "YHKOT-DVH": 1,
      "PTH-KIAS": 1,
      "KBS-KIAS": 4,
      "PTH-BDL": 1,
      "297-A": 12,
      "KBS-ISNH": 1,
      "282-A": 25,
      "283-E": 11,
      "356-CW-FLY": 71,
      "281-F": 7,
      "KMT-BYH": 0,
      "282-B": 13,
      "298-PD": 2,
      "ACC B-56": 2,
      "283-D": 3,
      "282-D": 8,
      "298-ME": 8,
      "298-MS": 9,
      "298Y PTH-YHS": 1,
      "281-C": 18,
      "281-G": 10,
      "63-B": 25,
      "283-B": 8,
      "298-MH": 8,
      "283-A": 14,
      "298-Y": 6,
      "401-JB": 8,
      "297-F": 4,
      "291-L": 3,
      "281-H": 4,
      "298-M": 18,
      "298-MC": 4,
      "298-MA": 7,
      "298-MG": 6,
      "297-H": 1,
      "KRPRS-HMRH": 1,
      "298-A": 8,
      "401-Y": 9,
      "401-J": 5,
      "297-K": 16,
      "291-K": 7,
      "PTH-KNDC": 1,
      "YLKOT-TRPT-KNDC": 1,
      "298-E": 10,
      "298-MY": 16,
      "KMT-VSNP": 2,
      "297-B": 5,
      "299-E": 9,
      "282-C YHK-BLR": 2,
      "ADT-IAF": 1,
      "ADT-BMH": 1,
      "ADT-NMG": 1,
      "298M KBS-VTHM": 1,
      "VNS-YHK-TRT": 1,
      "298-B": 6,
      "MADT-BCP": 1,
      "297-B PTML-DGH": 1,
      "297-B KBS-DGH": 2,
      "283-D PTML-KDGC": 1,
      "PTH-DVHGH": 2,
      "297-G PTH-DCH": 1,
      "297 STP-AFSY": 2,
      "KIAS-7": 15,
      "KIAS-4": 9,
      "KIAS-4A": 9,
      "KIAS-6A": 7,
      "KIAS-5": 20,
      "KIAS-6K": 3,
      "KIAS-7A": 11,
      "KIAS-9": 38,
      "KIAS-12": 15,
      "KIAS-8": 22,
      "KIAS-5A": 8,
      "KIAS-8A": 15,
      "KIAS-5B": 6,
      "KIAS-8B": 6,
      "KIAS-8C": 8,
      "KIAS-8D": 10,
      "KIAS-5G": 2,
      "KIAS-8EW": 9,
      "283E PTML-THS": 2,
      "297 YHKOT-BVP": 5,
      "297F PTH-BVP": 1,
      "297 YHK-HGH": 1,
      "298M PTH-DVHOB": 2,
      "298 PTH-DVH": 2,
      "298Y YHKOT-YLR": 2,
      "KIAS-6": 16,
      "282-A PTH-HSH": 1,
      "298ME PTH-DVHGH": 1,
      "298 PTH-IAF": 1,
      "298PD PTH-NLR": 1,
      "KIAS-14": 6,
      "YHKOT-DVH-BMW": 1,
      "298 KMT-BYNH": 2,
      "298 YHKOT-BYNH": 1,
      "YHK-KDGC": 2,
      "PTH-MYH": 12,
      "PTH-HNS": 1,
      "PTH-NGH": 1,
      "PTH-IAF": 1,
      "BSK-DPJN": 5,
      "265-E": 6,
      "TR-4 JJN-PLG": 2,
      "PTH-MGH": 2
    }
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
      "285-MP",
      "507-C",
      "285-B",
      "284-B"
    ],
    "boothCodes": [
      "29150140",
      "29150145",
      "29150146",
      "29150152",
      "29150157",
      "29150158",
      "29150147",
      "29150139"
    ],
    "routesMap": {
      "BYH-PTH": 1,
      "DVHGH-PTH": 4,
      "290-E SBS-PTH": 0,
      "NES-SDP": 1,
      "HALLCA-PTH": 1,
      "507-C": 29,
      "RJP- PTH": 1,
      "D06G-BMSIT": 2,
      "285-MP": 30,
      "GDH-PTH": 1,
      "285-MK": 16,
      "285-MF": 38,
      "285-M": 54,
      "285-L": 11,
      "285-J": 12,
      "285-MG": 23,
      "KDG-CSB-D34": 5,
      "285-MA": 38,
      "285-T": 12,
      "KBS-YST-PTH": 8,
      "284-B": 24,
      "285-K": 14,
      "285-H": 14,
      "285-B": 26,
      "285-P": 13,
      "285-AA": 16,
      "285-CC": 4,
      "KDG-PTH": 5,
      "285-CA": 9,
      "285-M HBL-SGH": 2,
      "KLP-PTH": 1,
      "285-C": 12,
      "285-N": 15,
      "285-D": 13,
      "SBS-NES-PTH": 2,
      "YNALL-DBP": 2,
      "YHKOT-MLPH": 3,
      "285-G": 10,
      "285-M HBL-DBP": 2,
      "BMH-PTH": 3,
      "KNR-PTH": 1,
      "285-RB": 10,
      "V-285M": 18,
      "SBS-PTH": 8,
      "CRISTAL-5": 3,
      "285-JE": 17,
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "285-V": 18,
      "SBS-JKR-ALSG-PTH": 1,
      "KBS-MVL": 1,
      "KMT-MVL": 1,
      "BCS-BMSITY": 1,
      "SBS-RTN-BMSIT": 1,
      "YHKOT-BMSIT": 4,
      "285-TA": 11,
      "KBS-HBL-BMSIT": 1,
      "401 YTTMC-BMSIT": 1,
      "YNTAEH-BMSITY": 4,
      "YHKOT-HRTAD": 1,
      "285-CA NES-JKBH": 1,
      "285-K KMT-PMTL": 2,
      "285-CC NES-CTMK": 1,
      "285-K KBS-PTML": 7,
      "407-E YLKOT-LGNH": 1,
      "285-E NES-KKLV": 1,
      "285-C KBS-DTMKR": 2,
      "285-H KBS-KLH": 2,
      "285-JC NES-JTH": 1,
      "285-K NES-SDH": 1,
      "285-L NES-BYTH": 1,
      "285-MF NES-KDH": 1,
      "285-MG NES-BMGL": 1,
      "285-P NES-BTH": 1,
      "285-P KBS-BTH": 1,
      "285-X NES-DBR": 1,
      "406 YLKOT-NMG": 1,
      "285-M KBS-PTH": 7,
      "285-K NES-PTML": 7,
      "285-R": 16,
      "285-R NES-CHL": 2,
      "285-RA": 13,
      "285-RA NES-HNYR": 2,
      "285-W": 8,
      "285V YHK-SNH": 2,
      "284 SBS-MKC-PTH": 1,
      "BELF-NES-DBP": 1,
      "285M SBS-DBP": 0,
      "285M KBS-KRC-DBP": 1,
      "285-Y": 8,
      "285-M KBS-GITAM": 2,
      "KRP-YHK-HBL-GITHM": 6,
      "500-A BSK-HBLB-PTH": 3,
      "285-M KBS-APEL": 1,
      "285-A": 12,
      "285-A KBS-NDH": 1,
      "285 YHKOT-BMSITY": 1,
      "HNH-PTH": 1,
      "KDH-PTH": 1,
      "285-MC": 43,
      "243-L": 12,
      "D13G-ISRO": 4,
      "PSS-NMS": 2,
      "YHK-NITT": 7
    }
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
      "401-BR",
      "401-AF",
      "401-MK",
      "401-F"
    ],
    "boothCodes": [
      "29150228",
      "29150232",
      "29150233",
      "29150234",
      "29150238",
      "29150239",
      "29150240",
      "29150241",
      "29150227",
      "29150229",
      "29150230"
    ],
    "routesMap": {
      "401-AM": 11,
      "PTH-PSS": 3,
      "PHS-34": 15,
      "YTTMC-OASIS": 1,
      "YHKOT-TMK-KMT": 5,
      "JEAFS-KCBC": 1,
      "YHKOT-YTTMC": 8,
      "401-AB": 5,
      "PTH-VRP-KBS": 4,
      "401-R": 46,
      "401-KA": 3,
      "507-C YPRS-KRPG": 2,
      "401-A": 56,
      "407-F": 8,
      "401-AF": 32,
      "401-AE": 7,
      "JHC-YHK": 4,
      "401-RA": 8,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "407-C": 6,
      "401-BJ": 18,
      "PTH-VRP-TDL": 2,
      "401-RB YHK-MTR": 1,
      "401-RB": 10,
      "401-K CLO-YHKOT": 4,
      "BC-8": 9,
      "401-JB": 8,
      "407-B": 14,
      "YHK-MSP-VTTMC": 1,
      "YSTF-YTTMC": 4,
      "297-M": 2,
      "271-E": 12,
      "YTTMC-MSP-CHRS": 1,
      "401-D": 3,
      "401-BR": 34,
      "401-Y": 9,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "401-BA": 20,
      "401-BC": 14,
      "401-B": 42,
      "401-J": 5,
      "401 NLO-YHK": 10,
      "401-B YHKOT-MSP-HPN": 6,
      "60-L VTTMC-EASTEND": 2,
      "401-F": 32,
      "401-AR": 13,
      "401-T": 8,
      "401-JC YTTMC-BKH": 3,
      "YTTMC-YLK-BMES": 1,
      "YHK-YTTMC-PSB": 5,
      "276-AB": 22,
      "401-B YTTMC-DBH": 2,
      "401A BMSIT-PSS": 1,
      "PTH-MSP-PTCA": 1,
      "401 YTTMC-BMSIT": 1,
      "401-B YNTAEH-YTTMC": 3,
      "BMT45-YST-DSH": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "YHKOT-VRP": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "271-E BMT45-VRS": 1,
      "271-E KMT-VRS": 5,
      "401-A NMG-YHKOT": 0,
      "401-B DPJN-YHKOT": 2,
      "401 BMT45-YHKOT": 1,
      "401-A JHC-YHK": 2,
      "IAF-HMPN": 2,
      "MF-23A": 14,
      "401 YSTF-YTTMC": 2,
      "401AM PTH-PSS": 1,
      "401-B PTH-VRP-TDL": 0,
      "401 YHKOT-MSP": 2,
      "401-PS": 13,
      "401-K": 61,
      "401 PTMTL-YTTMC": 1,
      "401 YHKPS-YTTMC": 1,
      "401 BMT45-JSNL": 1,
      "276-AB BMT45-DBH": 1,
      "401-E": 32,
      "MEBP-21B": 0,
      "378 KGR-ELCW": 2,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3,
      "285-CA NES-JKBH": 1
    }
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
      "245-H",
      "242-TB",
      "252-C",
      "245-GA"
    ],
    "boothCodes": [
      "29150352",
      "29150354",
      "29150374",
      "29150368",
      "29150369",
      "29150370",
      "29150371",
      "29150372",
      "29150373"
    ],
    "routesMap": {
      "TVK-VSD": 1,
      "D35G-KCH": 2,
      "238-H": 6,
      "242-B": 57,
      "242-B D31G-TVK": 4,
      "335-P D35G-KDG": 2,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-GA": 13,
      "PSS-KTNH": 4,
      "242-VA": 4,
      "242-FA": 8,
      "240-E": 11,
      "242-J": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-N": 12,
      "242-LA": 8,
      "242-L": 6,
      "G-7": 43,
      "240-A": 12,
      "242-M": 9,
      "242-RA": 8,
      "241-G": 6,
      "242-F": 9,
      "242-H": 8,
      "242-JK": 7,
      "242-MA": 6,
      "242-TA KBS-MTK": 2,
      "242-Q": 9,
      "242-TA": 4,
      "242-Y": 6,
      "242-X": 12,
      "KBS-MGDRD-D35G": 13,
      "D35G-MGDRD-KBS": 4,
      "242 D35G-SJT-KBS": 2,
      "265-A KBS-D35G": 2,
      "245-MA": 6,
      "CLO-AVH": 1,
      "245-K": 8,
      "VBN-TVK": 4,
      "242-Z": 17,
      "G-7 D31G-JTS": 1,
      "245-AA": 4,
      "SGH-KBS": 5,
      "KBS-SGH": 5,
      "242-R": 9,
      "336-B SNBS-KMP": 2,
      "245-C": 10,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "D35G-SBS": 3,
      "SBS-KBS-D35G": 3,
      "242-ZB": 8,
      "242-JA": 7,
      "242-U": 10,
      "240-J": 8,
      "D35G-TGP": 1,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "TPH-D35G": 1,
      "245-Q": 8,
      "GKH-D35G": 1,
      "D35G-STH": 1,
      "245-D": 9,
      "242-W": 6,
      "245-A": 9,
      "242-B KBS-BKPN": 2,
      "242-FB": 13,
      "242-ZD": 9,
      "242-ZD D31G-KLR": 1,
      "410-FC BSK-TVK": 3,
      "248-V KMT-D35G": 1,
      "242-TC": 12,
      "242-E": 2,
      "D-31G-KDG": 1,
      "252-C": 14,
      "248-HA": 9,
      "241-M": 6,
      "240-N": 8,
      "JTS-PSS": 4,
      "240-M": 8,
      "242-B BSN-TVK": 3,
      "KBS-SSPC": 2,
      "410-FC TVK-DPN": 2,
      "CFLS-KMT": 2,
      "KMT-VDH-CFLS": 3,
      "242-ZC CFLS-KBS": 1,
      "JHC-SSPCM": 1,
      "KBS-SSPCM": 1,
      "248-J CKB-JPLK": 1,
      "240-A KBS-MCH": 3,
      "242-W KMT-DBGL": 1,
      "240-MB": 6,
      "243-M": 7,
      "240-K": 7,
      "242-ZC": 6,
      "242-ZC KMT-BMH-KGH": 1,
      "240-MB KMT-MGD": 1,
      "242-V D31G-CKH": 1,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "KMT-SGHG": 1,
      "248-BA CLO-CKB": 1,
      "D35G-MGDT": 2,
      "240-K MRTG-BSKR": 1,
      "240-MB MRTG-MGD": 1,
      "245-M MNKH-MRTG": 1,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "241-M MRTG-SVND": 1,
      "242-TC KMT-SNDKP": 1,
      "242-B MRTG-SGHG": 1,
      "242-E KBS-CNH": 1,
      "242-F MRTG-YLG": 1,
      "242-H MRTG-MDP": 1,
      "242-J MRTG-DMH": 1,
      "242-JA KMT-GNK": 2,
      "242-N MRTG-GDH": 1,
      "D35G-SMH": 1,
      "242-P": 8,
      "242-P SMH-HLH": 1,
      "242-Q MRTG-GNGH": 1,
      "242-R MRTG-JGH": 1,
      "242-U MRTG-LKP": 1,
      "242-Y MRTG-AMP": 1,
      "242-B CVB-D35G": 1,
      "243-M MRTG-SPH": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1,
      "D35G-BDH": 1,
      "D35G-SWTK-SBS": 1,
      "361-B CPR-CHD": 1,
      "D35G-HRH-TGP": 1,
      "SGHG-SKT-JHC": 1,
      "D35G-KGR": 3,
      "D35G-YBS": 1,
      "410-T": 6,
      "D35G-BHL": 1
    }
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
      "245-H",
      "242-TB",
      "252-C",
      "245-GA"
    ],
    "boothCodes": [
      "29150355",
      "29150352",
      "29150353",
      "29150354"
    ],
    "routesMap": {
      "D35G-MCH": 3,
      "TVK-VSD": 1,
      "D35G-BKH": 1,
      "D35G-KCH": 2,
      "238-H": 6,
      "242-B": 57,
      "242-B D31G-TVK": 4,
      "335-P D35G-KDG": 2,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-GA": 13,
      "PSS-KTNH": 4,
      "242-VA": 4,
      "242-FA": 8,
      "240-E": 11,
      "242-J": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-N": 12,
      "242-LA": 8,
      "242-L": 6,
      "G-7": 43,
      "240-A": 12,
      "242-M": 9,
      "242-RA": 8,
      "241-G": 6,
      "242-F": 9,
      "242-H": 8,
      "242-JK": 7,
      "242-MA": 6,
      "242-TA KBS-MTK": 2,
      "242-Q": 9,
      "242-TA": 4,
      "242-Y": 6,
      "242-X": 12,
      "KBS-MGDRD-D35G": 13,
      "D35G-MGDRD-KBS": 4,
      "242 D35G-SJT-KBS": 2,
      "265-A KBS-D35G": 2,
      "245-MA": 6,
      "CLO-AVH": 1,
      "245-K": 8,
      "VBN-TVK": 4,
      "242-Z": 17,
      "G-7 D31G-JTS": 1,
      "245-AA": 4,
      "SGH-KBS": 5,
      "KBS-SGH": 5,
      "242-R": 9,
      "336-B SNBS-KMP": 2,
      "245-C": 10,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "D35G-SBS": 3,
      "SBS-KBS-D35G": 3,
      "242-ZB": 8,
      "242-JA": 7,
      "242-U": 10,
      "240-J": 8,
      "D35G-TGP": 1,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "TPH-D35G": 1,
      "245-Q": 8,
      "GKH-D35G": 1,
      "D35G-STH": 1,
      "245-D": 9,
      "242-W": 6,
      "245-A": 9,
      "242-B KBS-BKPN": 2,
      "242-FB": 13,
      "242-ZD": 9,
      "242-ZD D31G-KLR": 1,
      "410-FC BSK-TVK": 3,
      "248-V KMT-D35G": 1,
      "242-TC": 12,
      "242-E": 2,
      "D-31G-KDG": 1,
      "252-C": 14,
      "248-HA": 9,
      "241-M": 6,
      "240-N": 8,
      "JTS-PSS": 4,
      "240-M": 8,
      "242-B BSN-TVK": 3,
      "410-FC TVK-DPN": 2,
      "CFLS-KMT": 2,
      "KMT-VDH-CFLS": 3,
      "242-ZC CFLS-KBS": 1,
      "240-A KBS-MCH": 3,
      "242-W KMT-DBGL": 1,
      "240-MB": 6,
      "243-M": 7,
      "240-K": 7,
      "242-ZC": 6,
      "242-ZC KMT-BMH-KGH": 1,
      "240-MB KMT-MGD": 1,
      "242-V D31G-CKH": 1,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "KMT-SGHG": 1,
      "248-BA CLO-CKB": 1,
      "D35G-MGDT": 2,
      "240-K MRTG-BSKR": 1,
      "240-MB MRTG-MGD": 1,
      "245-M MNKH-MRTG": 1,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "241-M MRTG-SVND": 1,
      "242-TC KMT-SNDKP": 1,
      "242-B MRTG-SGHG": 1,
      "242-E KBS-CNH": 1,
      "242-F MRTG-YLG": 1,
      "242-H MRTG-MDP": 1,
      "242-J MRTG-DMH": 1,
      "242-JA KMT-GNK": 2,
      "242-N MRTG-GDH": 1,
      "D35G-SMH": 1,
      "242-P": 8,
      "242-P SMH-HLH": 1,
      "242-Q MRTG-GNGH": 1,
      "242-R MRTG-JGH": 1,
      "242-U MRTG-LKP": 1,
      "242-Y MRTG-AMP": 1,
      "242-B CVB-D35G": 1,
      "243-M MRTG-SPH": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1,
      "D35G-BDH": 1,
      "D35G-SWTK-SBS": 1,
      "361-B CPR-CHD": 1,
      "D35G-HRH-TGP": 1,
      "SGHG-SKT-JHC": 1,
      "D35G-KGR": 3,
      "D35G-YBS": 1,
      "410-T": 6,
      "D35G-BHL": 1
    }
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
      "245-H",
      "242-TB",
      "252-C",
      "245-GA"
    ],
    "boothCodes": [
      "29150352",
      "29150354",
      "29150369",
      "29150371",
      "29150373"
    ],
    "routesMap": {
      "TVK-VSD": 1,
      "D35G-KCH": 2,
      "238-H": 6,
      "242-B": 57,
      "242-B D31G-TVK": 4,
      "335-P D35G-KDG": 2,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-GA": 13,
      "PSS-KTNH": 4,
      "242-VA": 4,
      "242-FA": 8,
      "240-E": 11,
      "242-J": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-N": 12,
      "242-LA": 8,
      "242-L": 6,
      "G-7": 43,
      "240-A": 12,
      "242-M": 9,
      "242-RA": 8,
      "241-G": 6,
      "242-F": 9,
      "242-H": 8,
      "242-JK": 7,
      "242-MA": 6,
      "242-TA KBS-MTK": 2,
      "242-Q": 9,
      "242-TA": 4,
      "242-Y": 6,
      "242-X": 12,
      "KBS-MGDRD-D35G": 13,
      "D35G-MGDRD-KBS": 4,
      "242 D35G-SJT-KBS": 2,
      "265-A KBS-D35G": 2,
      "245-MA": 6,
      "CLO-AVH": 1,
      "245-K": 8,
      "VBN-TVK": 4,
      "242-Z": 17,
      "G-7 D31G-JTS": 1,
      "245-AA": 4,
      "SGH-KBS": 5,
      "KBS-SGH": 5,
      "242-R": 9,
      "336-B SNBS-KMP": 2,
      "245-C": 10,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "D35G-SBS": 3,
      "SBS-KBS-D35G": 3,
      "242-ZB": 8,
      "242-JA": 7,
      "242-U": 10,
      "240-J": 8,
      "D35G-TGP": 1,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "TPH-D35G": 1,
      "245-Q": 8,
      "GKH-D35G": 1,
      "D35G-STH": 1,
      "245-D": 9,
      "242-W": 6,
      "245-A": 9,
      "242-B KBS-BKPN": 2,
      "242-FB": 13,
      "242-ZD": 9,
      "242-ZD D31G-KLR": 1,
      "410-FC BSK-TVK": 3,
      "248-V KMT-D35G": 1,
      "242-TC": 12,
      "242-E": 2,
      "D-31G-KDG": 1,
      "252-C": 14,
      "248-HA": 9,
      "241-M": 6,
      "240-N": 8,
      "JTS-PSS": 4,
      "240-M": 8,
      "242-B BSN-TVK": 3,
      "410-FC TVK-DPN": 2,
      "CFLS-KMT": 2,
      "KMT-VDH-CFLS": 3,
      "242-ZC CFLS-KBS": 1,
      "248-J CKB-JPLK": 1,
      "240-A KBS-MCH": 3,
      "242-W KMT-DBGL": 1,
      "240-MB": 6,
      "243-M": 7,
      "240-K": 7,
      "242-ZC": 6,
      "242-ZC KMT-BMH-KGH": 1,
      "240-MB KMT-MGD": 1,
      "242-V D31G-CKH": 1,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "KMT-SGHG": 1,
      "248-BA CLO-CKB": 1,
      "D35G-MGDT": 2,
      "240-K MRTG-BSKR": 1,
      "240-MB MRTG-MGD": 1,
      "245-M MNKH-MRTG": 1,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "241-M MRTG-SVND": 1,
      "242-TC KMT-SNDKP": 1,
      "242-B MRTG-SGHG": 1,
      "242-E KBS-CNH": 1,
      "242-F MRTG-YLG": 1,
      "242-H MRTG-MDP": 1,
      "242-J MRTG-DMH": 1,
      "242-JA KMT-GNK": 2,
      "242-N MRTG-GDH": 1,
      "D35G-SMH": 1,
      "242-P": 8,
      "242-P SMH-HLH": 1,
      "242-Q MRTG-GNGH": 1,
      "242-R MRTG-JGH": 1,
      "242-U MRTG-LKP": 1,
      "242-Y MRTG-AMP": 1,
      "242-B CVB-D35G": 1,
      "243-M MRTG-SPH": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1,
      "D35G-BDH": 1,
      "D35G-SWTK-SBS": 1,
      "361-B CPR-CHD": 1,
      "D35G-HRH-TGP": 1,
      "SGHG-SKT-JHC": 1,
      "D35G-KGR": 3,
      "D35G-YBS": 1,
      "410-T": 6,
      "D35G-BHL": 1
    }
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
      "256-F",
      "258-TC",
      "258-M",
      "258-X"
    ],
    "boothCodes": [
      "29150259"
    ],
    "routesMap": {
      "258-S": 10,
      "G-8": 28,
      "256-F": 25,
      "258-J": 6,
      "258-VB": 9,
      "258-VF": 16,
      "258-YA": 11,
      "240-F": 13,
      "258-TC": 25,
      "248-AN": 13,
      "258-K": 9,
      "V-258C": 13,
      "258-V": 8,
      "258-AB": 12,
      "258-SB": 9,
      "YTTMC-NML-KNW": 3,
      "248-HA": 9,
      "258-F": 11,
      "258-Q": 8,
      "258-KA": 9,
      "258-BN KVN-NML": 3,
      "258-QA": 11,
      "JKLO-NML": 5,
      "258-CB": 50,
      "258-U": 13,
      "258-VC": 13,
      "258-E": 9,
      "258-F KMT-SVP": 1,
      "256-MB": 6,
      "258-C": 52,
      "G-8 MGRM-ISM": 1,
      "258-Y": 5,
      "258-VG": 5,
      "258-CC": 36,
      "258-B": 17,
      "258-MA": 10,
      "258-M KBS-HLK": 2,
      "258-D KMT-TBS": 2,
      "TAPL-NMG": 1,
      "258-CB BELF-YTTMC-NMG": 1,
      "258-C ASK-NMG": 3,
      "258-M KBS-YMH": 2,
      "258- KMT-LKH": 2,
      "258-E YTTMC-MLH": 1,
      "258-E JHC-MLH": 1,
      "258-F ASK-SVP": 1,
      "258-K KBS-YHG": 1,
      "258-MA YTTMC-JKH": 2,
      "258-P YTTMC-KGN": 1,
      "258-S YTTMC-RDH": 1,
      "258-SA KBS-VKP": 1,
      "258-SB KBS-ISVH": 1,
      "258-SB YTTMC-ISVH": 1,
      "ACC B-56": 2,
      "258-SD YTTMC-BNH": 2,
      "258-SD KBS-BNH": 1,
      "258-T YTTMC-PRSH": 2,
      "258-V KBS-GRH": 2,
      "258-Y KBS-MBWD": 1,
      "258-Y KBS-MBWDC-MBWD": 1,
      "258-Y ASK-MBWD": 1,
      "258 ADK-NMG": 2,
      "258-MC YTTMC-KBH": 2,
      "256-MB DSP-MTG": 1,
      "258 DSP-NMG": 3,
      "258-M KMT-GVS": 0,
      "258-D KBS-TBS": 1,
      "258-M KMT-MCH": 0,
      "258-A": 18,
      "258-A KBS-MNH": 3,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "258 KHC-SWK-NML": 1,
      "258-C KBS-GDP": 2,
      "258-CB YTTMC-GDP": 1,
      "258-G KBS-HSHA": 2,
      "258- VSD-MLC-NMG": 1,
      "258-CB YBS-SDKP": 2,
      "258-CB PSB-NMG": 1,
      "258-GA KBS-BMSH": 2,
      "258-R DSP-HNS": 1,
      "258-VC DSP-YLG": 1,
      "258-VG DSP-BNV": 1,
      "258-VG YTTMC-PLN": 1,
      "258-YA DSP-HCP": 1,
      "G-8 DSP-ISM": 1,
      "258-H DSP-VDH": 1,
      "258-H": 8,
      "258-H YTTMC-VDH": 1,
      "258-VD": 3,
      "258-VD YTTMC-BDM": 1,
      "258-VA": 5,
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1,
      "258X MTNT-NMGRS": 2,
      "258-M": 25,
      "258-DN": 8,
      "258-G": 18,
      "258-GA": 10,
      "258-TA": 12,
      "258-R": 8,
      "256-MA": 9,
      "258-WA": 11,
      "VSD-NML": 6,
      "258-P": 11,
      "256-MA VNC-TRHH": 2,
      "258-X": 24,
      "258-SA": 11
    }
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
      "245-H",
      "242-TB",
      "245-GA",
      "KBS-MGDRD-D35G"
    ],
    "boothCodes": [
      "29150355",
      "29150365",
      "29150353",
      "29150364"
    ],
    "routesMap": {
      "D35G-JPT": 3,
      "D35G-MCH": 3,
      "TVK-VSD": 1,
      "D35G-KDB": 1,
      "D35G-BKH": 1,
      "D35G-KTH": 1,
      "D35G-KCH": 2,
      "D35G-VDHTC": 1,
      "238-H": 6,
      "242-B": 57,
      "242-B D31G-TVK": 4,
      "335-P D35G-KDG": 2,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-GA": 13,
      "PSS-KTNH": 4,
      "242-VA": 4,
      "242-FA": 8,
      "242-J": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-N": 12,
      "242-LA": 8,
      "242-L": 6,
      "G-7": 43,
      "242-M": 9,
      "242-RA": 8,
      "241-G": 6,
      "242-F": 9,
      "242-H": 8,
      "242-JK": 7,
      "242-MA": 6,
      "242-TA KBS-MTK": 2,
      "242-Q": 9,
      "242-TA": 4,
      "242-Y": 6,
      "242-X": 12,
      "KBS-MGDRD-D35G": 13,
      "D35G-MGDRD-KBS": 4,
      "JPT-D35G": 6,
      "242 D35G-SJT-KBS": 2,
      "265-A KBS-D35G": 2,
      "245-MA": 6,
      "CLO-AVH": 1,
      "245-K": 8,
      "VBN-TVK": 4,
      "242-Z": 17,
      "G-7 D31G-JTS": 1,
      "245-AA": 4,
      "SGH-KBS": 5,
      "KBS-SGH": 5,
      "242-R": 9,
      "336-B SNBS-KMP": 2,
      "245-C": 10,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "D35G-SBS": 3,
      "SBS-KBS-D35G": 3,
      "242-ZB": 8,
      "242-JA": 7,
      "242-U": 10,
      "240-J": 8,
      "D35G-TGP": 1,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "TPH-D35G": 1,
      "245-Q": 8,
      "D35G-BTH": 1,
      "GKH-D35G": 1,
      "D35G-STH": 1,
      "245-D": 9,
      "242-W": 6,
      "245-A": 9,
      "242-B KBS-BKPN": 2,
      "242-FB": 13,
      "242-ZD": 9,
      "242-ZD D31G-KLR": 1,
      "410-FC BSK-TVK": 3,
      "KTH-D35G": 1,
      "248-V KMT-D35G": 1,
      "242-TC": 12,
      "242-E": 2,
      "D-31G-KDG": 1,
      "248-HA": 9,
      "241-M": 6,
      "240-N": 8,
      "JTS-PSS": 4,
      "240-M": 8,
      "242-B BSN-TVK": 3,
      "410-FC TVK-DPN": 2,
      "245-H NML-D35G": 1,
      "CFLS-KMT": 2,
      "KMT-VDH-CFLS": 3,
      "242-ZC CFLS-KBS": 1,
      "248-J CKB-JPLK": 1,
      "242-W KMT-DBGL": 1,
      "240-MB": 6,
      "243-M": 7,
      "240-K": 7,
      "242-ZC": 6,
      "242-ZC KMT-BMH-KGH": 1,
      "240-MB KMT-MGD": 1,
      "242-V D31G-CKH": 1,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "KMT-SGHG": 1,
      "248-BA CLO-CKB": 1,
      "D35G-MGDT": 2,
      "240-K MRTG-BSKR": 1,
      "240-MB MRTG-MGD": 1,
      "D35G-KDBC": 1,
      "245-M MNKH-MRTG": 1,
      "KDBC-MNKH": 1,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "241-M MRTG-SVND": 1,
      "242-TC KMT-SNDKP": 1,
      "242-B MRTG-SGHG": 1,
      "242-E KBS-CNH": 1,
      "242-F MRTG-YLG": 1,
      "242-H MRTG-MDP": 1,
      "242-J MRTG-DMH": 1,
      "242-JA KMT-GNK": 2,
      "242-N MRTG-GDH": 1,
      "D35G-SMH": 1,
      "242-P": 8,
      "242-P SMH-HLH": 1,
      "242-Q MRTG-GNGH": 1,
      "242-R MRTG-JGH": 1,
      "242-U MRTG-LKP": 1,
      "242-Y MRTG-AMP": 1,
      "242-B CVB-D35G": 1,
      "243-M MRTG-SPH": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1,
      "D35G-BDH": 1,
      "D35G-SWTK-SBS": 1,
      "D35G-HRH-TGP": 1,
      "SGHG-SKT-JHC": 1,
      "D35G-KGR": 3,
      "D35G-YBS": 1,
      "410-T": 6,
      "D35G-BHL": 1
    }
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
      "285-MP",
      "507-C",
      "285-B",
      "284-B"
    ],
    "boothCodes": [
      "29150145",
      "29150146",
      "29150147",
      "29150177",
      "29150182",
      "29150186",
      "29150187",
      "29150189",
      "29150199"
    ],
    "routesMap": {
      "DVHGH-PTH": 4,
      "290-E SBS-PTH": 0,
      "NES-SDP": 1,
      "HALLCA-PTH": 1,
      "507-C": 29,
      "RJP- PTH": 1,
      "D06G-BMSIT": 2,
      "285-MP": 30,
      "GDH-PTH": 1,
      "285-MK": 16,
      "285-MF": 38,
      "285-M": 54,
      "285-L": 11,
      "285-J": 12,
      "285-MG": 23,
      "KDG-CSB-D34": 5,
      "285-MA": 38,
      "285-T": 12,
      "KBS-YST-PTH": 8,
      "284-B": 24,
      "285-K": 14,
      "285-H": 14,
      "285-B": 26,
      "285-P": 13,
      "285-AA": 16,
      "285-CC": 4,
      "KDG-PTH": 5,
      "285-CA": 9,
      "285-M HBL-SGH": 2,
      "KLP-PTH": 1,
      "285-C": 12,
      "285-N": 15,
      "285-D": 13,
      "SBS-NES-PTH": 2,
      "YNALL-DBP": 2,
      "YHKOT-MLPH": 3,
      "285-M HBL-DBP": 2,
      "BMH-PTH": 3,
      "KNR-PTH": 1,
      "285-RB": 10,
      "V-285M": 18,
      "SBS-PTH": 8,
      "CRISTAL-5": 3,
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "285-V": 18,
      "SBS-JKR-ALSG-PTH": 1,
      "KBS-MVL": 1,
      "KMT-MVL": 1,
      "BCS-BMSITY": 1,
      "YHKOT-BMSIT": 4,
      "285-TA": 11,
      "KBS-HBL-BMSIT": 1,
      "401 YTTMC-BMSIT": 1,
      "YNTAEH-BMSITY": 4,
      "285-CA NES-JKBH": 1,
      "285-K KMT-PMTL": 2,
      "285-CC NES-CTMK": 1,
      "285-K KBS-PTML": 7,
      "407-E YLKOT-LGNH": 1,
      "285-E NES-KKLV": 1,
      "285-C KBS-DTMKR": 2,
      "285-H KBS-KLH": 2,
      "285-JC NES-JTH": 1,
      "285-K NES-SDH": 1,
      "285-L NES-BYTH": 1,
      "285-MF NES-KDH": 1,
      "285-MG NES-BMGL": 1,
      "285-P NES-BTH": 1,
      "285-P KBS-BTH": 1,
      "285-X NES-DBR": 1,
      "406 YLKOT-NMG": 1,
      "285-M KBS-PTH": 7,
      "285-K NES-PTML": 7,
      "285-R": 16,
      "285-R NES-CHL": 2,
      "285-RA": 13,
      "285-RA NES-HNYR": 2,
      "285-W": 8,
      "285V YHK-SNH": 2,
      "284 SBS-MKC-PTH": 1,
      "BELF-NES-DBP": 1,
      "285M SBS-DBP": 0,
      "285M KBS-KRC-DBP": 1,
      "285-M KBS-GITAM": 2,
      "KRP-YHK-HBL-GITHM": 6,
      "500-A BSK-HBLB-PTH": 3,
      "285-M KBS-APEL": 1,
      "285-A": 12,
      "285-A KBS-NDH": 1,
      "285 YHKOT-BMSITY": 1,
      "HNH-PTH": 1,
      "KDH-PTH": 1,
      "285-MC": 43,
      "243-L": 12,
      "D13G-ISRO": 4,
      "PSS-NMS": 2,
      "YHK-NITT": 7
    }
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
      "285-MA",
      "285-MP",
      "285-MG",
      "V-285M"
    ],
    "boothCodes": [
      "29150023",
      "29150024",
      "29150025",
      "29150026",
      "29150027",
      "29150028",
      "29150029",
      "29150030"
    ],
    "routesMap": {
      "NES-SDP": 1,
      "251-B": 40,
      "D10G-RCH": 2,
      "285-MP": 30,
      "407-C": 6,
      "285-MK": 16,
      "285-MF": 38,
      "285-M": 54,
      "285-L": 11,
      "285-J": 12,
      "285-MG": 23,
      "KDG-CSB-D34": 5,
      "285-MA": 38,
      "285-T": 12,
      "285-K": 14,
      "285-P": 13,
      "285-AA": 16,
      "285-CC": 4,
      "285-CA": 9,
      "285-C": 12,
      "285-N": 15,
      "YNALL-DBP": 2,
      "285-G": 10,
      "285-M HBL-DBP": 2,
      "285-RB": 10,
      "V-285M": 18,
      "CRISTAL-5": 3,
      "407-B": 14,
      "285-JB THDL-KBS": 1,
      "285-JE": 17,
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "285-V": 18,
      "291-K": 7,
      "285-H PTML-KLH": 1,
      "BELGS-29": 4,
      "253-LA": 8,
      "285-TA": 11,
      "BMSITY-RJK": 2,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "285-CA NES-JKBH": 1,
      "285-CA PTML-JKBH": 1,
      "285-K KMT-PMTL": 2,
      "285-K PTML-NES": 2,
      "285-CC NES-CTMK": 1,
      "285-K KBS-PTML": 7,
      "285-MC PTML-DBP": 3,
      "285-E NES-KKLV": 1,
      "285-C PTML-DTMKR": 1,
      "285-C KBS-DTMKR": 2,
      "285-J PTML-JLG": 1,
      "285-JC NES-JTH": 1,
      "285-K NES-SDH": 1,
      "285-L NES-BYTH": 1,
      "285-MF NES-KDH": 1,
      "285-MG NES-BMGL": 1,
      "285-P NES-BTH": 1,
      "285-P KBS-BTH": 1,
      "285-R RJK-CHL": 1,
      "285-X NES-DBR": 1,
      "297-B PTML-DGH": 1,
      "406 YLKOT-NMG": 1,
      "289-K BMT46-KDYH": 1,
      "253-L PTML-HGV": 1,
      "253-LA PTML-HGV": 1,
      "285-CB PTML-KKH": 1,
      "285-RC PTML-HGV": 1,
      "283-D PTML-KDGC": 1,
      "285-K NES-PTML": 7,
      "285-R": 16,
      "285-R NES-CHL": 2,
      "285-R PTMT-CHL": 2,
      "285-RA": 13,
      "285-RA NES-HNYR": 2,
      "285-RA PTMT-HNYR": 1,
      "283E PTML-THS": 2,
      "285-JE PTML-DYVH": 1,
      "285-W PTML-DBR": 1,
      "285V YHK-SNH": 2,
      "BELF-NES-DBP": 1,
      "285M SBS-DBP": 0,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "285M KBS-KRC-DBP": 1,
      "401 PTMTL-YTTMC": 1,
      "285-Y": 8,
      "GITAM-1": 2,
      "285-M KBS-GITAM": 2,
      "KRP-YHK-HBL-GITHM": 6,
      "GITAM-YHK-HBL-KRP": 5,
      "285-M KBS-APEL": 1,
      "285-MC": 43,
      "PSS-NMS": 2
    }
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
      "248-J",
      "248-BA",
      "253-HE",
      "253-G"
    ],
    "boothCodes": [
      "29150269",
      "29150270",
      "29150249"
    ],
    "routesMap": {
      "253-A": 12,
      "502-K": 12,
      "248-BA": 28,
      "253-HE": 27,
      "PSS-TGV": 3,
      "248-BB": 31,
      "248-Z": 9,
      "253-P": 9,
      "PSS-KLD": 2,
      "253-V": 6,
      "PSS-RGH": 1,
      "251-B": 40,
      "251-M": 7,
      "253-G": 22,
      "290-QA": 18,
      "YTTMC-DBLK": 1,
      "251-G": 31,
      "PSS-SLP": 1,
      "PSS-KTH": 1,
      "253-J": 30,
      "253-J SNBS-HSG": 1,
      "KBS-SVG": 3,
      "PSS-TRN": 1,
      "253-C": 8,
      "PSS-SVG": 2,
      "248-Q": 2,
      "KBS-KTH": 4,
      "KTH-KBS": 3,
      "254-D": 10,
      "253-H": 11,
      "KBS-SDP": 1,
      "CSB-SDP": 3,
      "KBS-TNS": 2,
      "TNS-PSS": 5,
      "254-C": 11,
      "251-M KBS-KLPP": 1,
      "320-C": 14,
      "253-W": 8,
      "253-K": 18,
      "253-D": 13,
      "253-HC": 6,
      "254-A": 11,
      "327-B": 10,
      "253-G KMT-KNW": 4,
      "253-E": 15,
      "248-BA HGV-D31G": 1,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "266-D": 14,
      "253-Q KBS-KGVK": 1,
      "BTP-31": 2,
      "248-N MRTG-SOLD": 1,
      "KANGOVI-1": 3,
      "BELGS-17": 2,
      "253 KMT-HSG": 3,
      "253-E YTTMC-RGHL": 1,
      "KONGOVI-4": 4,
      "KONGOVI-5": 4,
      "KANGOVI-2": 3,
      "KANGOVI-3": 3,
      "NLM-F2": 7,
      "254B KBH-DSP": 1,
      "254-A  DSP-KGT": 2,
      "KANGOVI-7": 3,
      "KANGOVI-6": 3,
      "253-A BMT45-LKPC-BYT": 3,
      "248-BA CLO-HGV": 1,
      "253-HA": 14,
      "248-J": 30,
      "PSS-MLHP": 2,
      "253-F": 9,
      "KBS-DSNH": 2,
      "DSNH-KBS": 2,
      "254-B": 8,
      "PSS-CKM": 2,
      "313-T": 13,
      "BTP-20G": 2
    }
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
      "V-500DA",
      "MBS-2",
      "401-BC",
      "MF-23A"
    ],
    "boothCodes": [
      "29150138",
      "29150147",
      "29150172",
      "29150183",
      "29150184",
      "29150186",
      "29150187",
      "29150188",
      "29150195",
      "29150197",
      "29150198",
      "29150199",
      "29150200",
      "29150201"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "PTN-YHKOT": 7,
      "YSTF-ITPL": 2,
      "401-AB": 5,
      "336-B SNBS-KMP": 2,
      "43-E SNBS-SVN": 2,
      "PTH-MNH": 1,
      "PTH-BSF": 1,
      "289-F PTH-HSK": 3,
      "507-D": 9,
      "401-AE": 7,
      "JHC-YHK": 4,
      "380 KMT-KTO": 6,
      "V-500DA": 19,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "407-C": 6,
      "401-RB": 10,
      "PTH-KLP": 1,
      "401-K CLO-YHKOT": 4,
      "BC-8": 9,
      "PTH-KIAS": 1,
      "PTH-BDL": 1,
      "PTH-JKRA": 1,
      "280-F YSTF-HSK": 1,
      "PTH-SRP": 2,
      "PTH-SBSH": 4,
      "PTH-SBS1": 4,
      "PTH-KDG": 3,
      "SGH-YHK-HBL-CSB": 1,
      "402-M": 7,
      "PTH-CSB": 3,
      "PTH-MRHB": 2,
      "PTH- BPS": 3,
      "YSTF-SBS": 6,
      "500-Y": 13,
      "YSTF-JBS": 1,
      "YSTF-CSB": 11,
      "PTH-KNR": 1,
      "PTH-DSHL": 2,
      "401-JB": 8,
      "PTH-BSK": 3,
      "285-JB THDL-KBS": 1,
      "356-J": 7,
      "PTH-CKH": 1,
      "YTTMC-MSP-CHRS": 1,
      "PTH-DSKN": 2,
      "401-D": 3,
      "401-BR": 34,
      "401-Y": 9,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "401-BC": 14,
      "401-J": 5,
      "401 NLO-YHK": 10,
      "401-F": 32,
      "PTH-KNDC": 1,
      "401-JC YTTMC-BKH": 3,
      "YTTMC-YLK-BMES": 1,
      "ADT-IAF": 1,
      "PTH-NDRD": 1,
      "ADT-BMH": 1,
      "ADT-NMG": 1,
      "ALS-SBDFD": 1,
      "PTH-SDNIBK": 1,
      "YSTF-BEMLF": 1,
      "PTH-VNSHBL": 1,
      "BMSIT-PTH-YHK": 1,
      "BMT45-YST-DSH": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "MADT-BCP": 1,
      "285-K PTML-NES": 2,
      "297-B PTML-DGH": 1,
      "401-A NMG-YHKOT": 0,
      "401-B DPJN-YHKOT": 2,
      "401 BMT45-YHKOT": 1,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "289-L YSTF-MVJ": 1,
      "290-E PTH-RKH": 0,
      "289-LA YSTF-HSK": 1,
      "285 PTH-YHKOT": 3,
      "285-M PTH-HBLP": 1,
      "PTH-DVHGH": 2,
      "297-G PTH-DCH": 1,
      "401-A JHC-YHK": 2,
      "286-H PTH-GKVKLT": 1,
      "283E PTML-THS": 2,
      "500-DY": 4,
      "MF-23A": 14,
      "356J YSTF-AGS-ATB": 1,
      "297F PTH-BVP": 1,
      "289 PTH-BKHL": 1,
      "298M PTH-DVHOB": 2,
      "MBS-2": 17,
      "284 PTH-KVRYHK": 1,
      "290E PTH-AJB": 0,
      "289CA PTH-HNH": 2,
      "280K PTH-MTH": 1,
      "401BJ PTH-YHK-BLR": 3,
      "298 PTH-DVH": 2,
      "298Y PTH-YHS": 1,
      "282-A PTH-HSH": 1,
      "287-K PTH-DSHL": 1,
      "287G PTH-CBL": 1,
      "298ME PTH-DVHGH": 1,
      "288C PTH-KDG": 1,
      "298 PTH-IAF": 1,
      "501C KGR-HBLB-PTH": 2,
      "298PD PTH-NLR": 1,
      "PTH-SVN": 1,
      "500D PTH-MRH SPG": 3,
      "MBS2 PTH-MRHSPG": 1,
      "285MA PTML-CVB": 2,
      "401-BJ BMSITY-BGLR": 1,
      "401 BMT45-JSNL": 1,
      "V-500DA YSTF-ELCW": 1,
      "GITAM-YHK-HBL-KRP": 5,
      "500-DA": 7,
      "PTH-MYH": 12,
      "CRPF-KBS": 3,
      "PTH-CHK": 1,
      "PTH-KVRYHK": 1,
      "PTH-HNS": 1,
      "55-B": 67,
      "PTH-NGH": 1,
      "PTH-IAF": 1,
      "BSK-DPJN": 5,
      "PTH-MGH": 2,
      "PTH-SBS": 3,
      "MEBP-21B": 0,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3
    }
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
      "248-J",
      "248-BA",
      "253-HE",
      "253-G"
    ],
    "boothCodes": [
      "29150062",
      "29150075",
      "29150076",
      "29150056",
      "29150057",
      "29150061"
    ],
    "routesMap": {
      "253-A": 12,
      "502-K": 12,
      "248-BA": 28,
      "253-HE": 27,
      "PSS-TGV": 3,
      "248-BB": 31,
      "248-Z": 9,
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "253-P": 9,
      "PSS-KLD": 2,
      "253-V": 6,
      "PSS-RGH": 1,
      "251-B": 40,
      "251-M": 7,
      "253-G": 22,
      "251-G": 31,
      "253-J": 30,
      "253-J SNBS-HSG": 1,
      "KMT-NGM": 3,
      "PSS-TRN": 1,
      "253-C": 8,
      "407-C": 6,
      "248-Q": 2,
      "253-H": 11,
      "KBS-TNS": 2,
      "TNS-PSS": 5,
      "407-B": 14,
      "251-M KBS-KLPP": 1,
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "291-G": 20,
      "320-C": 14,
      "253-K": 18,
      "253-D": 13,
      "253-HC": 6,
      "327-B": 10,
      "KMT-HGV": 7,
      "253-G KMT-KNW": 4,
      "253-E": 15,
      "248-BA HGV-D31G": 1,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "266-D": 14,
      "253-Q KBS-KGVK": 1,
      "266 BEL-HIDF": 1,
      "253-LA": 8,
      "253 KMT-HSG": 3,
      "253-E YTTMC-RGHL": 1,
      "253-LA PTML-HGV": 1,
      "285-RC PTML-HGV": 1,
      "NLM-F2": 7,
      "253-A BMT45-LKPC-BYT": 3,
      "248-BA CLO-HGV": 1,
      "253-HA": 14,
      "248-J": 30,
      "PSS-MLHP": 2,
      "253-F": 9,
      "KBS-DSNH": 2,
      "DSNH-KBS": 2,
      "PSS-CKM": 2,
      "313-T": 13
    }
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
      "248-D",
      "276-E",
      "MBS-6",
      "288-E"
    ],
    "boothCodes": [
      "29150238",
      "29150239",
      "29150240"
    ],
    "routesMap": {
      "276 YNRS-VRP": 3,
      "BEL-VRP": 2,
      "YTTMC-OASIS": 1,
      "VRP-SMA": 2,
      "VRP-BEL": 2,
      "503-A": 10,
      "500-DE": 18,
      "248-D": 24,
      "VRP-YTTMC": 9,
      "YTTMC-VRP": 9,
      "400-V": 7,
      "AIT-KHDS-SBS": 2,
      "D31G-VRP": 2,
      "276-A": 35,
      "MBS-6": 23,
      "V-500DE": 26,
      "502-V": 11,
      "V-276": 12,
      "502-V D31G-VRP": 1,
      "401-K CLO-YHKOT": 4,
      "NICE-7": 3,
      "276-N": 8,
      "MBS-9": 16,
      "VNH-VRP": 1,
      "276-E": 24,
      "276-G": 7,
      "269-B": 17,
      "CS-VRP- SNBS": 1,
      "SNBS-VRP": 2,
      "401-BC": 14,
      "401 NLO-YHK": 10,
      "BELF-VRP": 2,
      "MF-23": 74,
      "VRP-HBLB-BTP": 1,
      "323-H": 11,
      "YHKOT-VRP": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "401-K BMT45-KGR": 2,
      "401-B RPCLO-VRP": 1,
      "500-DE VRP-KLNB": 3,
      "V-VRP-CPR": 1,
      "401-K": 61,
      "CS-VRP-BMTC": 3,
      "V-CSB-VRP": 1,
      "V-VRP-CSB": 1,
      "503-A VRP-KRPGH": 5,
      "VDS-VRP": 0,
      "288-E": 22
    }
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
      "248-J",
      "248-BA",
      "253-HE",
      "253-G"
    ],
    "boothCodes": [
      "29150062",
      "29150097",
      "29150096"
    ],
    "routesMap": {
      "253-A": 12,
      "502-K": 12,
      "248-BA": 28,
      "253-HE": 27,
      "PSS-TGV": 3,
      "248-BB": 31,
      "248-Z": 9,
      "407-F": 8,
      "253-P": 9,
      "PSS-KLD": 2,
      "253-V": 6,
      "PSS-RGH": 1,
      "251-B": 40,
      "251-M": 7,
      "253-G": 22,
      "251-G": 31,
      "253-J": 30,
      "253-J SNBS-HSG": 1,
      "PSS-TRN": 1,
      "253-C": 8,
      "248-Q": 2,
      "253-H": 11,
      "KBS-TNS": 2,
      "TNS-PSS": 5,
      "251-M KBS-KLPP": 1,
      "320-C": 14,
      "253-W": 8,
      "253-K": 18,
      "253-D": 13,
      "253-HC": 6,
      "327-B": 10,
      "253-G KMT-KNW": 4,
      "253-E": 15,
      "248-BA HGV-D31G": 1,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "266-D": 14,
      "253-Q KBS-KGVK": 1,
      "253 KMT-HSG": 3,
      "253-E YTTMC-RGHL": 1,
      "NLM-F2": 7,
      "253-A BMT45-LKPC-BYT": 3,
      "248-BA CLO-HGV": 1,
      "253-HA": 14,
      "248-J": 30,
      "PSS-MLHP": 2,
      "253-F": 9,
      "KBS-DSNH": 2,
      "DSNH-KBS": 2,
      "PSS-CKM": 2,
      "313-T": 13,
      "BTP-20G": 2
    }
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
      "V-500DA",
      "MBS-2",
      "401-BC",
      "MF-23A"
    ],
    "boothCodes": [
      "29150145",
      "29150147",
      "29150177",
      "29150182",
      "29150183",
      "29150186",
      "29150187",
      "29150188",
      "29150189",
      "29150199"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "YSTF-ITPL": 2,
      "401-AB": 5,
      "507-D": 9,
      "401-AE": 7,
      "JHC-YHK": 4,
      "380 KMT-KTO": 6,
      "V-500DA": 19,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "407-C": 6,
      "401-RB": 10,
      "401-K CLO-YHKOT": 4,
      "BC-8": 9,
      "280-F YSTF-HSK": 1,
      "402-M": 7,
      "YSTF-SBS": 6,
      "500-Y": 13,
      "YSTF-JBS": 1,
      "YSTF-CSB": 11,
      "401-JB": 8,
      "356-J": 7,
      "YTTMC-MSP-CHRS": 1,
      "401-D": 3,
      "401-BR": 34,
      "401-Y": 9,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "401-BC": 14,
      "401-J": 5,
      "401 NLO-YHK": 10,
      "401-F": 32,
      "401-JC YTTMC-BKH": 3,
      "YTTMC-YLK-BMES": 1,
      "ADT-BMH": 1,
      "ALS-SBDFD": 1,
      "YSTF-BEMLF": 1,
      "BMT45-YST-DSH": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "MADT-BCP": 1,
      "401-A NMG-YHKOT": 0,
      "401-B DPJN-YHKOT": 2,
      "401 BMT45-YHKOT": 1,
      "289-L YSTF-MVJ": 1,
      "289-LA YSTF-HSK": 1,
      "401-A JHC-YHK": 2,
      "500-DY": 4,
      "MF-23A": 14,
      "356J YSTF-AGS-ATB": 1,
      "MBS-2": 17,
      "401 BMT45-JSNL": 1,
      "V-500DA YSTF-ELCW": 1,
      "500-DA": 7,
      "55-B": 67,
      "MEBP-21B": 0,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3
    }
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
      "V-500DA",
      "MBS-2",
      "401-BC",
      "MF-23A"
    ],
    "boothCodes": [
      "29150218",
      "29150222",
      "29150179",
      "29150219",
      "29150220",
      "29150225",
      "29150226",
      "29150205",
      "29150210",
      "29150213",
      "29150215",
      "29150216",
      "29150217",
      "29150176",
      "29150177",
      "29150178",
      "29150180",
      "29150182",
      "29150185",
      "29150188",
      "29150189",
      "29150214"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "YSTF-ITPL": 2,
      "401-AB": 5,
      "507-D": 9,
      "401-AE": 7,
      "JHC-YHK": 4,
      "380 KMT-KTO": 6,
      "V-500DA": 19,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "407-C": 6,
      "401-RB": 10,
      "401-K CLO-YHKOT": 4,
      "BC-8": 9,
      "280-F YSTF-HSK": 1,
      "402-M": 7,
      "YSTF-SBS": 6,
      "500-Y": 13,
      "YSTF-JBS": 1,
      "YSTF-CSB": 11,
      "401-JB": 8,
      "356-J": 7,
      "YTTMC-MSP-CHRS": 1,
      "401-D": 3,
      "401-BR": 34,
      "401-Y": 9,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "401-BC": 14,
      "401-J": 5,
      "401 NLO-YHK": 10,
      "401-F": 32,
      "401-JC YTTMC-BKH": 3,
      "YTTMC-YLK-BMES": 1,
      "ADT-BMH": 1,
      "MADT-ALS": 1,
      "YSTF-BEMLF": 1,
      "BMT45-YST-DSH": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "401-A NMG-YHKOT": 0,
      "401-B DPJN-YHKOT": 2,
      "401 BMT45-YHKOT": 1,
      "289-L YSTF-MVJ": 1,
      "289-LA YSTF-HSK": 1,
      "401-A JHC-YHK": 2,
      "500-DY": 4,
      "MF-23A": 14,
      "356J YSTF-AGS-ATB": 1,
      "MBS-2": 17,
      "401 BMT45-JSNL": 1,
      "V-500DA YSTF-ELCW": 1,
      "500-DA": 7,
      "55-B": 67,
      "MEBP-21B": 0,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3
    }
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
      "V-500DE",
      "248-D",
      "MBS-6",
      "401-BA"
    ],
    "boothCodes": [
      "29150239",
      "29150240"
    ],
    "routesMap": {
      "VRP-SMA": 2,
      "VRP-BEL": 2,
      "503-A": 10,
      "PTH-VRP-KBS": 4,
      "500-DE": 18,
      "401-R": 46,
      "401-KA": 3,
      "248-D": 24,
      "VRP-YTTMC": 9,
      "400-V": 7,
      "401-RA": 8,
      "MBS-6": 23,
      "V-500DE": 26,
      "PTH-VRP-TDL": 2,
      "401-RB YHK-MTR": 1,
      "NICE-7": 3,
      "276-N": 8,
      "MBS-9": 16,
      "276-G": 7,
      "401-BA": 20,
      "401-B": 42,
      "VRP-HBLB-BTP": 1,
      "401-B YNTAEH-YTTMC": 3,
      "276 BMT45-VRP-KBS": 4,
      "276 BMT45-VRP-KMT": 4,
      "276-E BMT45-VRP-SBS": 3,
      "401-K BMT45-KGR": 2,
      "500-DE VRP-KLNB": 3,
      "IAF-HMPN": 2,
      "D45 To YNRS": 1,
      "D45-BSK": 6,
      "V-VRP-CPR": 1,
      "401-B PTH-VRP-TDL": 0,
      "401RC VRP-BEML5TH": 1,
      "401-K": 61,
      "MB-9 BMT45-ISROL": 1,
      "276-B BMT-45-VPP": 2,
      "MBS-6 BMT45-CVRN": 1,
      "V-VRP-BSK": 1,
      "V-VRP-CSB": 1,
      "503-A VRP-KRPGH": 5,
      "401-E": 32,
      "378 KGR-ELCW": 2
    }
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
      "V-500DE",
      "248-D",
      "MBS-6",
      "401-BA"
    ],
    "boothCodes": [
      "29150240"
    ],
    "routesMap": {
      "VRP-SMA": 2,
      "VRP-BEL": 2,
      "503-A": 10,
      "PTH-VRP-KBS": 4,
      "500-DE": 18,
      "401-R": 46,
      "401-KA": 3,
      "248-D": 24,
      "VRP-YTTMC": 9,
      "400-V": 7,
      "401-RA": 8,
      "MBS-6": 23,
      "V-500DE": 26,
      "PTH-VRP-TDL": 2,
      "401-RB YHK-MTR": 1,
      "NICE-7": 3,
      "276-N": 8,
      "MBS-9": 16,
      "276-G": 7,
      "401-BA": 20,
      "401-B": 42,
      "VRP-HBLB-BTP": 1,
      "401-B YNTAEH-YTTMC": 3,
      "276 BMT45-VRP-KBS": 4,
      "276 BMT45-VRP-KMT": 4,
      "276-E BMT45-VRP-SBS": 3,
      "401-K BMT45-KGR": 2,
      "500-DE VRP-KLNB": 3,
      "IAF-HMPN": 2,
      "D45 To YNRS": 1,
      "D45-BSK": 6,
      "V-VRP-CPR": 1,
      "401-B PTH-VRP-TDL": 0,
      "401RC VRP-BEML5TH": 1,
      "401-K": 61,
      "MB-9 BMT45-ISROL": 1,
      "276-B BMT-45-VPP": 2,
      "MBS-6 BMT45-CVRN": 1,
      "V-VRP-BSK": 1,
      "V-VRP-CSB": 1,
      "503-A VRP-KRPGH": 5,
      "401-E": 32,
      "378 KGR-ELCW": 2
    }
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
      "404-E",
      "V-500DA",
      "AS-7",
      "G-9A"
    ],
    "boothCodes": [
      "29150101",
      "29150104",
      "29150140",
      "29150144",
      "29150148",
      "29150149",
      "29150150",
      "29150151",
      "29150152",
      "29150153",
      "29150154",
      "29150155",
      "29150156",
      "29150157",
      "29150159",
      "29150166",
      "29150160",
      "29150161"
    ],
    "routesMap": {
      "290-EA": 0,
      "YSTF-ITPL": 2,
      "507-D": 9,
      "296-K": 4,
      "380 KMT-KTO": 6,
      "V-500DA": 19,
      "280-F YSTF-HSK": 1,
      "AS-7": 16,
      "402-B": 57,
      "402-D": 53,
      "404-E": 20,
      "G-9A": 14,
      "G-9": 35,
      "402-M": 7,
      "GPO-CVB-YSTF": 1,
      "YSTF-SBS": 6,
      "500-Y": 13,
      "YSTF-JBS": 1,
      "YSTF-CSB": 11,
      "VSD-YST5": 1,
      "D10G-YSTF": 1,
      "YSTF-YTTMC": 4,
      "356-J": 7,
      "V-500DA BSK-YHK5": 12,
      "BMT30-YSTF": 1,
      "YSTF-MADT": 5,
      "SDNIBK-YSTF": 1,
      "YSTF-BEMLF": 1,
      "KBS-YSTF-PTH": 8,
      "BMT11-YSTF": 4,
      "289-L YSTF-MVJ": 1,
      "289-LA YSTF-HSK": 1,
      "500-DY": 4,
      "401 YSTF-YTTMC": 2,
      "356J YSTF-AGS-ATB": 1,
      "V-500DA YSTF-ELCW": 1,
      "500-DA": 7,
      "PTH-YST": 4,
      "55-B": 67,
      "PTH-YSTF": 6,
      "243-L KMT-LDH": 2
    }
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
      "242-X",
      "293-P",
      "293-D",
      "293-F"
    ],
    "boothCodes": [
      "29150361",
      "29150365"
    ],
    "routesMap": {
      "242-TB": 15,
      "242-LA": 8,
      "242-L": 6,
      "242-F": 9,
      "242-H": 8,
      "242-JK": 7,
      "242-MA": 6,
      "242-TA KBS-MTK": 2,
      "242-Q": 9,
      "242-TA": 4,
      "242-Y": 6,
      "242-X": 12,
      "242-JA": 7,
      "293-P": 12,
      "G-11": 35,
      "401-M NLO-CLO": 1,
      "242-B KBS-BKPN": 2,
      "293-H": 19,
      "290-RA": 5,
      "KLN-VDC": 1,
      "293-K": 13,
      "293-F": 11,
      "SBS-HNS": 3,
      "293-J": 11,
      "242-ZD": 9,
      "242-ZD D31G-KLR": 1,
      "G-11 SNBS-BLR": 1,
      "410-FC BSK-TVK": 3,
      "KLN-BGL": 3,
      "D10G-BGL-BDG": 2,
      "242-X D35G-DDR": 1,
      "248-HA": 9,
      "241-M": 6,
      "240-N": 8,
      "D10G-BGLR-DVH": 4,
      "240-M": 8,
      "289-LA": 11,
      "242-TB D35G-KVH": 1,
      "293-D": 12,
      "296-M": 6,
      "CFLS-KMT": 2,
      "KMT-VDH-CFLS": 3,
      "242-ZC CFLS-KBS": 1,
      "293-E": 10,
      "289-LA YSTF-HSK": 1,
      "240-MB": 6,
      "243-M": 7,
      "240-K": 7,
      "242-ZC": 6,
      "242-ZC KMT-BMH-KGH": 1,
      "240-MB KMT-MGD": 1,
      "242-V D31G-CKH": 1,
      "248-BA CLO-CKB": 1,
      "240-K MRTG-BSKR": 1,
      "240-MB MRTG-MGD": 1,
      "241-M MRTG-SVND": 1,
      "SGHG-TVK": 1,
      "242-E KBS-CNH": 1,
      "242-F MRTG-YLG": 1,
      "242-H MRTG-MDP": 1,
      "242-JA KMT-GNK": 2,
      "242-P": 8,
      "242-P SMH-HLH": 1,
      "242-Q MRTG-GNGH": 1,
      "242-Y MRTG-AMP": 1,
      "243-M MRTG-SPH": 1,
      "293S BMT48-BGLR": 2,
      "293D BMT48-SGH": 1,
      "293F BMT48-HNS": 1,
      "293J BMT48-MRS": 2,
      "D48-DNH": 1,
      "293 D48-RZP": 2,
      "D35G-TVK-NML": 1,
      "410-T": 6,
      "293G-BMT-48-BDG": 1,
      "CHAKRA-10A": 6,
      "CHAKRA-10 BMT10-HNRJ": 1,
      "293-S KBS-HNS": 2,
      "HALM-SBS-BMES": 1,
      "SVM-SBS-BMES": 1
    }
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
      "285-MP",
      "285-MG",
      "V-285M",
      "285-JE"
    ],
    "boothCodes": [
      "29150005",
      "29150013",
      "29150003"
    ],
    "routesMap": {
      "285-MP": 30,
      "285-MK": 16,
      "285-MF": 38,
      "285-M": 54,
      "285-J": 12,
      "285-MG": 23,
      "285-MA": 38,
      "285-P": 13,
      "285-CC": 4,
      "285-CA": 9,
      "285-C": 12,
      "YNALL-DBP": 2,
      "285-M HBL-DBP": 2,
      "V-285M": 18,
      "285-JB THDL-KBS": 1,
      "297-M": 2,
      "285-JE": 17,
      "253-LA": 8,
      "285-CA NES-JKBH": 1,
      "285-CA PTML-JKBH": 1,
      "285-CC NES-CTMK": 1,
      "285-MC PTML-DBP": 3,
      "285-C PTML-DTMKR": 1,
      "285-C KBS-DTMKR": 2,
      "285-J PTML-JLG": 1,
      "285-JC NES-JTH": 1,
      "285-MF NES-KDH": 1,
      "285-MG NES-BMGL": 1,
      "285-P NES-BTH": 1,
      "285-P KBS-BTH": 1,
      "285-CB PTML-KKH": 1,
      "285-JE PTML-DYVH": 1,
      "BELF-NES-DBP": 1,
      "285M SBS-DBP": 0,
      "285M KBS-KRC-DBP": 1,
      "285-M KBS-GITAM": 2,
      "KRP-YHK-HBL-GITHM": 6,
      "GITAM-YHK-HBL-KRP": 5,
      "285-M KBS-APEL": 1,
      "285-MC": 43,
      "PSS-NMS": 2
    }
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
      "285-MP",
      "285-MG",
      "V-285M",
      "285-JE"
    ],
    "boothCodes": [
      "29150006",
      "29150012",
      "29150013",
      "29150014",
      "29150015"
    ],
    "routesMap": {
      "NES-SDP": 1,
      "285-MP": 30,
      "285-MK": 16,
      "285-MF": 38,
      "285-M": 54,
      "285-J": 12,
      "285-MG": 23,
      "285-MA": 38,
      "285-P": 13,
      "285-CC": 4,
      "285-CA": 9,
      "285-C": 12,
      "YNALL-DBP": 2,
      "285-M HBL-DBP": 2,
      "V-285M": 18,
      "285-JB THDL-KBS": 1,
      "285-JE": 17,
      "253-LA": 8,
      "285-CA NES-JKBH": 1,
      "285-CA PTML-JKBH": 1,
      "285-CC NES-CTMK": 1,
      "285-MC PTML-DBP": 3,
      "285-C PTML-DTMKR": 1,
      "285-C KBS-DTMKR": 2,
      "285-J PTML-JLG": 1,
      "285-JC NES-JTH": 1,
      "285-MF NES-KDH": 1,
      "285-MG NES-BMGL": 1,
      "285-P NES-BTH": 1,
      "285-P KBS-BTH": 1,
      "285-CB PTML-KKH": 1,
      "285-JE PTML-DYVH": 1,
      "BELF-NES-DBP": 1,
      "285M SBS-DBP": 0,
      "285M KBS-KRC-DBP": 1,
      "285-M KBS-GITAM": 2,
      "KRP-YHK-HBL-GITHM": 6,
      "GITAM-YHK-HBL-KRP": 5,
      "285-M KBS-APEL": 1,
      "285-MC": 43,
      "PSS-NMS": 2
    }
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
      "401-E",
      "V-500DE",
      "276-AB",
      "401-BA"
    ],
    "boothCodes": [
      "29150239",
      "29150240"
    ],
    "routesMap": {
      "TND-MSP": 1,
      "503-A": 10,
      "PTH-VRP-KBS": 4,
      "401-R": 46,
      "401-KA": 3,
      "400-V": 7,
      "401-RA": 8,
      "V-500DE": 26,
      "PTH-VRP-TDL": 2,
      "401-RB YHK-MTR": 1,
      "401-RB": 10,
      "BC-8": 9,
      "401-BR": 34,
      "401-MK": 32,
      "401-RH": 6,
      "401-BA": 20,
      "401-B": 42,
      "CAPGR-11": 2,
      "ITPL-2J": 2,
      "MEBP-26": 4,
      "CRHS-6": 2,
      "276-AB": 22,
      "401-B YTTMC-DBH": 2,
      "BMSIT-1": 3,
      "401-B YNTAEH-YTTMC": 3,
      "276 BMT45-VRP-KBS": 4,
      "276 BMT45-VRP-KMT": 4,
      "276-E BMT45-VRP-SBS": 3,
      "BMT45-VRPB": 2,
      "VCS-ORRCA-206 JWSR-ORRCA": 1,
      "VCS-ORRCA-109 VRP-ORRCA": 2,
      "401-B DPJN-YHKOT": 2,
      "IAF-HMPN": 2,
      "D45 To YNRS": 1,
      "D45-BSK": 6,
      "VCS-MEBP-76 MNH-MEBP": 1,
      "401-B PTH-VRP-TDL": 0,
      "401RC VRP-BEML5TH": 1,
      "MB-9 BMT45-ISROL": 1,
      "VCS-TATA ELEXI-07 DBSA-TELX": 0,
      "276-B BMT-45-VPP": 2,
      "MBS-6 BMT45-CVRN": 1,
      "VCS-BTP-104 BTP-VRP": 1,
      "V-VRP-BSK": 1,
      "V-VRP-CSB": 1,
      "401-K YTTMC-VRP-BMT45": 1,
      "401-E": 32,
      "378 KGR-ELCW": 2
    }
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
      "280-K",
      "300-F",
      "MBS-2",
      "280-F"
    ],
    "boothCodes": [
      "29150113",
      "29150114",
      "29150116",
      "29150117",
      "29150120"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "290-EA": 0,
      "290-E SBS-PTH": 0,
      "290-EB YHK-KGR": 0,
      "290-EB KGR-YHK": 0,
      "507-D": 9,
      "290-EB": 0,
      "296-K": 4,
      "507-DY": 35,
      "CHAKRA-10": 12,
      "280-F YSTF-HSK": 1,
      "280-A": 26,
      "300-F": 17,
      "280-E": 12,
      "280-K": 21,
      "PTH-KNR": 1,
      "YHK-KNR": 1,
      "KNR-PTH": 1,
      "D10G-TNS-YHKOT": 3,
      "291-L": 3,
      "289-LA": 11,
      "PTH-CKH": 1,
      "YTTMC-MSP-CHRS": 1,
      "291-K": 7,
      "280-L": 9,
      "290 KBS-YLKOT": 2,
      "290-EY": 0,
      "290-EN": 0,
      "290-EN KLNB-YHKOT": 0,
      "SVG-1": 0,
      "YTTMC-YLK-BMES": 1,
      "YLKOT-BMES": 1,
      "CRHS-6": 2,
      "BELGS-29": 4,
      "290-E STJHS-YLKOT": 0,
      "290-E PTH-RKH": 0,
      "289-LA YSTF-HSK": 1,
      "MBS-2": 17,
      "290E PTH-AJB": 0,
      "280K PTH-MTH": 1,
      "290E YHKOT-RKH": 0,
      "290EY KMT-YHKOT": 0,
      "MBS2 PTH-MRHSPG": 1,
      "290-E ITCF-YHKOT": 0,
      "284-K KMT-AGS-JSNL": 1,
      "401 BMT45-JSNL": 1,
      "CHAKRA-10A": 6,
      "CHAKRA-10 BMT10-HNRJ": 1,
      "280-F": 17,
      "290-E": 52,
      "55-B": 67,
      "243-L KMT-LDH": 2,
      "PTH-SBS": 3
    }
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
      "280-K",
      "300-F",
      "MBS-2",
      "280-F"
    ],
    "boothCodes": [
      "29150111",
      "29150113",
      "29150114",
      "29150116",
      "29150117",
      "29150119",
      "29150120",
      "29150191",
      "29150112"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "290-EB YHK-KGR": 0,
      "507-D": 9,
      "507-DY": 35,
      "CHAKRA-10": 12,
      "280-F YSTF-HSK": 1,
      "280-A": 26,
      "300-F": 17,
      "280-K": 21,
      "PTH-KNR": 1,
      "YHK-KNR": 1,
      "289-LA": 11,
      "PTH-CKH": 1,
      "YTTMC-MSP-CHRS": 1,
      "280-L": 9,
      "290-EN": 0,
      "YTTMC-YLK-BMES": 1,
      "YLKOT-BMES": 1,
      "290-E PTH-RKH": 0,
      "289-LA YSTF-HSK": 1,
      "MBS-2": 17,
      "290E PTH-AJB": 0,
      "280K PTH-MTH": 1,
      "290E YHKOT-RKH": 0,
      "MBS2 PTH-MRHSPG": 1,
      "284-K KMT-AGS-JSNL": 1,
      "401 BMT45-JSNL": 1,
      "CHAKRA-10A": 6,
      "CHAKRA-10 BMT10-HNRJ": 1,
      "280-F": 17,
      "290-E": 52,
      "55-B": 67,
      "PTH-SBS": 3
    }
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
      "280-K",
      "300-F",
      "MBS-2",
      "280-F"
    ],
    "boothCodes": [
      "29150375",
      "29150376"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "290-EB YHK-KGR": 0,
      "507-D": 9,
      "507-DY": 35,
      "CHAKRA-10": 12,
      "280-F YSTF-HSK": 1,
      "280-A": 26,
      "300-F": 17,
      "280-K": 21,
      "PTH-KNR": 1,
      "YHK-KNR": 1,
      "289-LA": 11,
      "PTH-CKH": 1,
      "YTTMC-MSP-CHRS": 1,
      "280-L": 9,
      "290-EN": 0,
      "YTTMC-YLK-BMES": 1,
      "YLKOT-BMES": 1,
      "290-F": 0,
      "290-E PTH-RKH": 0,
      "289-LA YSTF-HSK": 1,
      "MBS-2": 17,
      "290E PTH-AJB": 0,
      "280K PTH-MTH": 1,
      "290E YHKOT-RKH": 0,
      "MBS2 PTH-MRHSPG": 1,
      "CHAKRA-10A": 6,
      "CHAKRA-10 BMT10-HNRJ": 1,
      "280-F": 17,
      "290-E": 52,
      "55-B": 67,
      "PTH-SBS": 3
    }
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
      "280-K",
      "300-F",
      "MBS-2",
      "280-F"
    ],
    "boothCodes": [
      "29150375",
      "29150376"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "290-EB YHK-KGR": 0,
      "507-D": 9,
      "507-DY": 35,
      "CHAKRA-10": 12,
      "280-F YSTF-HSK": 1,
      "280-A": 26,
      "300-F": 17,
      "280-K": 21,
      "PTH-KNR": 1,
      "YHK-KNR": 1,
      "289-LA": 11,
      "PTH-CKH": 1,
      "YTTMC-MSP-CHRS": 1,
      "280-L": 9,
      "290-EN": 0,
      "YTTMC-YLK-BMES": 1,
      "YLKOT-BMES": 1,
      "290-E PTH-RKH": 0,
      "289-LA YSTF-HSK": 1,
      "MBS-2": 17,
      "290E PTH-AJB": 0,
      "280K PTH-MTH": 1,
      "290E YHKOT-RKH": 0,
      "MBS2 PTH-MRHSPG": 1,
      "CHAKRA-10A": 6,
      "CHAKRA-10 BMT10-HNRJ": 1,
      "280-F": 17,
      "290-E": 52,
      "55-B": 67,
      "PTH-SBS": 3
    }
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
      "285-MG",
      "V-285M",
      "285-MK",
      "285-CA"
    ],
    "boothCodes": [
      "29150002",
      "29150003"
    ],
    "routesMap": {
      "285-MK": 16,
      "285-MF": 38,
      "285-M": 54,
      "285-MG": 23,
      "285-MA": 38,
      "285-CC": 4,
      "285-CA": 9,
      "YNALL-DBP": 2,
      "285-M HBL-DBP": 2,
      "V-285M": 18,
      "297-M": 2,
      "253-LA": 8,
      "285-CA NES-JKBH": 1,
      "285-CA PTML-JKBH": 1,
      "285-CC NES-CTMK": 1,
      "285-MC PTML-DBP": 3,
      "285-MF NES-KDH": 1,
      "285-MG NES-BMGL": 1,
      "BELF-NES-DBP": 1,
      "285M SBS-DBP": 0,
      "285M KBS-KRC-DBP": 1,
      "285-M KBS-GITAM": 2,
      "KRP-YHK-HBL-GITHM": 6,
      "GITAM-YHK-HBL-KRP": 5,
      "285-M KBS-APEL": 1,
      "285-MC": 43,
      "PSS-NMS": 2
    }
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
      "242-T",
      "242-F",
      "242-Q",
      "242-R"
    ],
    "boothCodes": [
      "29150361",
      "29150365"
    ],
    "routesMap": {
      "242-FA": 8,
      "242-J": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-LA": 8,
      "242-L": 6,
      "242-F": 9,
      "242-H": 8,
      "242-JK": 7,
      "242-MA": 6,
      "242-TA KBS-MTK": 2,
      "242-Q": 9,
      "242-TA": 4,
      "242-Y": 6,
      "242-X": 12,
      "242-R": 9,
      "242-JA": 7,
      "242-U": 10,
      "240-J": 8,
      "242-B KBS-BKPN": 2,
      "242-ZD": 9,
      "242-ZD D31G-KLR": 1,
      "410-FC BSK-TVK": 3,
      "242-X D35G-DDR": 1,
      "248-HA": 9,
      "241-M": 6,
      "240-N": 8,
      "240-M": 8,
      "242-TB D35G-KVH": 1,
      "CFLS-KMT": 2,
      "KMT-VDH-CFLS": 3,
      "242-ZC CFLS-KBS": 1,
      "240-MB": 6,
      "243-M": 7,
      "240-K": 7,
      "242-ZC": 6,
      "242-ZC KMT-BMH-KGH": 1,
      "240-MB KMT-MGD": 1,
      "242-V D31G-CKH": 1,
      "248-BA CLO-CKB": 1,
      "240-K MRTG-BSKR": 1,
      "240-MB MRTG-MGD": 1,
      "241-M MRTG-SVND": 1,
      "SGHG-TVK": 1,
      "242-E KBS-CNH": 1,
      "242-F MRTG-YLG": 1,
      "242-H MRTG-MDP": 1,
      "242-J MRTG-DMH": 1,
      "242-JA KMT-GNK": 2,
      "242-P": 8,
      "242-P SMH-HLH": 1,
      "242-Q MRTG-GNGH": 1,
      "242-R MRTG-JGH": 1,
      "242-U MRTG-LKP": 1,
      "242-Y MRTG-AMP": 1,
      "243-M MRTG-SPH": 1,
      "D35G-TVK-NML": 1,
      "410-T": 6
    }
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
      "295-G",
      "289-E",
      "224-DA",
      "289-L"
    ],
    "boothCodes": [
      "29150108",
      "29150118"
    ],
    "routesMap": {
      "401-AB": 5,
      "289-CA": 28,
      "289-F PTH-HSK": 3,
      "289-F": 28,
      "289-H": 9,
      "289-L": 13,
      "289-A YHKOT-BKH": 6,
      "289-C": 8,
      "295-G": 17,
      "289-K": 4,
      "289-B": 8,
      "289-E": 14,
      "289-M": 8,
      "289-P": 26,
      "401-JC YTTMC-BKH": 3,
      "289-K BMT46-KDYH": 1,
      "289-L YSTF-MVJ": 1,
      "289-L YHKOT-CKHL": 1,
      "289 PTH-BKHL": 1,
      "289CA PTH-HNH": 2,
      "401BJ PTH-YHK-BLR": 3,
      "289 YHKOT-ARS": 2,
      "401-BJ BMSITY-BGLR": 1,
      "224-DA": 14,
      "PTH-CHK": 1,
      "YHK-CKH": 4,
      "289-A": 53,
      "64 DPN-SBS": 1
    }
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
      "MF-23A",
      "401-RB",
      "401 NLO-YHK",
      "BC-8"
    ],
    "boothCodes": [
      "29150228",
      "29150232",
      "29150238",
      "29150239",
      "29150240",
      "29150227",
      "29150229",
      "29150230",
      "29150231"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "JEAFS-KCBC": 1,
      "401-AB": 5,
      "401-AE": 7,
      "JHC-YHK": 4,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "407-C": 6,
      "401-RB": 10,
      "401-K CLO-YHKOT": 4,
      "BC-8": 9,
      "401-JB": 8,
      "297-M": 2,
      "YTTMC-MSP-CHRS": 1,
      "401-D": 3,
      "401-BR": 34,
      "401-Y": 9,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "401-BC": 14,
      "401-J": 5,
      "401 NLO-YHK": 10,
      "401-F": 32,
      "401-JC YTTMC-BKH": 3,
      "YTTMC-YLK-BMES": 1,
      "401 YTTMC-BMSIT": 1,
      "BMT45-YST-DSH": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "401-A NMG-YHKOT": 0,
      "401-B DPJN-YHKOT": 2,
      "401 BMT45-YHKOT": 1,
      "401-A JHC-YHK": 2,
      "MF-23A": 14,
      "401 BMT45-JSNL": 1,
      "MEBP-21B": 0,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3
    }
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
      "MF-23A",
      "401-RB",
      "401 NLO-YHK",
      "BC-8"
    ],
    "boothCodes": [
      "29150239",
      "29150171",
      "29150231",
      "29150163",
      "29150164",
      "29150165",
      "29150167",
      "29150168",
      "29150169",
      "29150170"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "401-AB": 5,
      "401-AE": 7,
      "JHC-YHK": 4,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "407-C": 6,
      "401-RB": 10,
      "401-K CLO-YHKOT": 4,
      "BC-8": 9,
      "401-JB": 8,
      "297-M": 2,
      "YTTMC-MSP-CHRS": 1,
      "401-D": 3,
      "401-BR": 34,
      "401-Y": 9,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "401-BC": 14,
      "401-J": 5,
      "401 NLO-YHK": 10,
      "401-F": 32,
      "401-JC YTTMC-BKH": 3,
      "YTTMC-YLK-BMES": 1,
      "401 YTTMC-BMSIT": 1,
      "BMT45-YST-DSH": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "401-A NMG-YHKOT": 0,
      "401-B DPJN-YHKOT": 2,
      "401 BMT45-YHKOT": 1,
      "401-A JHC-YHK": 2,
      "MF-23A": 14,
      "401 BMT45-JSNL": 1,
      "MEBP-21B": 0,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3
    }
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
      "MF-23A",
      "401-RB",
      "401 NLO-YHK",
      "BC-8"
    ],
    "boothCodes": [
      "29150171",
      "29150222",
      "29150148",
      "29150149",
      "29150150",
      "29150162",
      "29150163",
      "29150164",
      "29150165",
      "29150166",
      "29150167",
      "29150168",
      "29150169",
      "29150170"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "401-AB": 5,
      "401-AE": 7,
      "JHC-YHK": 4,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "407-C": 6,
      "401-RB": 10,
      "401-K CLO-YHKOT": 4,
      "BC-8": 9,
      "401-JB": 8,
      "297-M": 2,
      "YTTMC-MSP-CHRS": 1,
      "401-D": 3,
      "401-BR": 34,
      "401-Y": 9,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "401-BC": 14,
      "401-J": 5,
      "401 NLO-YHK": 10,
      "401-F": 32,
      "401-JC YTTMC-BKH": 3,
      "YTTMC-YLK-BMES": 1,
      "401 YTTMC-BMSIT": 1,
      "BMT45-YST-DSH": 1,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "401-A NMG-YHKOT": 0,
      "401-B DPJN-YHKOT": 2,
      "401 BMT45-YHKOT": 1,
      "401-A JHC-YHK": 2,
      "MF-23A": 14,
      "401 BMT45-JSNL": 1,
      "MEBP-21B": 0,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3
    }
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
      "502-V",
      "401-Y",
      "401-JB",
      "401-MS"
    ],
    "boothCodes": [
      "29150237",
      "29150234",
      "29150241",
      "29150242"
    ],
    "routesMap": {
      "JEAFS-KCBC": 1,
      "401-AB": 5,
      "RTNPS-ANJM": 2,
      "401-AE": 7,
      "JHC-YHK": 4,
      "D31G-VRP": 2,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "KBS-ANMSP": 1,
      "502-V": 11,
      "407-C": 6,
      "502-V D31G-VRP": 1,
      "401-JB": 8,
      "297-M": 2,
      "271-E": 12,
      "YTTMC-MSP-CHRS": 1,
      "401-D": 3,
      "401-Y": 9,
      "401-MS": 8,
      "401-J": 5,
      "401-F": 32,
      "401-JC YTTMC-BKH": 3,
      "YTTMC-YLK-BMES": 1,
      "MF-23": 74,
      "401 YTTMC-BMSIT": 1,
      "271 KBS-BMT45": 8,
      "271-E KMT-VRS": 5,
      "401-A NMG-YHKOT": 0,
      "266 KMT-BMT45": 6,
      "276 KBS-GMC-BMT45": 6,
      "401-A JHC-YHK": 2,
      "501-BH BSK-BMT45": 1,
      "MF-23A": 14,
      "MEBP-21B": 0,
      "401-A PSB-YKHOT": 7,
      "YTTMC-PTC": 3
    }
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
      "407-B",
      "401-MS",
      "NITT-2",
      "401-AE"
    ],
    "boothCodes": [
      "29150222",
      "29150144",
      "29150145",
      "29150146",
      "29150148",
      "29150149",
      "29150151",
      "29150153",
      "29150158",
      "29150179",
      "29150181",
      "29150220",
      "29150221",
      "29150223",
      "29150224",
      "29150225",
      "29150178",
      "29150180",
      "29150182"
    ],
    "routesMap": {
      "PHS-34": 15,
      "401-AB": 5,
      "401-KA": 3,
      "401-AE": 7,
      "JHC-YHK": 4,
      "401-N": 7,
      "401-N DPJN-YHK": 1,
      "407-C": 6,
      "401-BJ": 18,
      "401-K CLO-YHKOT": 4,
      "407-B": 14,
      "297-M": 2,
      "YTTMC-MSP-CHRS": 1,
      "401-MK": 32,
      "401-MS": 8,
      "401-RH": 6,
      "60-L VTTMC-EASTEND": 2,
      "401-F": 32,
      "BEMLA-7": 2,
      "401-JC YTTMC-BKH": 3,
      "MEBP-26": 4,
      "YTTMC-YLK-BMES": 1,
      "CRHS-6": 2,
      "BELGS-29": 4,
      "YHK-YTTMC-PSB": 5,
      "ITPL -8F": 1,
      "BMSIT-5": 3,
      "BMSIT-3": 1,
      "BTP-26B": 5,
      "BTP-26": 3,
      "NITT-2": 8,
      "NITT-1A": 4,
      "ITPL-8A": 3,
      "BMT45-YST-DSH": 1,
      "VCS-ORRCA-206 JWSR-ORRCA": 1,
      "VCS-ORRCA-106 SNH-ORRCA Salarpuria Soft Zone": 1,
      "401 BMT45-YHKOT": 1,
      "401-A JHC-YHK": 2,
      "VCS-MEBP-76 MNH-MEBP": 1,
      "401 YSTF-YTTMC": 2,
      "VCS-ITPB-GM-17 YLK-5-ITPL": 1,
      "401 YHKOT-MSP": 2,
      "401 PTMTL-YTTMC": 1,
      "401 YHKPS-YTTMC": 1,
      "VCS-TATA ELEXI-07 DBSA-TELX": 0,
      "401 BMT45-JSNL": 1,
      "GITAM-1": 2,
      "BWTC-201": 2,
      "MEBP-21B": 0,
      "378 KGR-ELCW": 2
    }
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
      "245-J",
      "245-E",
      "245-C",
      "245-D"
    ],
    "boothCodes": [
      "29150363",
      "29150365",
      "29150353",
      "29150364"
    ],
    "routesMap": {
      "D35G-JPT": 3,
      "D35G-KDB": 1,
      "D35G-KTH": 1,
      "D35G-VDHTC": 1,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-GA": 13,
      "G-7": 43,
      "245-MA": 6,
      "CLO-AVH": 1,
      "245-K": 8,
      "G-7 D31G-JTS": 1,
      "245-AA": 4,
      "336-B SNBS-KMP": 2,
      "245-C": 10,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "KBS-MNKH": 2,
      "245-Q": 8,
      "D35G-BTH": 1,
      "245-D": 9,
      "245-A": 9,
      "D-31G-KDG": 1,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "KDBC-MNKH": 1,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1
    }
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
      "266-K",
      "266-G",
      "266-J",
      "266-B"
    ],
    "boothCodes": [
      "29150086",
      "29150087",
      "29150088"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "290-QA": 18,
      "YTTMC-DBLK": 1,
      "YTTMC-MTK": 2,
      "KMT-NGM": 3,
      "407-C": 6,
      "407-B": 14,
      "266-C": 14,
      "266-E": 9,
      "266-G": 12,
      "266-J": 12,
      "266-M": 11,
      "272-B": 5,
      "291-G": 20,
      "266-A": 10,
      "266-B": 12,
      "266-K": 13,
      "KMT-HGV": 7,
      "266 BEL-HIDF": 1,
      "BMT45-MTK 266A": 1,
      "266M BMT45-KDSH": 1,
      "266-C BMT45-KKL": 2,
      "266-J BMT45-MTK": 1,
      "266-J YTTMC-MTK": 1
    }
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
      "245-D",
      "245-A",
      "245-F",
      "245-Q"
    ],
    "boothCodes": [
      "29150363",
      "29150358",
      "29150364",
      "29150366",
      "29150367"
    ],
    "routesMap": {
      "D35G-JPT": 3,
      "D35G-KTH": 1,
      "D35G-VDHTC": 1,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "G-7": 43,
      "JPT-D35G": 6,
      "245-MA": 6,
      "G-7 D31G-JTS": 1,
      "245-AA": 4,
      "336-B SNBS-KMP": 2,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "245-Q": 8,
      "D35G-BTH": 1,
      "245-D": 9,
      "245-A": 9,
      "JTS-PSS": 4,
      "VPS-13": 2,
      "VPS-16": 2,
      "VPS-19": 3,
      "ITPL-JPTS": 2,
      "BTP-35": 3,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "245-M MNKH-MRTG": 1,
      "KDBC-MNKH": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1
    }
  },
  {
    "name": "Sondekoppa",
    "lat": 13.01881582,
    "lng": 77.38418515,
    "dailyTrips": 177,
    "routesCount": 26,
    "topRoutes": [
      "374-M",
      "374-MA",
      "374-N",
      "242-TB",
      "242-TC",
      "221-L",
      "242-T",
      "377-B"
    ],
    "boothCodes": [
      "29150340",
      "29150337",
      "29150338",
      "29150339"
    ],
    "routesMap": {
      "D35G-BVRH": 1,
      "374-MA": 18,
      "221-L": 9,
      "374-N": 17,
      "242-T": 9,
      "242-TB": 15,
      "242-LA": 8,
      "242-L": 6,
      "242-TA KBS-MTK": 2,
      "242-TA": 4,
      "D35G-MTK": 1,
      "377-A": 4,
      "377-B": 9,
      "245-A": 9,
      "D04-SGH": 9,
      "242-TC": 12,
      "248-HA": 9,
      "242-TB D35G-KVH": 1,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "374-M NMG-TVK": 1,
      "258-CB YBS-SDKP": 2,
      "374-M": 26,
      "242-TC KMT-SNDKP": 1,
      "D35G-SKP": 1,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Sidedahalli",
    "lat": 13.06249401,
    "lng": 77.49514502,
    "dailyTrips": 174,
    "routesCount": 15,
    "topRoutes": [
      "MF-27",
      "250-B",
      "250-DA",
      "248-P",
      "250-SA",
      "250-V",
      "250-J",
      "250-E"
    ],
    "boothCodes": [
      "29150295",
      "29150306",
      "29150296"
    ],
    "routesMap": {
      "248-P": 16,
      "248-L": 3,
      "250-SA": 12,
      "250-V": 12,
      "PSS-TMH": 3,
      "250-DA": 23,
      "250-AD": 9,
      "SDH-CKB": 1,
      "248 KMT-JHC-KDG": 1,
      "250-E": 11,
      "250-J": 12,
      "MF-27": 40,
      "MTR-38": 2,
      "250SA KDG-ASK": 1,
      "250-B": 28
    }
  },
  {
    "name": "Yelahanka 4th Phase Govt School",
    "lat": 13.10328923,
    "lng": 77.57684938,
    "dailyTrips": 170,
    "routesCount": 15,
    "topRoutes": [
      "402-B",
      "G-9",
      "404-E",
      "AS-7",
      "G-9A",
      "KBS-YSTF-PTH",
      "500-A BSK-YSTF",
      "PTH-YSTF"
    ],
    "boothCodes": [
      "29150140",
      "29150144",
      "29150145",
      "29150146",
      "29150148",
      "29150149",
      "29150150",
      "29150151",
      "29150152",
      "29150153",
      "29150154",
      "29150155",
      "29150156",
      "29150157",
      "29150158",
      "29150159",
      "29150181",
      "29150221",
      "29150223",
      "29150182"
    ],
    "routesMap": {
      "290-EA": 0,
      "500-A BSK-YSTF": 7,
      "AS-7": 16,
      "402-B": 57,
      "404-E": 20,
      "G-9A": 14,
      "G-9": 35,
      "GPO-CVB-YSTF": 1,
      "VSD-YST5": 1,
      "D10G-YSTF": 1,
      "KBS-ADTS": 1,
      "SDNIBK-YSTF": 1,
      "KBS-YSTF-PTH": 8,
      "PTH-YSTF": 6,
      "243-L KMT-LDH": 2
    }
  },
  {
    "name": "GKVK Gate Yelahanka",
    "lat": 13.07270203,
    "lng": 77.59290979,
    "dailyTrips": 170,
    "routesCount": 49,
    "topRoutes": [
      "V-500DA",
      "500-Y",
      "280-E",
      "YSTF-CSB",
      "V-500DR",
      "402-M",
      "356-J",
      "500-DA"
    ],
    "boothCodes": [
      "29150212"
    ],
    "routesMap": {
      "YSTF-ITPL": 2,
      "380 KMT-KTO": 6,
      "V-500DA": 19,
      "176 GKVK-HPN": 1,
      "PTH-SRP": 2,
      "PTH-SBSH": 4,
      "PTH-KDG": 3,
      "SGH-YHK-HBL-CSB": 1,
      "402-M": 7,
      "PTH-CSB": 3,
      "PTH-MRHB": 2,
      "PTH- BPS": 3,
      "YSTF-SBS": 6,
      "GKVK-KGR": 2,
      "GKVK-ANP": 2,
      "BYH-KBS": 5,
      "280-E": 12,
      "500-Y": 13,
      "YSTF-JBS": 1,
      "YSTF-CSB": 11,
      "PTH-DSHL": 2,
      "PTH-BSK": 3,
      "285-JB THDL-KBS": 1,
      "356-J": 7,
      "GKVK-SMH": 1,
      "V-500DR": 9,
      "PTH-NDRD": 1,
      "ALS-SBDFD": 1,
      "PTH-SDNIBK": 1,
      "YSTF-BEMLF": 1,
      "PTH-VNSHBL": 1,
      "BMT45-YST-DSH": 1,
      "285-M PTH-HBLP": 1,
      "V-YHK-KRPH": 1,
      "286-H PTH-GKVKLT": 1,
      "500-DY": 4,
      "356J YSTF-AGS-ATB": 1,
      "287-K PTH-DSHL": 1,
      "287G PTH-CBL": 1,
      "288C PTH-KDG": 1,
      "501C KGR-HBLB-PTH": 2,
      "PTH-SVN": 1,
      "500D PTH-MRH SPG": 3,
      "285MA PTML-CVB": 2,
      "V-500DA YSTF-ELCW": 1,
      "GITAM-YHK-HBL-KRP": 5,
      "500AA-YHK-CSB": 1,
      "500-DA": 7,
      "CRPF-KBS": 3
    }
  },
  {
    "name": "Byregowdanahalli",
    "lat": 13.06438794,
    "lng": 77.39372157,
    "dailyTrips": 164,
    "routesCount": 21,
    "topRoutes": [
      "374-M",
      "374-MA",
      "374-N",
      "258-U",
      "242-TC",
      "258-QA",
      "221-L",
      "377-B"
    ],
    "boothCodes": [
      "29150316",
      "29150315"
    ],
    "routesMap": {
      "374-MA": 18,
      "221-L": 9,
      "374-N": 17,
      "377-A": 4,
      "377-B": 9,
      "245-A": 9,
      "D04-SGH": 9,
      "242-TC": 12,
      "248-HA": 9,
      "258-Q": 8,
      "258-QA": 11,
      "258-U": 13,
      "258- KMT-LKH": 2,
      "374-M NMG-LKH": 1,
      "258-U NMG-GRNB": 1,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "374-M NMG-TVK": 1,
      "258-CB YBS-SDKP": 2,
      "374-M": 26,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Hullegowdanahalli Cross",
    "lat": 13.05943537,
    "lng": 77.39379264,
    "dailyTrips": 164,
    "routesCount": 21,
    "topRoutes": [
      "374-M",
      "374-MA",
      "374-N",
      "258-U",
      "242-TC",
      "258-QA",
      "221-L",
      "377-B"
    ],
    "boothCodes": [
      "29150316",
      "29150315"
    ],
    "routesMap": {
      "374-MA": 18,
      "221-L": 9,
      "374-N": 17,
      "377-A": 4,
      "377-B": 9,
      "245-A": 9,
      "D04-SGH": 9,
      "242-TC": 12,
      "248-HA": 9,
      "258-Q": 8,
      "258-QA": 11,
      "258-U": 13,
      "258- KMT-LKH": 2,
      "374-M NMG-LKH": 1,
      "258-U NMG-GRNB": 1,
      "258 JHC-TVK": 1,
      "258 YTTMC-TVK": 1,
      "374-M NMG-TVK": 1,
      "258-CB YBS-SDKP": 2,
      "374-M": 26,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Dasenahalli Hesaraghatta",
    "lat": 13.14088028,
    "lng": 77.46511073,
    "dailyTrips": 164,
    "routesCount": 25,
    "topRoutes": [
      "253-G",
      "253-K",
      "253-E",
      "253-HA",
      "313-T",
      "253-H",
      "248-Z",
      "253-P"
    ],
    "boothCodes": [
      "29150069",
      "29150063",
      "29150066",
      "29150067"
    ],
    "routesMap": {
      "PSS-TGV": 3,
      "248-Z": 9,
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "253-P": 9,
      "PSS-KLD": 2,
      "253-V": 6,
      "PSS-RGH": 1,
      "253-G": 22,
      "253-H": 11,
      "253-K": 18,
      "253-HC": 6,
      "253-G KMT-KNW": 4,
      "253-E": 15,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "253-Q KBS-KGVK": 1,
      "253-E YTTMC-RGHL": 1,
      "HSG-NMG 407": 1,
      "253-HA": 14,
      "PSS-MLHP": 2,
      "253-F": 9,
      "KBS-DSNH": 2,
      "PSS-CKM": 2,
      "313-T": 13
    }
  },
  {
    "name": "Vivekananda Vidyavardhaka Hesaraghatta",
    "lat": 13.13945831,
    "lng": 77.46981561,
    "dailyTrips": 164,
    "routesCount": 25,
    "topRoutes": [
      "253-G",
      "253-K",
      "253-E",
      "253-HA",
      "313-T",
      "253-H",
      "248-Z",
      "253-P"
    ],
    "boothCodes": [
      "29150063",
      "29150066",
      "29150065"
    ],
    "routesMap": {
      "PSS-TGV": 3,
      "248-Z": 9,
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "253-P": 9,
      "PSS-KLD": 2,
      "253-V": 6,
      "PSS-RGH": 1,
      "253-G": 22,
      "253-H": 11,
      "253-K": 18,
      "253-HC": 6,
      "253-G KMT-KNW": 4,
      "253-E": 15,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "253-Q KBS-KGVK": 1,
      "253-E YTTMC-RGHL": 1,
      "HSG-NMG 407": 1,
      "253-HA": 14,
      "PSS-MLHP": 2,
      "253-F": 9,
      "KBS-DSNH": 2,
      "PSS-CKM": 2,
      "313-T": 13
    }
  },
  {
    "name": "Ivarukandapura",
    "lat": 13.1376459,
    "lng": 77.4944856,
    "dailyTrips": 164,
    "routesCount": 17,
    "topRoutes": [
      "251-B",
      "251-G",
      "291-G",
      "407-B",
      "327-B",
      "285-RC",
      "253-LA",
      "251-M"
    ],
    "boothCodes": [
      "29150056",
      "29150057"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "251-B": 40,
      "251-M": 7,
      "251-G": 31,
      "KMT-NGM": 3,
      "407-C": 6,
      "407-B": 14,
      "251-M KBS-KLPP": 1,
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "291-G": 20,
      "327-B": 10,
      "KMT-HGV": 7,
      "266 BEL-HIDF": 1,
      "253-LA": 8,
      "253-LA PTML-HGV": 1,
      "285-RC PTML-HGV": 1
    }
  },
  {
    "name": "Guddadahalli Hesaraghatta Road",
    "lat": 13.14131968,
    "lng": 77.46222307,
    "dailyTrips": 162,
    "routesCount": 24,
    "topRoutes": [
      "253-G",
      "253-K",
      "253-E",
      "253-HA",
      "313-T",
      "253-H",
      "248-Z",
      "253-P"
    ],
    "boothCodes": [
      "29150069",
      "29150063",
      "29150067"
    ],
    "routesMap": {
      "PSS-TGV": 3,
      "248-Z": 9,
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "253-P": 9,
      "PSS-KLD": 2,
      "253-V": 6,
      "PSS-RGH": 1,
      "253-G": 22,
      "253-H": 11,
      "253-K": 18,
      "253-HC": 6,
      "253-G KMT-KNW": 4,
      "253-E": 15,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "253-Q KBS-KGVK": 1,
      "253-E YTTMC-RGHL": 1,
      "HSG-NMG 407": 1,
      "253-HA": 14,
      "PSS-MLHP": 2,
      "253-F": 9,
      "PSS-CKM": 2,
      "313-T": 13
    }
  },
  {
    "name": "Choudappa Layout Byalakere",
    "lat": 13.10972414,
    "lng": 77.5280421,
    "dailyTrips": 161,
    "routesCount": 22,
    "topRoutes": [
      "291-G",
      "407-B",
      "266-C",
      "266-K",
      "266-G",
      "266-J",
      "266-B",
      "266-M"
    ],
    "boothCodes": [
      "29150086",
      "29150087",
      "29150088",
      "29150246"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "YTTMC-MTK": 2,
      "KMT-NGM": 3,
      "407-B": 14,
      "266-C": 14,
      "266-E": 9,
      "266-G": 12,
      "266-J": 12,
      "266-M": 11,
      "272-B": 5,
      "291-G": 20,
      "266-A": 10,
      "266-B": 12,
      "266-K": 13,
      "KMT-HGV": 7,
      "266 BEL-HIDF": 1,
      "BMT45-MTK 266A": 1,
      "266M BMT45-KDSH": 1,
      "266-C BMT45-KKL": 2,
      "266-J BMT45-MTK": 1,
      "266-J YTTMC-MTK": 1
    }
  },
  {
    "name": "Bengaluru International Exhibition Centre",
    "lat": 13.05667796,
    "lng": 77.47472317,
    "dailyTrips": 157,
    "routesCount": 27,
    "topRoutes": [
      "MF-27",
      "502-FA",
      "255-L",
      "255-N",
      "500-DG",
      "256-M",
      "500-AC",
      "V-335EN"
    ],
    "boothCodes": [
      "29150322",
      "29150324",
      "29150325",
      "29150290",
      "29150292",
      "29150321",
      "29150323",
      "29150326",
      "29150298",
      "29150302",
      "29150303"
    ],
    "routesMap": {
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "502-FA": 24,
      "500-DG": 10,
      "ASK-GGP-KRP": 3,
      "MNH-HBL": 2,
      "500-AC": 9,
      "255-L": 12,
      "255-N": 11,
      "MF-27": 40,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "500-DG NML-JKLOA": 2,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "254-A  DSP-KGT": 2,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "502-FA NMG-SMH": 1,
      "242-RA": 8,
      "NML-KGR": 3
    }
  },
  {
    "name": "Anchepalya Tumkur Road",
    "lat": 13.05526591,
    "lng": 77.4798162,
    "dailyTrips": 157,
    "routesCount": 27,
    "topRoutes": [
      "MF-27",
      "502-FA",
      "255-L",
      "255-N",
      "500-DG",
      "256-M",
      "500-AC",
      "V-335EN"
    ],
    "boothCodes": [
      "29150271",
      "29150274",
      "29150321",
      "29150323",
      "29150326",
      "29150301",
      "29150302",
      "29150303",
      "29150304",
      "29150305"
    ],
    "routesMap": {
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "502-FA": 24,
      "500-DG": 10,
      "ASK-GGP-KRP": 3,
      "MNH-HBL": 2,
      "500-AC": 9,
      "255-L": 12,
      "255-N": 11,
      "MF-27": 40,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "500-DG NML-JKLOA": 2,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "254-A  DSP-KGT": 2,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "502-FA NMG-SMH": 1,
      "242-RA": 8,
      "NML-KGR": 3
    }
  },
  {
    "name": "Morison Factory",
    "lat": 13.05067977,
    "lng": 77.49239188,
    "dailyTrips": 157,
    "routesCount": 27,
    "topRoutes": [
      "MF-27",
      "502-FA",
      "255-L",
      "255-N",
      "500-DG",
      "256-M",
      "500-AC",
      "V-335EN"
    ],
    "boothCodes": [
      "29150273",
      "29150276",
      "29150277",
      "29150278"
    ],
    "routesMap": {
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "502-FA": 24,
      "500-DG": 10,
      "ASK-GGP-KRP": 3,
      "MNH-HBL": 2,
      "500-AC": 9,
      "255-L": 12,
      "255-N": 11,
      "MF-27": 40,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "500-DG NML-JKLOA": 2,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "254-A  DSP-KGT": 2,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "502-FA NMG-SMH": 1,
      "242-RA": 8,
      "NML-KGR": 3
    }
  },
  {
    "name": "TCI Madanayakanahalli",
    "lat": 13.05922617,
    "lng": 77.46540934,
    "dailyTrips": 155,
    "routesCount": 27,
    "topRoutes": [
      "MF-27",
      "502-FA",
      "255-L",
      "255-N",
      "500-DG",
      "256-M",
      "500-AC",
      "V-335EN"
    ],
    "boothCodes": [
      "29150293",
      "29150308",
      "29150324",
      "29150287",
      "29150288",
      "29150289",
      "29150290",
      "29150292",
      "29150294",
      "29150307"
    ],
    "routesMap": {
      "256-M": 9,
      "258-X VNC-MTNT": 1,
      "502-FA": 24,
      "500-DG": 10,
      "ASK-GGP-KRP": 3,
      "MNH-HBL": 2,
      "500-AC": 9,
      "255-L": 12,
      "255-N": 11,
      "MF-27": 40,
      "401-A NMG-YHKOT": 0,
      "500-DG NMG-HBLB": 1,
      "502-C NMG-KRPGH": 0,
      "502-C ASK-KRPGH": 1,
      "500-DG NML-JKLOA": 2,
      "500-DG NMG-KRPRS": 2,
      "500-DG DSP-KRPRS": 2,
      "502-C DSP-GGP-KRP": 1,
      "502-L DSP-KTP": 1,
      "254-A  DSP-KGT": 2,
      "257B DSP-MKPL": 1,
      "ASK-NGS": 2,
      "ASK-DBKL": 1,
      "410-K NMG-BSK": 1,
      "V-335EN": 8,
      "502-FA NMG-SMH": 1,
      "242-RA": 8
    }
  },
  {
    "name": "Indian Institute of Horticultural Research TB",
    "lat": 13.13539189,
    "lng": 77.49096371,
    "dailyTrips": 155,
    "routesCount": 15,
    "topRoutes": [
      "251-B",
      "251-G",
      "291-G",
      "407-B",
      "327-B",
      "285-RC",
      "251-M",
      "KMT-HGV"
    ],
    "boothCodes": [
      "29150056",
      "29150057",
      "29150060",
      "29150061"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "251-B": 40,
      "251-M": 7,
      "251-G": 31,
      "KMT-NGM": 3,
      "407-C": 6,
      "407-B": 14,
      "251-M KBS-KLPP": 1,
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "291-G": 20,
      "327-B": 10,
      "KMT-HGV": 7,
      "266 BEL-HIDF": 1,
      "285-RC PTML-HGV": 1
    }
  },
  {
    "name": "Thotagere Basavanna Devastana",
    "lat": 13.13817434,
    "lng": 77.45364278,
    "dailyTrips": 153,
    "routesCount": 23,
    "topRoutes": [
      "253-G",
      "253-K",
      "253-E",
      "253-HA",
      "313-T",
      "253-H",
      "248-Z",
      "253-F"
    ],
    "boothCodes": [
      "29150071",
      "29150073",
      "29150069",
      "29150067"
    ],
    "routesMap": {
      "PSS-TGV": 3,
      "248-Z": 9,
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "PSS-KLD": 2,
      "253-V": 6,
      "PSS-RGH": 1,
      "253-G": 22,
      "253-H": 11,
      "253-K": 18,
      "253-HC": 6,
      "253-G KMT-KNW": 4,
      "253-E": 15,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "253-Q KBS-KGVK": 1,
      "253-E YTTMC-RGHL": 1,
      "HSG-NMG 407": 1,
      "253-HA": 14,
      "PSS-MLHP": 2,
      "253-F": 9,
      "PSS-CKM": 2,
      "313-T": 13
    }
  },
  {
    "name": "Jally Machine MS Palya",
    "lat": 13.08588998,
    "lng": 77.55564058,
    "dailyTrips": 152,
    "routesCount": 15,
    "topRoutes": [
      "401-BR",
      "401-MK",
      "276-AB",
      "401-BC",
      "401-RB",
      "401 NLO-YHK",
      "BC-8",
      "401-RH"
    ],
    "boothCodes": [
      "29150228",
      "29150232",
      "29150233",
      "29150234",
      "29150238",
      "29150239",
      "29150240",
      "29150241"
    ],
    "routesMap": {
      "YTTMC-OASIS": 1,
      "401-RB": 10,
      "401-K CLO-YHKOT": 4,
      "BC-8": 9,
      "401-BR": 34,
      "401-MK": 32,
      "401-RH": 6,
      "401-BC": 14,
      "401 NLO-YHK": 10,
      "276-AB": 22,
      "401-B YTTMC-DBH": 2,
      "VRP-YHKOT": 1,
      "401-K VJN-YHKOT": 2,
      "YTTMC-YHKOT": 3,
      "401-B DPJN-YHKOT": 2
    }
  },
  {
    "name": "Mattahalli Cross",
    "lat": 13.11053468,
    "lng": 77.44410516,
    "dailyTrips": 148,
    "routesCount": 25,
    "topRoutes": [
      "255-E",
      "255-C",
      "255-D",
      "255-L",
      "255-A",
      "255-N",
      "255-J",
      "248-Y"
    ],
    "boothCodes": [
      "29150256",
      "29150094",
      "29150255",
      "29150091"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "255-D": 15,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255-L": 12,
      "255-N": 11,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255-J  DSP-HNS": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "255H DSP-GDP": 1
    }
  },
  {
    "name": "Thotada Guddadahalli Bagalagunte",
    "lat": 13.06831298,
    "lng": 77.48935036,
    "dailyTrips": 144,
    "routesCount": 10,
    "topRoutes": [
      "MF-27",
      "250-B",
      "248-P",
      "250-SA",
      "250-V",
      "250-J",
      "250-E",
      "250-AD"
    ],
    "boothCodes": [
      "29150295",
      "29150297",
      "29150298",
      "29150296"
    ],
    "routesMap": {
      "248-P": 16,
      "250-SA": 12,
      "250-V": 12,
      "PSS-TMH": 3,
      "250-AD": 9,
      "248 KMT-JHC-KDG": 1,
      "250-E": 11,
      "250-J": 12,
      "MF-27": 40,
      "250-B": 28
    }
  },
  {
    "name": "Shrusti School Yelahanka",
    "lat": 13.10699682,
    "lng": 77.57605211,
    "dailyTrips": 140,
    "routesCount": 8,
    "topRoutes": [
      "55-B",
      "402-B",
      "PTH-YSTF",
      "PTH-YST",
      "ADTS-16",
      "243-L KMT-LDH",
      "KBS-ADTS",
      "SDNIBK-YSTF"
    ],
    "boothCodes": [
      "29150101",
      "29150140",
      "29150144",
      "29150146",
      "29150150",
      "29150151",
      "29150152",
      "29150153",
      "29150154",
      "29150155",
      "29150156",
      "29150157",
      "29150158",
      "29150159",
      "29150160",
      "29150161"
    ],
    "routesMap": {
      "402-B": 57,
      "KBS-ADTS": 1,
      "SDNIBK-YSTF": 1,
      "ADTS-16": 2,
      "PTH-YST": 4,
      "55-B": 67,
      "PTH-YSTF": 6,
      "243-L KMT-LDH": 2
    }
  },
  {
    "name": "Nagaruru Cross",
    "lat": 13.09196943,
    "lng": 77.44524982,
    "dailyTrips": 131,
    "routesCount": 27,
    "topRoutes": [
      "255-E",
      "255-C",
      "255-D",
      "255-A",
      "255-J",
      "248-Y",
      "401-T",
      "255-H"
    ],
    "boothCodes": [
      "29150256",
      "29150258",
      "29150267",
      "29150255"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "255-D": 15,
      "D40C-NGR": 1,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-B KBS-NGR": 1,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255-J  DSP-HNS": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "255H DSP-GDP": 1,
      "255-AC": 3,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "Biscuit Factoy Makali",
    "lat": 13.0819735,
    "lng": 77.44979202,
    "dailyTrips": 131,
    "routesCount": 27,
    "topRoutes": [
      "255-E",
      "255-C",
      "255-D",
      "255-A",
      "255-J",
      "248-Y",
      "401-T",
      "255-H"
    ],
    "boothCodes": [
      "29150258",
      "29150260",
      "29150261",
      "29150264",
      "29150265",
      "29150267"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "255-D": 15,
      "D40C-NGR": 1,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-B KBS-NGR": 1,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255-J  DSP-HNS": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "255H DSP-GDP": 1,
      "255-AC": 3,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "Mantri Layout Nagaruru",
    "lat": 13.0845335,
    "lng": 77.44771008,
    "dailyTrips": 131,
    "routesCount": 27,
    "topRoutes": [
      "255-E",
      "255-C",
      "255-D",
      "255-A",
      "255-J",
      "248-Y",
      "401-T",
      "255-H"
    ],
    "boothCodes": [
      "29150258",
      "29150260",
      "29150261",
      "29150264",
      "29150265",
      "29150267"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "255-D": 15,
      "D40C-NGR": 1,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-B KBS-NGR": 1,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255-J  DSP-HNS": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "255H DSP-GDP": 1,
      "255-AC": 3,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "Nisarga Layout Makali",
    "lat": 13.07161078,
    "lng": 77.45273649,
    "dailyTrips": 131,
    "routesCount": 27,
    "topRoutes": [
      "255-E",
      "255-C",
      "255-D",
      "255-A",
      "255-J",
      "248-Y",
      "401-T",
      "255-H"
    ],
    "boothCodes": [
      "29150260",
      "29150266",
      "29150284",
      "29150286",
      "29150264"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "255-D": 15,
      "D40C-NGR": 1,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-B KBS-NGR": 1,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255-J  DSP-HNS": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "255H DSP-GDP": 1,
      "255-AC": 3,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "Kodipalya Nagaruru",
    "lat": 13.09606737,
    "lng": 77.44515927,
    "dailyTrips": 129,
    "routesCount": 25,
    "topRoutes": [
      "255-E",
      "255-C",
      "255-D",
      "255-A",
      "255-J",
      "248-Y",
      "401-T",
      "255-H"
    ],
    "boothCodes": [
      "29150256",
      "29150258",
      "29150267",
      "29150255"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "255-D": 15,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255-J  DSP-HNS": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "255H DSP-GDP": 1,
      "255-AC": 3,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "Vaderahalli Nagaruru",
    "lat": 13.09932384,
    "lng": 77.44478513,
    "dailyTrips": 129,
    "routesCount": 25,
    "topRoutes": [
      "255-E",
      "255-C",
      "255-D",
      "255-A",
      "255-J",
      "248-Y",
      "401-T",
      "255-H"
    ],
    "boothCodes": [
      "29150256",
      "29150258",
      "29150257",
      "29150255"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "255-D": 15,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255-J  DSP-HNS": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "255H DSP-GDP": 1,
      "255-AC": 3,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "Chikka Byalakere",
    "lat": 13.119601,
    "lng": 77.52156504,
    "dailyTrips": 129,
    "routesCount": 18,
    "topRoutes": [
      "291-G",
      "407-B",
      "266-C",
      "266-G",
      "266-J",
      "266-B",
      "266-A",
      "266-E"
    ],
    "boothCodes": [
      "29150055",
      "29150053",
      "29150088"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "YTTMC-MTK": 2,
      "KMT-NGM": 3,
      "407-C": 6,
      "407-B": 14,
      "266-C": 14,
      "266-E": 9,
      "266-G": 12,
      "266-J": 12,
      "291-G": 20,
      "266-A": 10,
      "266-B": 12,
      "KMT-HGV": 7,
      "266 BEL-HIDF": 1,
      "BMT45-MTK 266A": 1,
      "266-C BMT45-KKL": 2,
      "266-J BMT45-MTK": 1,
      "266-J YTTMC-MTK": 1
    }
  },
  {
    "name": "Shivakote",
    "lat": 13.13393205,
    "lng": 77.51471277,
    "dailyTrips": 127,
    "routesCount": 18,
    "topRoutes": [
      "291-G",
      "407-B",
      "266-C",
      "266-G",
      "266-J",
      "266-A",
      "327-B",
      "266-E"
    ],
    "boothCodes": [
      "29150052",
      "29150051",
      "29150053"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "YTTMC-MTK": 2,
      "KMT-NGM": 3,
      "407-C": 6,
      "407-B": 14,
      "266-C": 14,
      "266-E": 9,
      "266-G": 12,
      "266-J": 12,
      "291-G": 20,
      "266-A": 10,
      "327-B": 10,
      "KMT-HGV": 7,
      "266 BEL-HIDF": 1,
      "BMT45-MTK 266A": 1,
      "266-C BMT45-KKL": 2,
      "266-J BMT45-MTK": 1,
      "266-J YTTMC-MTK": 1
    }
  },
  {
    "name": "Mattahalli APMC Yard",
    "lat": 13.10483981,
    "lng": 77.4438423,
    "dailyTrips": 125,
    "routesCount": 23,
    "topRoutes": [
      "255-E",
      "255-C",
      "255-D",
      "255-A",
      "255-J",
      "248-Y",
      "401-T",
      "255-H"
    ],
    "boothCodes": [
      "29150256",
      "29150257",
      "29150094",
      "29150255",
      "29150091"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "255-D": 15,
      "255-A": 11,
      "255-C": 18,
      "255-J": 10,
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255 YTTMC-MTH": 4,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-C YTTMC-PLH": 1,
      "255-D JHC-HSK": 1,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255-J  DSP-HNS": 1,
      "255-J KBS-HNS": 1,
      "255-J YTTMC-HNS": 1,
      "255H DSP-GDP": 1
    }
  },
  {
    "name": "Gayathrinagara Cross Sondekoppa",
    "lat": 13.0147777,
    "lng": 77.38346582,
    "dailyTrips": 124,
    "routesCount": 17,
    "topRoutes": [
      "374-M",
      "374-MA",
      "242-TB",
      "242-TC",
      "221-L",
      "242-T",
      "245-A",
      "242-LA"
    ],
    "boothCodes": [
      "29150340",
      "29150337",
      "29150338"
    ],
    "routesMap": {
      "D35G-BVRH": 1,
      "374-MA": 18,
      "221-L": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-LA": 8,
      "242-L": 6,
      "242-TA KBS-MTK": 2,
      "242-TA": 4,
      "D35G-MTK": 1,
      "245-A": 9,
      "242-TC": 12,
      "242-TB D35G-KVH": 1,
      "374-M": 26,
      "242-TC KMT-SNDKP": 1,
      "D35G-SKP": 1,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Mallasandra Sondekoppa",
    "lat": 13.0025508,
    "lng": 77.39414118,
    "dailyTrips": 124,
    "routesCount": 17,
    "topRoutes": [
      "374-M",
      "374-MA",
      "242-TB",
      "242-TC",
      "221-L",
      "242-T",
      "245-A",
      "242-LA"
    ],
    "boothCodes": [
      "29150340",
      "29150359"
    ],
    "routesMap": {
      "D35G-BVRH": 1,
      "374-MA": 18,
      "221-L": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-LA": 8,
      "242-L": 6,
      "242-TA KBS-MTK": 2,
      "242-TA": 4,
      "D35G-MTK": 1,
      "245-A": 9,
      "242-TC": 12,
      "242-TB D35G-KVH": 1,
      "374-M": 26,
      "242-TC KMT-SNDKP": 1,
      "D35G-SKP": 1,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Chowdeshwarinagara Tavarekere",
    "lat": 12.99755871,
    "lng": 77.39936578,
    "dailyTrips": 115,
    "routesCount": 16,
    "topRoutes": [
      "374-M",
      "374-MA",
      "242-TB",
      "242-TC",
      "221-L",
      "242-T",
      "242-LA",
      "242-L"
    ],
    "boothCodes": [
      "29150359",
      "29150360"
    ],
    "routesMap": {
      "D35G-BVRH": 1,
      "374-MA": 18,
      "221-L": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-LA": 8,
      "242-L": 6,
      "242-TA KBS-MTK": 2,
      "242-TA": 4,
      "D35G-MTK": 1,
      "242-TC": 12,
      "242-TB D35G-KVH": 1,
      "374-M": 26,
      "242-TC KMT-SNDKP": 1,
      "D35G-SKP": 1,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Metipalya Tavarekere",
    "lat": 12.99352232,
    "lng": 77.40229765,
    "dailyTrips": 115,
    "routesCount": 16,
    "topRoutes": [
      "374-M",
      "374-MA",
      "242-TB",
      "242-TC",
      "221-L",
      "242-T",
      "242-LA",
      "242-L"
    ],
    "boothCodes": [
      "29150359",
      "29150360"
    ],
    "routesMap": {
      "D35G-BVRH": 1,
      "374-MA": 18,
      "221-L": 9,
      "242-T": 9,
      "242-TB": 15,
      "242-LA": 8,
      "242-L": 6,
      "242-TA KBS-MTK": 2,
      "242-TA": 4,
      "D35G-MTK": 1,
      "242-TC": 12,
      "242-TB D35G-KVH": 1,
      "374-M": 26,
      "242-TC KMT-SNDKP": 1,
      "D35G-SKP": 1,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Chikka Kukkanahalli",
    "lat": 13.15753373,
    "lng": 77.44898915,
    "dailyTrips": 115,
    "routesCount": 14,
    "topRoutes": [
      "253-G",
      "253-K",
      "253-HA",
      "313-T",
      "253-H",
      "248-Z",
      "253-F",
      "253-HC"
    ],
    "boothCodes": [
      "29150070"
    ],
    "routesMap": {
      "248-Z": 9,
      "PSS-KLD": 2,
      "253-G": 22,
      "253-H": 11,
      "253-K": 18,
      "253-HC": 6,
      "253-G KMT-KNW": 4,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "253-HA": 14,
      "PSS-MLHP": 2,
      "253-F": 9,
      "PSS-CKM": 2,
      "313-T": 13
    }
  },
  {
    "name": "Kakolu",
    "lat": 13.18710562,
    "lng": 77.52009567,
    "dailyTrips": 114,
    "routesCount": 20,
    "topRoutes": [
      "285-V",
      "285-R",
      "407-B",
      "266-C",
      "285-RA",
      "285-L",
      "407-C",
      "CRISTAL-5"
    ],
    "boothCodes": [
      "29150019",
      "29150020",
      "29150021"
    ],
    "routesMap": {
      "D10G-RCH": 2,
      "407-C": 6,
      "248-Q": 2,
      "285-L": 11,
      "CRISTAL-5": 3,
      "407-B": 14,
      "266-C": 14,
      "285-V": 18,
      "285-L NES-BYTH": 1,
      "285-R RJK-CHL": 1,
      "406 YLKOT-NMG": 1,
      "253-L PTML-HGV": 1,
      "285-R": 16,
      "285-R NES-CHL": 2,
      "285-R PTMT-CHL": 2,
      "285-RA": 13,
      "285-RA NES-HNYR": 2,
      "285-RA PTMT-HNYR": 1,
      "285V YHK-SNH": 2,
      "266-C BMT45-KKL": 2
    }
  },
  {
    "name": "Bayandahalli",
    "lat": 13.006079,
    "lng": 77.44215424,
    "dailyTrips": 112,
    "routesCount": 23,
    "topRoutes": [
      "245-M",
      "245-J",
      "245-E",
      "245-D",
      "245-A",
      "245-F",
      "245-Q",
      "245-MA"
    ],
    "boothCodes": [
      "29150363",
      "29150358",
      "29150352",
      "29150350"
    ],
    "routesMap": {
      "D35G-KTH": 1,
      "D35G-VDHTC": 1,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-MA": 6,
      "245-AA": 4,
      "336-B SNBS-KMP": 2,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "245-Q": 8,
      "D35G-BTH": 1,
      "245-D": 9,
      "245-A": 9,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "245-M MNKH-MRTG": 1,
      "KDBC-MNKH": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1
    }
  },
  {
    "name": "Bayandahalli Colony",
    "lat": 13.00336388,
    "lng": 77.4422773,
    "dailyTrips": 112,
    "routesCount": 23,
    "topRoutes": [
      "245-M",
      "245-J",
      "245-E",
      "245-D",
      "245-A",
      "245-F",
      "245-Q",
      "245-MA"
    ],
    "boothCodes": [
      "29150363",
      "29150358",
      "29150366",
      "29150367"
    ],
    "routesMap": {
      "D35G-KTH": 1,
      "D35G-VDHTC": 1,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-MA": 6,
      "245-AA": 4,
      "336-B SNBS-KMP": 2,
      "245-DA": 6,
      "245-E": 11,
      "245-F": 8,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "245-Q": 8,
      "D35G-BTH": 1,
      "245-D": 9,
      "245-A": 9,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "245-M MNKH-MRTG": 1,
      "KDBC-MNKH": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1
    }
  },
  {
    "name": "Addiganahalli",
    "lat": 13.17291279,
    "lng": 77.56958865,
    "dailyTrips": 108,
    "routesCount": 33,
    "topRoutes": [
      "285-N",
      "285-K",
      "407-B",
      "291-K",
      "285-K KBS-PTML",
      "285-K NES-PTML",
      "407-C",
      "KDG-CSB-D34"
    ],
    "boothCodes": [
      "29150027",
      "29150028",
      "29150029",
      "29150030"
    ],
    "routesMap": {
      "D10G-RCH": 2,
      "407-C": 6,
      "KDG-CSB-D34": 5,
      "285-K": 14,
      "285-N": 15,
      "407-B": 14,
      "291-K": 7,
      "285-H PTML-KLH": 1,
      "250-LA ADGH-MHC": 1,
      "285-CA PTML-JKBH": 1,
      "285-K KMT-PMTL": 2,
      "285-K PTML-NES": 2,
      "285-K KBS-PTML": 7,
      "285-MC PTML-DBP": 3,
      "285-C PTML-DTMKR": 1,
      "285-J PTML-JLG": 1,
      "285-K NES-SDH": 1,
      "297-B PTML-DGH": 1,
      "289-K BMT46-KDYH": 1,
      "253-L PTML-HGV": 1,
      "253-LA PTML-HGV": 1,
      "285-CB PTML-KKH": 1,
      "285-RC PTML-HGV": 1,
      "283-D PTML-KDGC": 1,
      "285-K NES-PTML": 7,
      "285-R PTMT-CHL": 2,
      "285-RA PTMT-HNYR": 1,
      "283E PTML-THS": 2,
      "285-JE PTML-DYVH": 1,
      "285-W PTML-DBR": 1,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "401 PTMTL-YTTMC": 1
    }
  },
  {
    "name": "Meenakshi Layout Bagalagunte",
    "lat": 13.06548074,
    "lng": 77.49287814,
    "dailyTrips": 107,
    "routesCount": 10,
    "topRoutes": [
      "250-B",
      "248-P",
      "250-SA",
      "250-V",
      "250-J",
      "250-E",
      "250-AD",
      "248-L"
    ],
    "boothCodes": [
      "29150295",
      "29150297",
      "29150298",
      "29150296"
    ],
    "routesMap": {
      "248-P": 16,
      "248-L": 3,
      "250-SA": 12,
      "250-V": 12,
      "PSS-TMH": 3,
      "250-AD": 9,
      "248 KMT-JHC-KDG": 1,
      "250-E": 11,
      "250-J": 12,
      "250-B": 28
    }
  },
  {
    "name": "Byraveshwara Layout Bagalagunte",
    "lat": 13.06535271,
    "lng": 77.49479659,
    "dailyTrips": 104,
    "routesCount": 9,
    "topRoutes": [
      "250-B",
      "248-P",
      "250-SA",
      "250-V",
      "250-J",
      "250-E",
      "250-AD",
      "PSS-TMH"
    ],
    "boothCodes": [
      "29150295",
      "29150296"
    ],
    "routesMap": {
      "248-P": 16,
      "250-SA": 12,
      "250-V": 12,
      "PSS-TMH": 3,
      "250-AD": 9,
      "248 KMT-JHC-KDG": 1,
      "250-E": 11,
      "250-J": 12,
      "250-B": 28
    }
  },
  {
    "name": "Koluvarayanahalli",
    "lat": 13.16496614,
    "lng": 77.52164887,
    "dailyTrips": 104,
    "routesCount": 13,
    "topRoutes": [
      "251-B",
      "285-H",
      "266-C",
      "285-RC",
      "253-LA",
      "285-W",
      "YHKOT-HSG",
      "285-H KBS-KLH"
    ],
    "boothCodes": [
      "29150032",
      "29150035"
    ],
    "routesMap": {
      "251-B": 40,
      "285-H": 14,
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "266-C": 14,
      "285-H PTML-KLH": 1,
      "253-LA": 8,
      "285-H KBS-KLH": 2,
      "253-LA PTML-HGV": 1,
      "285-RC PTML-HGV": 1,
      "285-W PTML-DBR": 1,
      "285-W": 8,
      "266-C BMT45-KKL": 2
    }
  },
  {
    "name": "Vinayakanagara Hesarghatta",
    "lat": 13.13859356,
    "lng": 77.47475378,
    "dailyTrips": 103,
    "routesCount": 12,
    "topRoutes": [
      "248-J",
      "253-G",
      "313-T",
      "248-Z",
      "253-P",
      "407-F",
      "253-G KMT-KNW",
      "507-C YPRS-KRPG"
    ],
    "boothCodes": [
      "29150063",
      "29150066",
      "29150062",
      "29150058",
      "29150059",
      "29150060",
      "29150061",
      "29150064",
      "29150065"
    ],
    "routesMap": {
      "248-Z": 9,
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "253-P": 9,
      "253-G": 22,
      "253-G KMT-KNW": 4,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "HSG-NMG 407": 1,
      "248-J": 30,
      "KBS-DSNH": 2,
      "313-T": 13
    }
  },
  {
    "name": "Mallapura Nelamangala",
    "lat": 13.07273304,
    "lng": 77.39367731,
    "dailyTrips": 101,
    "routesCount": 9,
    "topRoutes": [
      "374-M",
      "374-MA",
      "245-H",
      "242-TC",
      "221-L",
      "245-A",
      "248-HA",
      "245-H MRTG-NML"
    ],
    "boothCodes": [
      "29150316",
      "29150315"
    ],
    "routesMap": {
      "374-MA": 18,
      "221-L": 9,
      "245-A": 9,
      "242-TC": 12,
      "248-HA": 9,
      "374-M": 26,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Yale Kodigehalli",
    "lat": 12.98291377,
    "lng": 77.46845596,
    "dailyTrips": 98,
    "routesCount": 11,
    "topRoutes": [
      "241-CB",
      "241-B",
      "241-P",
      "241-C",
      "241-CD",
      "241 D35G-KMT",
      "BTP-35",
      "D31G-NGHN"
    ],
    "boothCodes": [
      "29150374",
      "29150372"
    ],
    "routesMap": {
      "241-P": 12,
      "241-C": 11,
      "241-CB": 28,
      "D31G-NGHN": 1,
      "D31G-KCP": 1,
      "241-B": 26,
      "241 D35G-KMT": 3,
      "241-CD": 11,
      "BTP-35": 3,
      "241 MRTG-KCP": 1,
      "241-CB MRTG-YKH": 1
    }
  },
  {
    "name": "Gerahalli Sondekoppa",
    "lat": 13.03723898,
    "lng": 77.39056662,
    "dailyTrips": 91,
    "routesCount": 10,
    "topRoutes": [
      "374-M",
      "374-MA",
      "242-TC",
      "221-L",
      "242-T",
      "245-A",
      "242-TA",
      "242-TA KBS-MTK"
    ],
    "boothCodes": [
      "29150316",
      "29150336"
    ],
    "routesMap": {
      "374-MA": 18,
      "221-L": 9,
      "242-T": 9,
      "242-TA KBS-MTK": 2,
      "242-TA": 4,
      "D35G-MTK": 1,
      "245-A": 9,
      "242-TC": 12,
      "374-M": 26,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Poultry Farm",
    "lat": 13.14925152,
    "lng": 77.47650522,
    "dailyTrips": 90,
    "routesCount": 12,
    "topRoutes": [
      "291-G",
      "407-B",
      "320-C",
      "253-A",
      "253-C",
      "253-L",
      "407-C",
      "KMT-NGM"
    ],
    "boothCodes": [
      "29150066",
      "29150017"
    ],
    "routesMap": {
      "253-A": 12,
      "253-L": 6,
      "KMT-NGM": 3,
      "253-C": 8,
      "407-C": 6,
      "248-Q": 2,
      "407-B": 14,
      "291-G": 20,
      "320-C": 14,
      "266 BEL-HIDF": 1,
      "253-L PTML-HGV": 1,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "Kachohalli",
    "lat": 13.00016456,
    "lng": 77.47057825,
    "dailyTrips": 88,
    "routesCount": 6,
    "topRoutes": [
      "240-R",
      "240-C",
      "240-F",
      "240-F KMT-MDH",
      "D35G-KCH",
      "D31G-KCH"
    ],
    "boothCodes": [
      "29150356",
      "29150357",
      "29150368",
      "29150370"
    ],
    "routesMap": {
      "D35G-KCH": 2,
      "240-R": 45,
      "D31G-KCH": 2,
      "240-C": 23,
      "240-F": 13,
      "240-F KMT-MDH": 3
    }
  },
  {
    "name": "Kittanahalli",
    "lat": 13.0089461,
    "lng": 77.41957651,
    "dailyTrips": 87,
    "routesCount": 16,
    "topRoutes": [
      "245-H",
      "245-J",
      "245-E",
      "245-A",
      "245-K",
      "245-F",
      "245-R",
      "PSS-KTNH"
    ],
    "boothCodes": [
      "29150342",
      "29150341"
    ],
    "routesMap": {
      "D35G-KTH": 1,
      "PSS-KTNH": 4,
      "CLO-AVH": 1,
      "245-K": 8,
      "336-B SNBS-KMP": 2,
      "245-E": 11,
      "245-F": 8,
      "245-A": 9,
      "KTH-D35G": 1,
      "245-H NML-D35G": 1,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1
    }
  },
  {
    "name": "Mattahalli",
    "lat": 13.10819637,
    "lng": 77.45703431,
    "dailyTrips": 87,
    "routesCount": 14,
    "topRoutes": [
      "255-E",
      "255-L",
      "255-N",
      "401-T",
      "502-HE",
      "255-H",
      "265-E",
      "255 YTTMC-MTH"
    ],
    "boothCodes": [
      "29150094",
      "29150095"
    ],
    "routesMap": {
      "502-HE": 7,
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255-L": 12,
      "255-N": 11,
      "255 YTTMC-MTH": 4,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255H DSP-GDP": 1,
      "KBS-MTH": 3
    }
  },
  {
    "name": "Indo Dyanish Farm",
    "lat": 13.16121895,
    "lng": 77.47998476,
    "dailyTrips": 87,
    "routesCount": 11,
    "topRoutes": [
      "291-G",
      "407-B",
      "320-C",
      "253-A",
      "253-C",
      "253-L",
      "407-C",
      "253-A BMT45-LKPC-BYT"
    ],
    "boothCodes": [
      "29150017"
    ],
    "routesMap": {
      "253-A": 12,
      "253-L": 6,
      "253-C": 8,
      "407-C": 6,
      "248-Q": 2,
      "407-B": 14,
      "291-G": 20,
      "320-C": 14,
      "266 BEL-HIDF": 1,
      "253-L PTML-HGV": 1,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "Bettahalli Vaddarahalli",
    "lat": 13.00812437,
    "lng": 77.43479796,
    "dailyTrips": 85,
    "routesCount": 14,
    "topRoutes": [
      "245-H",
      "245-J",
      "245-E",
      "245-A",
      "245-K",
      "245-F",
      "245-R",
      "PSS-KTNH"
    ],
    "boothCodes": [
      "29150341",
      "29150343",
      "29150362",
      "29150363",
      "29150358"
    ],
    "routesMap": {
      "D35G-KTH": 1,
      "PSS-KTNH": 4,
      "CLO-AVH": 1,
      "245-K": 8,
      "336-B SNBS-KMP": 2,
      "245-E": 11,
      "245-F": 8,
      "245-A": 9,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "245-H": 16,
      "245-H MRTG-NML": 1,
      "245-J": 13,
      "245-J MRTG-KTH": 1
    }
  },
  {
    "name": "Nruthyagrama Hesaraghatta",
    "lat": 13.15420361,
    "lng": 77.47292085,
    "dailyTrips": 80,
    "routesCount": 9,
    "topRoutes": [
      "291-G",
      "407-B",
      "320-C",
      "253-A",
      "253-C",
      "253-L",
      "253-A BMT45-LKPC-BYT",
      "248-Q"
    ],
    "boothCodes": [
      "29150017"
    ],
    "routesMap": {
      "253-A": 12,
      "253-L": 6,
      "253-C": 8,
      "248-Q": 2,
      "407-B": 14,
      "291-G": 20,
      "320-C": 14,
      "266 BEL-HIDF": 1,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "KMF Kakolu",
    "lat": 13.18844956,
    "lng": 77.50746668,
    "dailyTrips": 80,
    "routesCount": 15,
    "topRoutes": [
      "285-V",
      "285-R",
      "285-RA",
      "285-L",
      "407-C",
      "CRISTAL-5",
      "285-R NES-CHL",
      "285-R PTMT-CHL"
    ],
    "boothCodes": [
      "29150019",
      "29150016"
    ],
    "routesMap": {
      "407-C": 6,
      "285-L": 11,
      "CRISTAL-5": 3,
      "285-V": 18,
      "285-L NES-BYTH": 1,
      "285-R RJK-CHL": 1,
      "406 YLKOT-NMG": 1,
      "253-L PTML-HGV": 1,
      "285-R": 16,
      "285-R NES-CHL": 2,
      "285-R PTMT-CHL": 2,
      "285-RA": 13,
      "285-RA NES-HNYR": 2,
      "285-RA PTMT-HNYR": 1,
      "285V YHK-SNH": 2
    }
  },
  {
    "name": "Hunnigere Cross Sondekoppa",
    "lat": 13.03917517,
    "lng": 77.39104739,
    "dailyTrips": 77,
    "routesCount": 7,
    "topRoutes": [
      "374-M",
      "374-MA",
      "242-TC",
      "221-L",
      "245-A",
      "242-TA KBS-MTK",
      "D35G-TVK-NML"
    ],
    "boothCodes": [
      "29150316",
      "29150336"
    ],
    "routesMap": {
      "374-MA": 18,
      "221-L": 9,
      "242-TA KBS-MTK": 2,
      "245-A": 9,
      "242-TC": 12,
      "374-M": 26,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Heggadadevanapura",
    "lat": 13.07596192,
    "lng": 77.45860216,
    "dailyTrips": 76,
    "routesCount": 7,
    "topRoutes": [
      "G-11",
      "257-E",
      "255-L",
      "257-H",
      "257-H DSP-ALR",
      "257-H YTTMC-ALR",
      "257E DSP-ALR"
    ],
    "boothCodes": [
      "29150266",
      "29150264",
      "29150265",
      "29150311",
      "29150280"
    ],
    "routesMap": {
      "257-H": 9,
      "G-11": 35,
      "255-L": 12,
      "257-H DSP-ALR": 1,
      "257-H YTTMC-ALR": 1,
      "257E DSP-ALR": 1,
      "257-E": 17
    }
  },
  {
    "name": "Makali Govt High School",
    "lat": 13.06879845,
    "lng": 77.4563859,
    "dailyTrips": 76,
    "routesCount": 7,
    "topRoutes": [
      "G-11",
      "257-E",
      "255-L",
      "257-H",
      "257-H DSP-ALR",
      "257-H YTTMC-ALR",
      "257E DSP-ALR"
    ],
    "boothCodes": [
      "29150266",
      "29150285",
      "29150286",
      "29150293",
      "29150287",
      "29150311"
    ],
    "routesMap": {
      "257-H": 9,
      "G-11": 35,
      "255-L": 12,
      "257-H DSP-ALR": 1,
      "257-H YTTMC-ALR": 1,
      "257E DSP-ALR": 1,
      "257-E": 17
    }
  },
  {
    "name": "Gangondanahalli",
    "lat": 13.02157246,
    "lng": 77.46766604,
    "dailyTrips": 76,
    "routesCount": 5,
    "topRoutes": [
      "61-C",
      "263-G",
      "240-F",
      "263-B",
      "240-F KMT-MDH"
    ],
    "boothCodes": [
      "29150344",
      "29150345",
      "29150346"
    ],
    "routesMap": {
      "240-F": 13,
      "263-G": 20,
      "61-C": 28,
      "263-B": 12,
      "240-F KMT-MDH": 3
    }
  },
  {
    "name": "Hulegowdanahalli Cross",
    "lat": 13.06850825,
    "lng": 77.39461304,
    "dailyTrips": 75,
    "routesCount": 6,
    "topRoutes": [
      "374-M",
      "374-MA",
      "242-TC",
      "221-L",
      "245-A",
      "D35G-TVK-NML"
    ],
    "boothCodes": [
      "29150316",
      "29150315"
    ],
    "routesMap": {
      "374-MA": 18,
      "221-L": 9,
      "245-A": 9,
      "242-TC": 12,
      "374-M": 26,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Lakkenahalli Sondekoppa",
    "lat": 13.0446822,
    "lng": 77.39272378,
    "dailyTrips": 75,
    "routesCount": 6,
    "topRoutes": [
      "374-M",
      "374-MA",
      "242-TC",
      "221-L",
      "245-A",
      "D35G-TVK-NML"
    ],
    "boothCodes": [
      "29150316"
    ],
    "routesMap": {
      "374-MA": 18,
      "221-L": 9,
      "245-A": 9,
      "242-TC": 12,
      "374-M": 26,
      "D35G-TVK-NML": 1
    }
  },
  {
    "name": "Parvathipura",
    "lat": 13.17242187,
    "lng": 77.56560054,
    "dailyTrips": 75,
    "routesCount": 17,
    "topRoutes": [
      "285-K",
      "407-B",
      "291-K",
      "285-K KBS-PTML",
      "285-K NES-PTML",
      "407-C",
      "KDG-CSB-D34",
      "285-MC PTML-DBP"
    ],
    "boothCodes": [
      "29150023",
      "29150024",
      "29150025",
      "29150026",
      "29150027",
      "29150028",
      "29150029",
      "29150030"
    ],
    "routesMap": {
      "D10G-RCH": 2,
      "407-C": 6,
      "KDG-CSB-D34": 5,
      "285-K": 14,
      "407-B": 14,
      "291-K": 7,
      "285-H PTML-KLH": 1,
      "285-CA PTML-JKBH": 1,
      "285-K KMT-PMTL": 2,
      "285-K PTML-NES": 2,
      "285-K KBS-PTML": 7,
      "285-MC PTML-DBP": 3,
      "285-C PTML-DTMKR": 1,
      "285-K NES-SDH": 1,
      "253-L PTML-HGV": 1,
      "285-K NES-PTML": 7,
      "285-RA PTMT-HNYR": 1
    }
  },
  {
    "name": "Kadabagere",
    "lat": 12.9968254,
    "lng": 77.4331654,
    "dailyTrips": 68,
    "routesCount": 14,
    "topRoutes": [
      "245-H",
      "245-GA",
      "245-C",
      "245-K",
      "245-R",
      "PSS-KTNH",
      "245-R KBS-DJP",
      "D35G-KDB"
    ],
    "boothCodes": [
      "29150362",
      "29150363"
    ],
    "routesMap": {
      "D35G-KDB": 1,
      "245-GA": 13,
      "PSS-KTNH": 4,
      "CLO-AVH": 1,
      "245-K": 8,
      "245-C": 10,
      "KTH-D35G": 1,
      "D-31G-KDG": 1,
      "245-H NML-D35G": 1,
      "248-J CKB-JPLK": 1,
      "245-R KBS-DJP": 2,
      "245-R": 8,
      "245-H": 16,
      "245-H MRTG-NML": 1
    }
  },
  {
    "name": "Kuduregere Madanayakanahalli",
    "lat": 13.07521049,
    "lng": 77.47339269,
    "dailyTrips": 68,
    "routesCount": 9,
    "topRoutes": [
      "250-DA",
      "250-SA",
      "257-D",
      "250-DT",
      "250-AD",
      "248 KMT-JHC-KDG",
      "BMT45-CKB-KDG",
      "257-D YTTMC-KDG"
    ],
    "boothCodes": [
      "29150281",
      "29150279",
      "29150280"
    ],
    "routesMap": {
      "250-SA": 12,
      "250-DA": 23,
      "250-AD": 9,
      "248 KMT-JHC-KDG": 1,
      "257-D": 10,
      "250-DT": 10,
      "BMT45-CKB-KDG": 1,
      "257-D YTTMC-KDG": 1,
      "250SA KDG-ASK": 1
    }
  },
  {
    "name": "Hesaraghatta",
    "lat": 13.13784328,
    "lng": 77.47913047,
    "dailyTrips": 67,
    "routesCount": 8,
    "topRoutes": [
      "291-G",
      "320-C",
      "253-A",
      "253-C",
      "407-C",
      "KMT-NGM",
      "253-A BMT45-LKPC-BYT",
      "266 BEL-HIDF"
    ],
    "boothCodes": [
      "29150063",
      "29150066",
      "29150062",
      "29150076",
      "29150058",
      "29150059",
      "29150060",
      "29150061",
      "29150064",
      "29150065"
    ],
    "routesMap": {
      "253-A": 12,
      "KMT-NGM": 3,
      "253-C": 8,
      "407-C": 6,
      "291-G": 20,
      "320-C": 14,
      "266 BEL-HIDF": 1,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "Acharya Institute of Technology Chikkabanavara",
    "lat": 13.08348536,
    "lng": 77.48420857,
    "dailyTrips": 65,
    "routesCount": 8,
    "topRoutes": [
      "250-DA",
      "250-SB",
      "250-DT",
      "502-HE",
      "V-KBS-AIT",
      "KBS-MTH",
      "HBL-ACIT",
      "BMT45-CKB-KDG"
    ],
    "boothCodes": [
      "29150254",
      "29150279",
      "29150300",
      "29150270",
      "29150299"
    ],
    "routesMap": {
      "502-HE": 7,
      "250-DA": 23,
      "V-KBS-AIT": 6,
      "250-SB": 14,
      "HBL-ACIT": 1,
      "250-DT": 10,
      "BMT45-CKB-KDG": 1,
      "KBS-MTH": 3
    }
  },
  {
    "name": "Ganapathinagara Chikkabanavara",
    "lat": 13.07897404,
    "lng": 77.49700606,
    "dailyTrips": 65,
    "routesCount": 8,
    "topRoutes": [
      "250-DA",
      "250-SB",
      "250-DT",
      "502-HE",
      "V-KBS-AIT",
      "KBS-MTH",
      "HBL-ACIT",
      "BMT45-CKB-KDG"
    ],
    "boothCodes": [
      "29150300"
    ],
    "routesMap": {
      "502-HE": 7,
      "250-DA": 23,
      "V-KBS-AIT": 6,
      "250-SB": 14,
      "HBL-ACIT": 1,
      "250-DT": 10,
      "BMT45-CKB-KDG": 1,
      "KBS-MTH": 3
    }
  },
  {
    "name": "Thammenahalli Chikkabanavara",
    "lat": 13.08433249,
    "lng": 77.48879448,
    "dailyTrips": 65,
    "routesCount": 8,
    "topRoutes": [
      "250-DA",
      "250-SB",
      "250-DT",
      "502-HE",
      "V-KBS-AIT",
      "KBS-MTH",
      "HBL-ACIT",
      "BMT45-CKB-KDG"
    ],
    "boothCodes": [
      "29150270",
      "29150299"
    ],
    "routesMap": {
      "502-HE": 7,
      "250-DA": 23,
      "V-KBS-AIT": 6,
      "250-SB": 14,
      "HBL-ACIT": 1,
      "250-DT": 10,
      "BMT45-CKB-KDG": 1,
      "KBS-MTH": 3
    }
  },
  {
    "name": "Siluvepura",
    "lat": 13.11423874,
    "lng": 77.50107774,
    "dailyTrips": 65,
    "routesCount": 11,
    "topRoutes": [
      "290-QA",
      "254-C",
      "254-A",
      "407-F",
      "272-B",
      "KBS-KTH",
      "KTH-KBS",
      "254-A  DSP-KGT"
    ],
    "boothCodes": [
      "29150076",
      "29150096",
      "29150098",
      "29150089"
    ],
    "routesMap": {
      "407-F": 8,
      "290-QA": 18,
      "YTTMC-DBLK": 1,
      "PSS-SLP": 1,
      "PSS-KTH": 1,
      "KBS-KTH": 4,
      "KTH-KBS": 3,
      "254-C": 11,
      "272-B": 5,
      "254-A": 11,
      "254-A  DSP-KGT": 2
    }
  },
  {
    "name": "Vaddarahalli",
    "lat": 13.01493716,
    "lng": 77.44690822,
    "dailyTrips": 62,
    "routesCount": 14,
    "topRoutes": [
      "245-M",
      "245-D",
      "245-Q",
      "245-MA",
      "245-DA",
      "245-AA",
      "245-M KHC-VDHTC",
      "KBS-MNKH"
    ],
    "boothCodes": [
      "29150343",
      "29150358",
      "29150350"
    ],
    "routesMap": {
      "D35G-VDHTC": 1,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-MA": 6,
      "245-AA": 4,
      "245-DA": 6,
      "KBS-MNKH": 2,
      "245-Q": 8,
      "D35G-BTH": 1,
      "245-D": 9,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "KDBC-MNKH": 1
    }
  },
  {
    "name": "Marasandra Gate",
    "lat": 13.22273258,
    "lng": 77.54934704,
    "dailyTrips": 62,
    "routesCount": 10,
    "topRoutes": [
      "285-MP",
      "285-C",
      "306-L",
      "KRP-MRS",
      "MRS-KBS",
      "KBS-MRS",
      "285-C KBS-DTMKR",
      "285-C PTML-DTMKR"
    ],
    "boothCodes": [
      "29150005",
      "29150002",
      "29150004",
      "29150003"
    ],
    "routesMap": {
      "285-MP": 30,
      "KRP-MRS": 2,
      "306-L": 9,
      "MRS-KBS": 2,
      "KBS-MRS": 2,
      "285-C": 12,
      "285-C PTML-DTMKR": 1,
      "285-C KBS-DTMKR": 2,
      "285-CB PTML-KKH": 1,
      "306-L BMT41G-MRS": 1
    }
  },
  {
    "name": "Shanthinagara Gangondanahalli",
    "lat": 13.0262599,
    "lng": 77.47342609,
    "dailyTrips": 60,
    "routesCount": 3,
    "topRoutes": [
      "61-C",
      "263-G",
      "263-B"
    ],
    "boothCodes": [
      "29150329",
      "29150345",
      "29150346",
      "29150347"
    ],
    "routesMap": {
      "263-G": 20,
      "61-C": 28,
      "263-B": 12
    }
  },
  {
    "name": "Dwarakanagara Chikkabanavara",
    "lat": 13.08772424,
    "lng": 77.49520898,
    "dailyTrips": 59,
    "routesCount": 5,
    "topRoutes": [
      "248-J",
      "502-K",
      "254-D",
      "TNS-PSS",
      "248-Q"
    ],
    "boothCodes": [
      "29150269",
      "29150270"
    ],
    "routesMap": {
      "502-K": 12,
      "248-Q": 2,
      "254-D": 10,
      "TNS-PSS": 5,
      "248-J": 30
    }
  },
  {
    "name": "Yelahanka Police Station",
    "lat": 13.09464541,
    "lng": 77.59438634,
    "dailyTrips": 59,
    "routesCount": 23,
    "topRoutes": [
      "NITT-2",
      "BTP-26B",
      "MEBP-26",
      "VNS-15",
      "NITT-1A",
      "BMES-5A",
      "BTP-26",
      "CAPGPS-9"
    ],
    "boothCodes": [
      "29150194",
      "29150205",
      "29150206",
      "29150147",
      "29150183",
      "29150184",
      "29150186",
      "29150197",
      "29150198",
      "29150199",
      "29150200",
      "29150201"
    ],
    "routesMap": {
      "CAPGR-11": 2,
      "BEMLA-7": 2,
      "ITPL-9A": 2,
      "MEBP-26": 4,
      "CRHS-6": 2,
      "ADITHI-04": 2,
      "BMES-5A": 3,
      "VNS-15": 4,
      "VCS-JFWTC-22 YHK-JFWTC": 1,
      "BTP-26B": 5,
      "BTP-26": 3,
      "ITI-01": 2,
      "CAPGPS-9": 3,
      "BTP-24": 2,
      "NITT-2": 8,
      "NITT-1A": 4,
      "ITPL-08": 3,
      "ITPL-8A": 3,
      "VCS-ORRCA-206 JWSR-ORRCA": 1,
      "VCS-ORRCA-106 SNH-ORRCA Salarpuria Soft Zone": 1,
      "VCS-MEBP-76 MNH-MEBP": 1,
      "VCS-ITPB-GM-17 YLK-5-ITPL": 1,
      "VCS-TATA ELEXI-07 DBSA-TELX": 0
    }
  },
  {
    "name": "Cable Factory Madhure Temple Road",
    "lat": 13.17402848,
    "lng": 77.54040908,
    "dailyTrips": 56,
    "routesCount": 3,
    "topRoutes": [
      "251-B",
      "407-B",
      "D10G-RCH"
    ],
    "boothCodes": [
      "29150021",
      "29150031"
    ],
    "routesMap": {
      "251-B": 40,
      "D10G-RCH": 2,
      "407-B": 14
    }
  },
  {
    "name": "Sri Banashankari Layout Rajanukunte",
    "lat": 13.1715396,
    "lng": 77.55796254,
    "dailyTrips": 56,
    "routesCount": 3,
    "topRoutes": [
      "251-B",
      "407-B",
      "D10G-RCH"
    ],
    "boothCodes": [
      "29150023",
      "29150025",
      "29150026",
      "29150027"
    ],
    "routesMap": {
      "251-B": 40,
      "D10G-RCH": 2,
      "407-B": 14
    }
  },
  {
    "name": "Kamakshipura",
    "lat": 13.19817025,
    "lng": 77.48909853,
    "dailyTrips": 55,
    "routesCount": 10,
    "topRoutes": [
      "407-B",
      "285-L",
      "285-RB",
      "253-L",
      "407-C",
      "CRISTAL-5",
      "D10G-RCH",
      "285-L NES-BYTH"
    ],
    "boothCodes": [
      "29150017",
      "29150009",
      "29150018",
      "29150016"
    ],
    "routesMap": {
      "253-L": 6,
      "D10G-RCH": 2,
      "407-C": 6,
      "285-L": 11,
      "285-RB": 10,
      "CRISTAL-5": 3,
      "407-B": 14,
      "285-L NES-BYTH": 1,
      "406 YLKOT-NMG": 1,
      "253-L PTML-HGV": 1
    }
  },
  {
    "name": "Kempaiahnagara",
    "lat": 13.10817433,
    "lng": 77.48247385,
    "dailyTrips": 55,
    "routesCount": 10,
    "topRoutes": [
      "253-G",
      "253-D",
      "TNS-PSS",
      "253-G KMT-KNW",
      "253-A BMT45-LKPC-BYT",
      "248-Q",
      "KBS-TNS",
      "YTTMC-SDP"
    ],
    "boothCodes": [
      "29150062",
      "29150097",
      "29150250",
      "29150252",
      "29150253"
    ],
    "routesMap": {
      "253-G": 22,
      "PSS-TRN": 1,
      "248-Q": 2,
      "KBS-TNS": 2,
      "TNS-PSS": 5,
      "253-D": 13,
      "253-G KMT-KNW": 4,
      "YTTMC-SDP": 2,
      "PSS-SDP": 1,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "BGS College Thotagere",
    "lat": 13.14426348,
    "lng": 77.45147556,
    "dailyTrips": 53,
    "routesCount": 6,
    "topRoutes": [
      "253-K",
      "253-HA",
      "253-H",
      "253-HC",
      "PSS-MLHP",
      "PSS-CKM"
    ],
    "boothCodes": [
      "29150070",
      "29150073",
      "29150069",
      "29150067"
    ],
    "routesMap": {
      "253-H": 11,
      "253-K": 18,
      "253-HC": 6,
      "253-HA": 14,
      "PSS-MLHP": 2,
      "PSS-CKM": 2
    }
  },
  {
    "name": "Challahalli",
    "lat": 13.21733063,
    "lng": 77.50644478,
    "dailyTrips": 53,
    "routesCount": 9,
    "topRoutes": [
      "285-R",
      "285-RA",
      "285-RB",
      "253-L",
      "285-R NES-CHL",
      "285-R PTMT-CHL",
      "285-RA NES-HNYR",
      "285-R RJK-CHL"
    ],
    "boothCodes": [
      "29150001",
      "29150007"
    ],
    "routesMap": {
      "253-L": 6,
      "285-RB": 10,
      "285-R RJK-CHL": 1,
      "285-R": 16,
      "285-R NES-CHL": 2,
      "285-R PTMT-CHL": 2,
      "285-RA": 13,
      "285-RA NES-HNYR": 2,
      "285-RA PTMT-HNYR": 1
    }
  },
  {
    "name": "Gangondanahalli Cross",
    "lat": 13.02908254,
    "lng": 77.46452536,
    "dailyTrips": 52,
    "routesCount": 4,
    "topRoutes": [
      "61-C",
      "240-F",
      "289-C",
      "240-F KMT-MDH"
    ],
    "boothCodes": [
      "29150329",
      "29150344",
      "29150345",
      "29150346"
    ],
    "routesMap": {
      "240-F": 13,
      "61-C": 28,
      "289-C": 8,
      "240-F KMT-MDH": 3
    }
  },
  {
    "name": "Mattahalli Basappa Layout",
    "lat": 13.1065971,
    "lng": 77.45375008,
    "dailyTrips": 51,
    "routesCount": 8,
    "topRoutes": [
      "255-E",
      "401-T",
      "255-H",
      "265-E",
      "255 YTTMC-MTH",
      "255-E KBS-NSP",
      "401-B HPN-YTTMC",
      "255-E JHC-NSP"
    ],
    "boothCodes": [
      "29150094",
      "29150255"
    ],
    "routesMap": {
      "255-E": 22,
      "401-B HPN-YTTMC": 1,
      "255-H": 6,
      "265-E": 6,
      "401-T": 8,
      "255 YTTMC-MTH": 4,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1
    }
  },
  {
    "name": "Seeresandra Byatha",
    "lat": 13.19185576,
    "lng": 77.48333988,
    "dailyTrips": 51,
    "routesCount": 8,
    "topRoutes": [
      "407-B",
      "253-A",
      "285-RB",
      "253-L",
      "CRISTAL-5",
      "253-A BMT45-LKPC-BYT",
      "D10G-RCH",
      "406 YLKOT-NMG"
    ],
    "boothCodes": [
      "29150017",
      "29150018"
    ],
    "routesMap": {
      "253-A": 12,
      "253-L": 6,
      "D10G-RCH": 2,
      "285-RB": 10,
      "CRISTAL-5": 3,
      "407-B": 14,
      "406 YLKOT-NMG": 1,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "MES College Aradeshanahalli Road",
    "lat": 13.21752467,
    "lng": 77.55551121,
    "dailyTrips": 50,
    "routesCount": 10,
    "topRoutes": [
      "285-JE",
      "285-P",
      "285-J",
      "297-M",
      "285-JB THDL-KBS",
      "285-J PTML-JLG",
      "285-JC NES-JTH",
      "285-P NES-BTH"
    ],
    "boothCodes": [
      "29150005",
      "29150012",
      "29150013",
      "29150003"
    ],
    "routesMap": {
      "285-J": 12,
      "285-P": 13,
      "285-JB THDL-KBS": 1,
      "297-M": 2,
      "285-JE": 17,
      "285-J PTML-JLG": 1,
      "285-JC NES-JTH": 1,
      "285-P NES-BTH": 1,
      "285-P KBS-BTH": 1,
      "285-JE PTML-DYVH": 1
    }
  },
  {
    "name": "Paakegowdanapalya",
    "lat": 13.1144824,
    "lng": 77.51061773,
    "dailyTrips": 46,
    "routesCount": 6,
    "topRoutes": [
      "290-QA",
      "254-C",
      "407-F",
      "272-B",
      "KTH-KBS",
      "YTTMC-DBLK"
    ],
    "boothCodes": [
      "29150055",
      "29150089",
      "29150086",
      "29150088",
      "29150099"
    ],
    "routesMap": {
      "407-F": 8,
      "290-QA": 18,
      "YTTMC-DBLK": 1,
      "KTH-KBS": 3,
      "254-C": 11,
      "272-B": 5
    }
  },
  {
    "name": "Machohalli Colony",
    "lat": 12.9975456,
    "lng": 77.45129987,
    "dailyTrips": 45,
    "routesCount": 7,
    "topRoutes": [
      "252-C",
      "240-A",
      "240-E",
      "D35G-MCH",
      "240-A KBS-MCH",
      "D35G-BKH",
      "361-B CPR-CHD"
    ],
    "boothCodes": [
      "29150358",
      "29150351",
      "29150352",
      "29150353",
      "29150364",
      "29150367"
    ],
    "routesMap": {
      "D35G-MCH": 3,
      "D35G-BKH": 1,
      "240-E": 11,
      "240-A": 12,
      "252-C": 14,
      "240-A KBS-MCH": 3,
      "361-B CPR-CHD": 1
    }
  },
  {
    "name": "Machohalli",
    "lat": 13.00613652,
    "lng": 77.45286727,
    "dailyTrips": 45,
    "routesCount": 7,
    "topRoutes": [
      "252-C",
      "240-A",
      "240-E",
      "D35G-MCH",
      "240-A KBS-MCH",
      "D35G-BKH",
      "361-B CPR-CHD"
    ],
    "boothCodes": [
      "29150351",
      "29150352",
      "29150350",
      "29150349"
    ],
    "routesMap": {
      "D35G-MCH": 3,
      "D35G-BKH": 1,
      "240-E": 11,
      "240-A": 12,
      "252-C": 14,
      "240-A KBS-MCH": 3,
      "361-B CPR-CHD": 1
    }
  },
  {
    "name": "Mavallipura",
    "lat": 13.12770551,
    "lng": 77.52854085,
    "dailyTrips": 45,
    "routesCount": 5,
    "topRoutes": [
      "290-QA",
      "266-K",
      "266-B",
      "KBS-MVL",
      "KMT-MVL"
    ],
    "boothCodes": [
      "29150053",
      "29150050"
    ],
    "routesMap": {
      "290-QA": 18,
      "266-B": 12,
      "266-K": 13,
      "KBS-MVL": 1,
      "KMT-MVL": 1
    }
  },
  {
    "name": "BMTC Training Centre Vaddarahalli",
    "lat": 13.01986316,
    "lng": 77.4483299,
    "dailyTrips": 44,
    "routesCount": 11,
    "topRoutes": [
      "245-M",
      "245-MA",
      "245-DA",
      "245-AA",
      "245-M KHC-VDHTC",
      "KBS-MNKH",
      "D35G-VDHTC",
      "245-M KHC-VTC"
    ],
    "boothCodes": [
      "29150343",
      "29150358"
    ],
    "routesMap": {
      "D35G-VDHTC": 1,
      "245-M": 20,
      "245-M KHC-VDHTC": 2,
      "245-MA": 6,
      "245-AA": 4,
      "245-DA": 6,
      "KBS-MNKH": 2,
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1,
      "D31G-KMS": 1,
      "KDBC-MNKH": 1
    }
  },
  {
    "name": "Guni Agrahara",
    "lat": 13.09356972,
    "lng": 77.5278756,
    "dailyTrips": 43,
    "routesCount": 6,
    "topRoutes": [
      "271-G",
      "266-F",
      "407-F",
      "272-B",
      "253-A BMT45-LKPC-BYT",
      "BMT45-CKB-KDG"
    ],
    "boothCodes": [
      "29150247",
      "29150248"
    ],
    "routesMap": {
      "407-F": 8,
      "271-G": 14,
      "272-B": 5,
      "266-F": 12,
      "BMT45-CKB-KDG": 1,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "Madappanahalli Singanayakanahalli",
    "lat": 13.14862394,
    "lng": 77.55208871,
    "dailyTrips": 43,
    "routesCount": 8,
    "topRoutes": [
      "285-H",
      "285-D",
      "285-W",
      "YHKOT-MLPH",
      "285-H KBS-KLH",
      "285-H PTML-KLH",
      "407-E YLKOT-LGNH",
      "285-W PTML-DBR"
    ],
    "boothCodes": [
      "29150037",
      "29150038",
      "29150044",
      "29150039"
    ],
    "routesMap": {
      "285-H": 14,
      "285-D": 13,
      "YHKOT-MLPH": 3,
      "285-H PTML-KLH": 1,
      "407-E YLKOT-LGNH": 1,
      "285-H KBS-KLH": 2,
      "285-W PTML-DBR": 1,
      "285-W": 8
    }
  },
  {
    "name": "Yediyurappanagara",
    "lat": 13.15099935,
    "lng": 77.55950994,
    "dailyTrips": 42,
    "routesCount": 7,
    "topRoutes": [
      "285-H",
      "285-D",
      "285-W",
      "YHKOT-MLPH",
      "285-H KBS-KLH",
      "285-H PTML-KLH",
      "407-E YLKOT-LGNH"
    ],
    "boothCodes": [
      "29150038",
      "29150039",
      "29150041"
    ],
    "routesMap": {
      "285-H": 14,
      "285-D": 13,
      "YHKOT-MLPH": 3,
      "285-H PTML-KLH": 1,
      "407-E YLKOT-LGNH": 1,
      "285-H KBS-KLH": 2,
      "285-W": 8
    }
  },
  {
    "name": "Adithi School Yelahanka",
    "lat": 13.10240691,
    "lng": 77.58297287,
    "dailyTrips": 42,
    "routesCount": 17,
    "topRoutes": [
      "KBS-ADT",
      "ADT-9",
      "ADT-1",
      "ADT-13",
      "ADT-8",
      "MADT-2",
      "ADT-3",
      "ADT-5"
    ],
    "boothCodes": [
      "29150145",
      "29150146",
      "29150158",
      "29150181",
      "29150147",
      "29150177",
      "29150180",
      "29150182",
      "29150186",
      "29150187",
      "29150189"
    ],
    "routesMap": {
      "KBS-VSD-NGV": 1,
      "ADT-1": 3,
      "ADT-13": 3,
      "ADT-8": 3,
      "MADT-2": 3,
      "ADT-3": 3,
      "ADT-9": 4,
      "ADT-5": 3,
      "ADT-14": 3,
      "CS-ADT-BLC": 3,
      "ADITI Aditional": 1,
      "ADITHI-04": 2,
      "ADITI-10": 3,
      "ADITI-4": 0,
      "ADITI-1": 2,
      "MALYAADT-11": 0,
      "KBS-ADT": 5
    }
  },
  {
    "name": "Pillahalli",
    "lat": 13.10279338,
    "lng": 77.4289908,
    "dailyTrips": 40,
    "routesCount": 5,
    "topRoutes": [
      "255-C",
      "258-AB",
      "248-Y",
      "248-Y D31G-PLH",
      "255-C YTTMC-PLH"
    ],
    "boothCodes": [
      "29150256",
      "29150092",
      "29150257"
    ],
    "routesMap": {
      "248-Y": 8,
      "248-Y D31G-PLH": 1,
      "258-AB": 12,
      "255-C": 18,
      "255-C YTTMC-PLH": 1
    }
  },
  {
    "name": "BIES Kuduregere",
    "lat": 13.06248518,
    "lng": 77.46973872,
    "dailyTrips": 40,
    "routesCount": 1,
    "topRoutes": [
      "MF-27"
    ],
    "boothCodes": [
      "29150324",
      "29150281",
      "29150288",
      "29150289",
      "29150290",
      "29150291",
      "29150292"
    ],
    "routesMap": {
      "MF-27": 40
    }
  },
  {
    "name": "Seethakempanahalli Byatha Road",
    "lat": 13.16883303,
    "lng": 77.52107084,
    "dailyTrips": 40,
    "routesCount": 1,
    "topRoutes": [
      "251-B"
    ],
    "boothCodes": [
      "29150032",
      "29150035"
    ],
    "routesMap": {
      "251-B": 40
    }
  },
  {
    "name": "Karekalpalya",
    "lat": 13.06995142,
    "lng": 77.40216788,
    "dailyTrips": 39,
    "routesCount": 8,
    "topRoutes": [
      "245-H",
      "258-F",
      "242-JK",
      "D35G-KKP",
      "258-F KMT-SVP",
      "245-H NML-D35G",
      "258-F ASK-SVP",
      "245-H MRTG-NML"
    ],
    "boothCodes": [
      "29150315"
    ],
    "routesMap": {
      "242-JK": 7,
      "D35G-KKP": 1,
      "258-F": 11,
      "258-F KMT-SVP": 1,
      "245-H NML-D35G": 1,
      "258-F ASK-SVP": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1
    }
  },
  {
    "name": "Ravuthanahalli",
    "lat": 13.02664672,
    "lng": 77.42385224,
    "dailyTrips": 39,
    "routesCount": 9,
    "topRoutes": [
      "245-H",
      "245-K",
      "245-F",
      "336-B SNBS-KMP",
      "CLO-AVH",
      "245-H NML-D35G",
      "257-C ASK-RVT",
      "256-D KBS-RVT"
    ],
    "boothCodes": [
      "29150335"
    ],
    "routesMap": {
      "CLO-AVH": 1,
      "245-K": 8,
      "336-B SNBS-KMP": 2,
      "245-F": 8,
      "245-H NML-D35G": 1,
      "257-C ASK-RVT": 1,
      "256-D KBS-RVT": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1
    }
  },
  {
    "name": "Yelahanka RTO Office",
    "lat": 13.15115667,
    "lng": 77.55615086,
    "dailyTrips": 39,
    "routesCount": 6,
    "topRoutes": [
      "285-H",
      "285-D",
      "285-W",
      "285-H KBS-KLH",
      "285-H PTML-KLH",
      "407-E YLKOT-LGNH"
    ],
    "boothCodes": [
      "29150037",
      "29150038",
      "29150039",
      "29150041"
    ],
    "routesMap": {
      "285-H": 14,
      "285-D": 13,
      "285-H PTML-KLH": 1,
      "407-E YLKOT-LGNH": 1,
      "285-H KBS-KLH": 2,
      "285-W": 8
    }
  },
  {
    "name": "Chamundinagara Kittanahalli",
    "lat": 13.01470522,
    "lng": 77.42038463,
    "dailyTrips": 38,
    "routesCount": 7,
    "topRoutes": [
      "245-H",
      "245-K",
      "245-F",
      "336-B SNBS-KMP",
      "245-R KBS-DJP",
      "CLO-AVH",
      "245-H MRTG-NML"
    ],
    "boothCodes": [
      "29150342",
      "29150335",
      "29150341"
    ],
    "routesMap": {
      "CLO-AVH": 1,
      "245-K": 8,
      "336-B SNBS-KMP": 2,
      "245-F": 8,
      "245-R KBS-DJP": 2,
      "245-H": 16,
      "245-H MRTG-NML": 1
    }
  },
  {
    "name": "Linganahalli",
    "lat": 13.15811748,
    "lng": 77.52390057,
    "dailyTrips": 38,
    "routesCount": 7,
    "topRoutes": [
      "266-C",
      "285-RC",
      "253-LA",
      "YHKOT-HSG",
      "266-C BMT45-KKL",
      "253-LA PTML-HGV",
      "285-RC PTML-HGV"
    ],
    "boothCodes": [
      "29150032",
      "29150034"
    ],
    "routesMap": {
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "266-C": 14,
      "253-LA": 8,
      "253-LA PTML-HGV": 1,
      "285-RC PTML-HGV": 1,
      "266-C BMT45-KKL": 2
    }
  },
  {
    "name": "Thotagere Village Hesaraghatta Road",
    "lat": 13.13611846,
    "lng": 77.4459824,
    "dailyTrips": 37,
    "routesCount": 8,
    "topRoutes": [
      "253-E",
      "407-F",
      "253-V",
      "PSS-TGV",
      "507-C YPRS-KRPG",
      "PSS-RGH",
      "253-E YTTMC-RGHL",
      "HSG-NMG 407"
    ],
    "boothCodes": [
      "29150073"
    ],
    "routesMap": {
      "PSS-TGV": 3,
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "253-V": 6,
      "PSS-RGH": 1,
      "253-E": 15,
      "253-E YTTMC-RGHL": 1,
      "HSG-NMG 407": 1
    }
  },
  {
    "name": "Byatha Madhure Temple",
    "lat": 13.19304623,
    "lng": 77.48454482,
    "dailyTrips": 37,
    "routesCount": 5,
    "topRoutes": [
      "407-B",
      "253-A",
      "253-L",
      "253-A BMT45-LKPC-BYT",
      "D10G-RCH"
    ],
    "boothCodes": [
      "29150017",
      "29150009",
      "29150018"
    ],
    "routesMap": {
      "253-A": 12,
      "253-L": 6,
      "D10G-RCH": 2,
      "407-B": 14,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "Ananthapura Gate Yelahanka",
    "lat": 13.1147044,
    "lng": 77.57867396,
    "dailyTrips": 37,
    "routesCount": 4,
    "topRoutes": [
      "285-B",
      "234-E GOODSHED",
      "KBS-MVL",
      "KMT-MVL"
    ],
    "boothCodes": [
      "29150101",
      "29150140",
      "29150046",
      "29150080",
      "29150141",
      "29150142",
      "29150143",
      "29150139"
    ],
    "routesMap": {
      "234-E GOODSHED": 9,
      "285-B": 26,
      "KBS-MVL": 1,
      "KMT-MVL": 1
    }
  },
  {
    "name": "Shanthinagara Ravuthanahalli",
    "lat": 13.01987163,
    "lng": 77.42182346,
    "dailyTrips": 36,
    "routesCount": 6,
    "topRoutes": [
      "245-H",
      "245-K",
      "245-F",
      "336-B SNBS-KMP",
      "CLO-AVH",
      "245-H MRTG-NML"
    ],
    "boothCodes": [
      "29150342",
      "29150335"
    ],
    "routesMap": {
      "CLO-AVH": 1,
      "245-K": 8,
      "336-B SNBS-KMP": 2,
      "245-F": 8,
      "245-H": 16,
      "245-H MRTG-NML": 1
    }
  },
  {
    "name": "Narasipura Mattahalli",
    "lat": 13.10985122,
    "lng": 77.46350604,
    "dailyTrips": 35,
    "routesCount": 6,
    "topRoutes": [
      "255-E",
      "255-H",
      "255-E KBS-NSP",
      "255-E BMT40C-NSP",
      "255-E JHC-NSP",
      "255H DSP-GDP"
    ],
    "boothCodes": [
      "29150094",
      "29150095"
    ],
    "routesMap": {
      "255-E": 22,
      "255-H": 6,
      "255-E KBS-NSP": 3,
      "255-E JHC-NSP": 1,
      "255-E BMT40C-NSP": 2,
      "255H DSP-GDP": 1
    }
  },
  {
    "name": "Raghavendra Dhama Byalakere",
    "lat": 13.11460447,
    "lng": 77.51465566,
    "dailyTrips": 35,
    "routesCount": 5,
    "topRoutes": [
      "290-QA",
      "254-C",
      "KBS-KTH",
      "YTTMC-DBLK",
      "PSS-KTH"
    ],
    "boothCodes": [
      "29150100",
      "29150055",
      "29150089",
      "29150086",
      "29150088",
      "29150099"
    ],
    "routesMap": {
      "290-QA": 18,
      "YTTMC-DBLK": 1,
      "PSS-KTH": 1,
      "KBS-KTH": 4,
      "254-C": 11
    }
  },
  {
    "name": "Ittagalpura",
    "lat": 13.1746639,
    "lng": 77.54258216,
    "dailyTrips": 35,
    "routesCount": 7,
    "topRoutes": [
      "285-V",
      "285-RC",
      "YHKOT-HSG",
      "285V YHK-SNH",
      "285-R RJK-CHL",
      "285-X NES-DBR",
      "285-RC PTML-HGV"
    ],
    "boothCodes": [
      "29150021",
      "29150031"
    ],
    "routesMap": {
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "285-V": 18,
      "285-R RJK-CHL": 1,
      "285-X NES-DBR": 1,
      "285-RC PTML-HGV": 1,
      "285V YHK-SNH": 2
    }
  },
  {
    "name": "Averahalli Ravuttanahalli",
    "lat": 13.03343105,
    "lng": 77.42183983,
    "dailyTrips": 34,
    "routesCount": 5,
    "topRoutes": [
      "245-H",
      "245-K",
      "245-F",
      "CLO-AVH",
      "245-H MRTG-NML"
    ],
    "boothCodes": [
      "29150335"
    ],
    "routesMap": {
      "CLO-AVH": 1,
      "245-K": 8,
      "245-F": 8,
      "245-H": 16,
      "245-H MRTG-NML": 1
    }
  },
  {
    "name": "Huskur Baare Hesaraghatta Road",
    "lat": 13.13696802,
    "lng": 77.43923396,
    "dailyTrips": 34,
    "routesCount": 7,
    "topRoutes": [
      "253-E",
      "407-F",
      "253-V",
      "507-C YPRS-KRPG",
      "PSS-RGH",
      "253-E YTTMC-RGHL",
      "HSG-NMG 407"
    ],
    "boothCodes": [
      "29150072",
      "29150092",
      "29150071",
      "29150073"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "253-V": 6,
      "PSS-RGH": 1,
      "253-E": 15,
      "253-E YTTMC-RGHL": 1,
      "HSG-NMG 407": 1
    }
  },
  {
    "name": "Kanakanagara Totagere",
    "lat": 13.13824464,
    "lng": 77.43473121,
    "dailyTrips": 34,
    "routesCount": 7,
    "topRoutes": [
      "253-E",
      "407-F",
      "253-V",
      "507-C YPRS-KRPG",
      "PSS-RGH",
      "253-E YTTMC-RGHL",
      "HSG-NMG 407"
    ],
    "boothCodes": [
      "29150072",
      "29150092",
      "29150071",
      "29150073"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "253-V": 6,
      "PSS-RGH": 1,
      "253-E": 15,
      "253-E YTTMC-RGHL": 1,
      "HSG-NMG 407": 1
    }
  },
  {
    "name": "Gopalapura Railway Gollahalli",
    "lat": 13.14120452,
    "lng": 77.42624268,
    "dailyTrips": 34,
    "routesCount": 7,
    "topRoutes": [
      "253-E",
      "407-F",
      "253-V",
      "507-C YPRS-KRPG",
      "PSS-RGH",
      "253-E YTTMC-RGHL",
      "HSG-NMG 407"
    ],
    "boothCodes": [
      "29150071"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "253-V": 6,
      "PSS-RGH": 1,
      "253-E": 15,
      "253-E YTTMC-RGHL": 1,
      "HSG-NMG 407": 1
    }
  },
  {
    "name": "Judicial Layout Yelahanka",
    "lat": 13.08868238,
    "lng": 77.58239352,
    "dailyTrips": 34,
    "routesCount": 5,
    "topRoutes": [
      "284-C",
      "KHC-JLO",
      "PTH-JLO",
      "CVB-JDLO",
      "285M PTMTL-JLO"
    ],
    "boothCodes": [
      "29150218",
      "29150219",
      "29150226",
      "29150204",
      "29150205",
      "29150210",
      "29150213",
      "29150215",
      "29150216",
      "29150217",
      "29150185",
      "29150214"
    ],
    "routesMap": {
      "CVB-JDLO": 2,
      "284-C": 24,
      "KHC-JLO": 4,
      "285M PTMTL-JLO": 1,
      "PTH-JLO": 3
    }
  },
  {
    "name": "Patalamma Temple Sadenahalli",
    "lat": 13.18335933,
    "lng": 77.57038582,
    "dailyTrips": 33,
    "routesCount": 24,
    "topRoutes": [
      "BMT46-PTML",
      "285-MC PTML-DBP",
      "285-K PTML-NES",
      "285-R PTMT-CHL",
      "283E PTML-THS",
      "285N PTML-THS",
      "285MA PTML-CVB",
      "285-H PTML-KLH"
    ],
    "boothCodes": [
      "29150006",
      "29150028",
      "29150029",
      "29150014"
    ],
    "routesMap": {
      "BMT46-PTML": 3,
      "285-H PTML-KLH": 1,
      "250-LA ADGH-MHC": 1,
      "285-CA PTML-JKBH": 1,
      "285-K PTML-NES": 2,
      "285-MC PTML-DBP": 3,
      "285-C PTML-DTMKR": 1,
      "285-J PTML-JLG": 1,
      "297-B PTML-DGH": 1,
      "289-K BMT46-KDYH": 1,
      "253-L PTML-HGV": 1,
      "253-LA PTML-HGV": 1,
      "285-CB PTML-KKH": 1,
      "285-RC PTML-HGV": 1,
      "283-D PTML-KDGC": 1,
      "285-R PTMT-CHL": 2,
      "285-RA PTMT-HNYR": 1,
      "283E PTML-THS": 2,
      "285-JE PTML-DYVH": 1,
      "285-W PTML-DBR": 1,
      "285N PTML-THS": 2,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "401 PTMTL-YTTMC": 1
    }
  },
  {
    "name": "Hullegowdanahalli",
    "lat": 13.06047397,
    "lng": 77.40653247,
    "dailyTrips": 31,
    "routesCount": 6,
    "topRoutes": [
      "245-H",
      "258-F",
      "258-F KMT-SVP",
      "245-H NML-D35G",
      "258-F ASK-SVP",
      "245-H MRTG-NML"
    ],
    "boothCodes": [
      "29150315",
      "29150318",
      "29150314"
    ],
    "routesMap": {
      "258-F": 11,
      "258-F KMT-SVP": 1,
      "245-H NML-D35G": 1,
      "258-F ASK-SVP": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1
    }
  },
  {
    "name": "Kenganahalli",
    "lat": 13.05159346,
    "lng": 77.41170712,
    "dailyTrips": 31,
    "routesCount": 6,
    "topRoutes": [
      "245-H",
      "258-F",
      "258-F KMT-SVP",
      "245-H NML-D35G",
      "258-F ASK-SVP",
      "245-H MRTG-NML"
    ],
    "boothCodes": [
      "29150318"
    ],
    "routesMap": {
      "258-F": 11,
      "258-F KMT-SVP": 1,
      "245-H NML-D35G": 1,
      "258-F ASK-SVP": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1
    }
  },
  {
    "name": "Kammasandra Madanayakanahalli",
    "lat": 13.03453112,
    "lng": 77.43939393,
    "dailyTrips": 31,
    "routesCount": 7,
    "topRoutes": [
      "263-R",
      "289-C",
      "245-MA",
      "245-AA",
      "KBS-MNKH",
      "D31G-KMS",
      "KDBC-MNKH"
    ],
    "boothCodes": [
      "29150313",
      "29150334"
    ],
    "routesMap": {
      "245-MA": 6,
      "245-AA": 4,
      "KBS-MNKH": 2,
      "289-C": 8,
      "263-R": 9,
      "D31G-KMS": 1,
      "KDBC-MNKH": 1
    }
  },
  {
    "name": "Lakshmipura Madanayakanahalli",
    "lat": 13.03749907,
    "lng": 77.4611774,
    "dailyTrips": 31,
    "routesCount": 6,
    "topRoutes": [
      "263-R",
      "289-C",
      "263-K",
      "MNKH-KBS",
      "263 KMT-KMS",
      "245-M MNKH-MRTG"
    ],
    "boothCodes": [
      "29150329",
      "29150328"
    ],
    "routesMap": {
      "MNKH-KBS": 4,
      "289-C": 8,
      "263-R": 9,
      "263 KMT-KMS": 1,
      "263-K": 8,
      "245-M MNKH-MRTG": 1
    }
  },
  {
    "name": "Siddana Hosahalli Madanayakanahalli",
    "lat": 13.05679639,
    "lng": 77.46015385,
    "dailyTrips": 31,
    "routesCount": 6,
    "topRoutes": [
      "263-R",
      "289-C",
      "263-K",
      "MNKH-KBS",
      "263 KMT-KMS",
      "245-M MNKH-MRTG"
    ],
    "boothCodes": [
      "29150310",
      "29150332",
      "29150293",
      "29150309",
      "29150308",
      "29150322",
      "29150324",
      "29150331",
      "29150287",
      "29150288",
      "29150289",
      "29150294",
      "29150307"
    ],
    "routesMap": {
      "MNKH-KBS": 4,
      "289-C": 8,
      "263-R": 9,
      "263 KMT-KMS": 1,
      "263-K": 8,
      "245-M MNKH-MRTG": 1
    }
  },
  {
    "name": "Dombarahalli Madanayakanahalli",
    "lat": 13.0490628,
    "lng": 77.45980541,
    "dailyTrips": 31,
    "routesCount": 6,
    "topRoutes": [
      "263-R",
      "289-C",
      "263-K",
      "MNKH-KBS",
      "263 KMT-KMS",
      "245-M MNKH-MRTG"
    ],
    "boothCodes": [
      "29150328",
      "29150332",
      "29150330",
      "29150331"
    ],
    "routesMap": {
      "MNKH-KBS": 4,
      "289-C": 8,
      "263-R": 9,
      "263 KMT-KMS": 1,
      "263-K": 8,
      "245-M MNKH-MRTG": 1
    }
  },
  {
    "name": "Rajeshwarinagara Madanayakanahalli",
    "lat": 13.04528339,
    "lng": 77.46129846,
    "dailyTrips": 31,
    "routesCount": 6,
    "topRoutes": [
      "263-R",
      "289-C",
      "263-K",
      "MNKH-KBS",
      "263 KMT-KMS",
      "245-M MNKH-MRTG"
    ],
    "boothCodes": [
      "29150328",
      "29150332",
      "29150327",
      "29150330",
      "29150331"
    ],
    "routesMap": {
      "MNKH-KBS": 4,
      "289-C": 8,
      "263-R": 9,
      "263 KMT-KMS": 1,
      "263-K": 8,
      "245-M MNKH-MRTG": 1
    }
  },
  {
    "name": "Dibburu Madhure Temple Road",
    "lat": 13.17382428,
    "lng": 77.53003424,
    "dailyTrips": 31,
    "routesCount": 5,
    "topRoutes": [
      "407-B",
      "285-Y",
      "407-C",
      "D10G-RCH",
      "253-L PTML-HGV"
    ],
    "boothCodes": [
      "29150032",
      "29150033",
      "29150021"
    ],
    "routesMap": {
      "D10G-RCH": 2,
      "407-C": 6,
      "407-B": 14,
      "253-L PTML-HGV": 1,
      "285-Y": 8
    }
  },
  {
    "name": "CRPF Yelahanka",
    "lat": 13.12303806,
    "lng": 77.57549666,
    "dailyTrips": 31,
    "routesCount": 17,
    "topRoutes": [
      "250-LA",
      "GITAM-YHK-HBL-KRP",
      "CRPF-KBS",
      "285-K PTML-NES",
      "283E PTML-THS",
      "285MA PTML-CVB",
      "SGH-YHK-HBL-CSB",
      "285-JB THDL-KBS"
    ],
    "boothCodes": [
      "29150049",
      "29150079",
      "29150080",
      "29150142",
      "29150081"
    ],
    "routesMap": {
      "SGH-YHK-HBL-CSB": 1,
      "285-JB THDL-KBS": 1,
      "401A BMSIT-PSS": 1,
      "BMSIT-PTH-YHK": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "285-K PTML-NES": 2,
      "297-B PTML-DGH": 1,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "283E PTML-THS": 2,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "401 PTMTL-YTTMC": 1,
      "401-BJ BMSITY-BGLR": 1,
      "GITAM-YHK-HBL-KRP": 5,
      "CRPF-KBS": 3
    }
  },
  {
    "name": "Allalasandra Yelahanka",
    "lat": 13.08737154,
    "lng": 77.59556718,
    "dailyTrips": 31,
    "routesCount": 5,
    "topRoutes": [
      "V-500DA",
      "380 KMT-KTO",
      "CRPF-KBS",
      "YSTF-ITPL",
      "V-500DA YSTF-ELCW"
    ],
    "boothCodes": [
      "29150194",
      "29150206",
      "29150207",
      "29150212",
      "29150184"
    ],
    "routesMap": {
      "YSTF-ITPL": 2,
      "380 KMT-KTO": 6,
      "V-500DA": 19,
      "V-500DA YSTF-ELCW": 1,
      "CRPF-KBS": 3
    }
  },
  {
    "name": "Chikka Veeraiahanapalya Cross",
    "lat": 13.11427191,
    "lng": 77.43147719,
    "dailyTrips": 30,
    "routesCount": 5,
    "topRoutes": [
      "255-D",
      "255-A",
      "255-A ADK-HSK",
      "255-A YTTMC-HKV",
      "255-D JHC-HSK"
    ],
    "boothCodes": [
      "29150256",
      "29150092",
      "29150257"
    ],
    "routesMap": {
      "255-D": 15,
      "255-A": 11,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-D JHC-HSK": 1
    }
  },
  {
    "name": "Huskur Village Makali",
    "lat": 13.123279,
    "lng": 77.43096309,
    "dailyTrips": 30,
    "routesCount": 5,
    "topRoutes": [
      "255-D",
      "255-A",
      "255-A ADK-HSK",
      "255-A YTTMC-HKV",
      "255-D JHC-HSK"
    ],
    "boothCodes": [
      "29150092"
    ],
    "routesMap": {
      "255-D": 15,
      "255-A": 11,
      "255-A YTTMC-HKV": 1,
      "255-A ADK-HSK": 2,
      "255-D JHC-HSK": 1
    }
  },
  {
    "name": "Mylappanahalli",
    "lat": 13.13696237,
    "lng": 77.5349164,
    "dailyTrips": 30,
    "routesCount": 4,
    "topRoutes": [
      "266-K",
      "266-B",
      "YHKOT-MLPH",
      "266-N KMT-MLPH"
    ],
    "boothCodes": [
      "29150050",
      "29150037"
    ],
    "routesMap": {
      "YHKOT-MLPH": 3,
      "266-B": 12,
      "266-K": 13,
      "266-N KMT-MLPH": 2
    }
  },
  {
    "name": "KG Lakkenahalli",
    "lat": 13.0258424,
    "lng": 77.45954848,
    "dailyTrips": 28,
    "routesCount": 1,
    "topRoutes": [
      "61-C"
    ],
    "boothCodes": [
      "29150329",
      "29150344",
      "29150348"
    ],
    "routesMap": {
      "61-C": 28
    }
  },
  {
    "name": "Nagarajuna College Ananthapura",
    "lat": 13.11722272,
    "lng": 77.56132711,
    "dailyTrips": 28,
    "routesCount": 3,
    "topRoutes": [
      "285-B",
      "KBS-MVL",
      "KMT-MVL"
    ],
    "boothCodes": [
      "29150084",
      "29150085",
      "29150047",
      "29150048",
      "29150049"
    ],
    "routesMap": {
      "285-B": 26,
      "KBS-MVL": 1,
      "KMT-MVL": 1
    }
  },
  {
    "name": "Ramagondanahalli Yelahanka",
    "lat": 13.11935936,
    "lng": 77.55857699,
    "dailyTrips": 28,
    "routesCount": 3,
    "topRoutes": [
      "285-B",
      "KBS-MVL",
      "KMT-MVL"
    ],
    "boothCodes": [
      "29150084",
      "29150085",
      "29150049"
    ],
    "routesMap": {
      "285-B": 26,
      "KBS-MVL": 1,
      "KMT-MVL": 1
    }
  },
  {
    "name": "Nagenahalli Gate Yelahanka",
    "lat": 13.12997044,
    "lng": 77.57146366,
    "dailyTrips": 28,
    "routesCount": 16,
    "topRoutes": [
      "250-LA",
      "GITAM-YHK-HBL-KRP",
      "285-K PTML-NES",
      "283E PTML-THS",
      "285MA PTML-CVB",
      "SGH-YHK-HBL-CSB",
      "285-JB THDL-KBS",
      "401A BMSIT-PSS"
    ],
    "boothCodes": [
      "29150045",
      "29150079",
      "29150077",
      "29150078",
      "29150082",
      "29150083"
    ],
    "routesMap": {
      "SGH-YHK-HBL-CSB": 1,
      "285-JB THDL-KBS": 1,
      "401A BMSIT-PSS": 1,
      "BMSIT-PTH-YHK": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "285-K PTML-NES": 2,
      "297-B PTML-DGH": 1,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "283E PTML-THS": 2,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "401 PTMTL-YTTMC": 1,
      "401-BJ BMSITY-BGLR": 1,
      "GITAM-YHK-HBL-KRP": 5
    }
  },
  {
    "name": "Shivanapura",
    "lat": 13.04432291,
    "lng": 77.42604353,
    "dailyTrips": 27,
    "routesCount": 7,
    "topRoutes": [
      "258-F",
      "304-VA",
      "256 KBS-SVNC",
      "258-F KMT-SVP",
      "256-K BMT43-SVP",
      "258-F ASK-SVP",
      "304-VA TNF-SVP"
    ],
    "boothCodes": [
      "29150317",
      "29150318",
      "29150313"
    ],
    "routesMap": {
      "258-F": 11,
      "256 KBS-SVNC": 3,
      "258-F KMT-SVP": 1,
      "304-VA": 9,
      "256-K BMT43-SVP": 1,
      "258-F ASK-SVP": 1,
      "304-VA TNF-SVP": 1
    }
  },
  {
    "name": "Design Global Mavallipura",
    "lat": 13.13122526,
    "lng": 77.53094826,
    "dailyTrips": 27,
    "routesCount": 3,
    "topRoutes": [
      "266-K",
      "266-B",
      "266-N KMT-MLPH"
    ],
    "boothCodes": [
      "29150053",
      "29150050",
      "29150037"
    ],
    "routesMap": {
      "266-B": 12,
      "266-K": 13,
      "266-N KMT-MLPH": 2
    }
  },
  {
    "name": "Honnenahalli Rajanukunte",
    "lat": 13.15979105,
    "lng": 77.56661545,
    "dailyTrips": 26,
    "routesCount": 14,
    "topRoutes": [
      "250-LA",
      "GITAM-YHK-HBL-KRP",
      "285-K PTML-NES",
      "283E PTML-THS",
      "285MA PTML-CVB",
      "285-JB THDL-KBS",
      "285-H PTML-KLH",
      "250-LA ADGH-MHC"
    ],
    "boothCodes": [
      "29150041",
      "29150024",
      "29150040",
      "29150030"
    ],
    "routesMap": {
      "285-JB THDL-KBS": 1,
      "285-H PTML-KLH": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "285-K PTML-NES": 2,
      "297-B PTML-DGH": 1,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "283E PTML-THS": 2,
      "285-W PTML-DBR": 1,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "401 PTMTL-YTTMC": 1,
      "GITAM-YHK-HBL-KRP": 5
    }
  },
  {
    "name": "Shanubhoganahalli Dibburu",
    "lat": 13.17915229,
    "lng": 77.53129343,
    "dailyTrips": 25,
    "routesCount": 4,
    "topRoutes": [
      "407-B",
      "285-Y",
      "D10G-RCH",
      "253-LA PTML-HGV"
    ],
    "boothCodes": [
      "29150033",
      "29150021"
    ],
    "routesMap": {
      "D10G-RCH": 2,
      "407-B": 14,
      "253-LA PTML-HGV": 1,
      "285-Y": 8
    }
  },
  {
    "name": "Doddabettahalli Vidyaranyapura",
    "lat": 13.09407066,
    "lng": 77.55461723,
    "dailyTrips": 25,
    "routesCount": 3,
    "topRoutes": [
      "276-AB",
      "401-B YTTMC-DBH",
      "276-AB BMT45-DBH"
    ],
    "boothCodes": [
      "29150235",
      "29150228",
      "29150232",
      "29150233",
      "29150234",
      "29150238",
      "29150227",
      "29150229",
      "29150230",
      "29150231"
    ],
    "routesMap": {
      "276-AB": 22,
      "401-B YTTMC-DBH": 2,
      "276-AB BMT45-DBH": 1
    }
  },
  {
    "name": "Singanayakanahalli Rajanukunte",
    "lat": 13.14757366,
    "lng": 77.56978204,
    "dailyTrips": 25,
    "routesCount": 13,
    "topRoutes": [
      "250-LA",
      "GITAM-YHK-HBL-KRP",
      "285-K PTML-NES",
      "283E PTML-THS",
      "285MA PTML-CVB",
      "SGH-YHK-HBL-CSB",
      "285-JB THDL-KBS",
      "250-LA ADGH-MHC"
    ],
    "boothCodes": [
      "29150038",
      "29150039",
      "29150040"
    ],
    "routesMap": {
      "SGH-YHK-HBL-CSB": 1,
      "285-JB THDL-KBS": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "285-K PTML-NES": 2,
      "297-B PTML-DGH": 1,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "283E PTML-THS": 2,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "401 PTMTL-YTTMC": 1,
      "GITAM-YHK-HBL-KRP": 5
    }
  },
  {
    "name": "Avalahalli Rajanukunte",
    "lat": 13.13520502,
    "lng": 77.56920107,
    "dailyTrips": 25,
    "routesCount": 13,
    "topRoutes": [
      "250-LA",
      "GITAM-YHK-HBL-KRP",
      "285-K PTML-NES",
      "283E PTML-THS",
      "285MA PTML-CVB",
      "SGH-YHK-HBL-CSB",
      "285-JB THDL-KBS",
      "250-LA ADGH-MHC"
    ],
    "boothCodes": [
      "29150044",
      "29150045",
      "29150079",
      "29150077",
      "29150082"
    ],
    "routesMap": {
      "SGH-YHK-HBL-CSB": 1,
      "285-JB THDL-KBS": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "285-K PTML-NES": 2,
      "297-B PTML-DGH": 1,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "283E PTML-THS": 2,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "401 PTMTL-YTTMC": 1,
      "GITAM-YHK-HBL-KRP": 5
    }
  },
  {
    "name": "Yelahanka Raitarasanthe",
    "lat": 13.09758245,
    "lng": 77.5989186,
    "dailyTrips": 25,
    "routesCount": 4,
    "topRoutes": [
      "V-500DA",
      "CRPF-KBS",
      "YSTF-ITPL",
      "V-500DA YSTF-ELCW"
    ],
    "boothCodes": [
      "29150194",
      "29150174",
      "29150184",
      "29150195",
      "29150196",
      "29150197",
      "29150198",
      "29150200",
      "29150201",
      "29150202",
      "29150203",
      "29150175",
      "29150190",
      "29150191",
      "29150192"
    ],
    "routesMap": {
      "YSTF-ITPL": 2,
      "V-500DA": 19,
      "V-500DA YSTF-ELCW": 1,
      "CRPF-KBS": 3
    }
  },
  {
    "name": "Thotada Guddadahalli Govt School",
    "lat": 13.06999884,
    "lng": 77.48689681,
    "dailyTrips": 24,
    "routesCount": 2,
    "topRoutes": [
      "250-DA",
      "250SA KDG-ASK"
    ],
    "boothCodes": [
      "29150295",
      "29150297",
      "29150298",
      "29150300",
      "29150296"
    ],
    "routesMap": {
      "250-DA": 23,
      "250SA KDG-ASK": 1
    }
  },
  {
    "name": "Vinayakanagara MS Palya",
    "lat": 13.08258195,
    "lng": 77.54329562,
    "dailyTrips": 24,
    "routesCount": 3,
    "topRoutes": [
      "272-E",
      "RNBL-KBS",
      "272-E BMT45-SBS"
    ],
    "boothCodes": [
      "29150237",
      "29150242"
    ],
    "routesMap": {
      "RNBL-KBS": 2,
      "272-E": 20,
      "272-E BMT45-SBS": 2
    }
  },
  {
    "name": "RJNK",
    "lat": 13.17221317,
    "lng": 77.56444474,
    "dailyTrips": 24,
    "routesCount": 12,
    "topRoutes": [
      "250-LA",
      "GITAM-YHK-HBL-KRP",
      "285-K PTML-NES",
      "283E PTML-THS",
      "285MA PTML-CVB",
      "285-JB THDL-KBS",
      "250-LA ADGH-MHC",
      "289-K BMT46-KDYH"
    ],
    "boothCodes": [
      "29150023",
      "29150024",
      "29150025",
      "29150026",
      "29150027",
      "29150028",
      "29150029",
      "29150030"
    ],
    "routesMap": {
      "285-JB THDL-KBS": 1,
      "250-LA": 6,
      "250-LA ADGH-MHC": 1,
      "285-K PTML-NES": 2,
      "289-K BMT46-KDYH": 1,
      "283-D PTML-KDGC": 1,
      "283E PTML-THS": 2,
      "285-W PTML-DBR": 1,
      "285MA PTML-CVB": 2,
      "285M PTMTL-JLO": 1,
      "401 PTMTL-YTTMC": 1,
      "GITAM-YHK-HBL-KRP": 5
    }
  },
  {
    "name": "Maragondanahalli",
    "lat": 13.20632243,
    "lng": 77.56285966,
    "dailyTrips": 24,
    "routesCount": 3,
    "topRoutes": [
      "313-A",
      "KMT-MGH-GLH",
      "10-J D16G-KBS"
    ],
    "boothCodes": [
      "29150012",
      "29150013"
    ],
    "routesMap": {
      "KMT-MGH-GLH": 3,
      "313-A": 19,
      "10-J D16G-KBS": 2
    }
  },
  {
    "name": "Channanayakanapalya",
    "lat": 13.04427586,
    "lng": 77.4851802,
    "dailyTrips": 23,
    "routesCount": 1,
    "topRoutes": [
      "263-E"
    ],
    "boothCodes": [
      "29150325",
      "29150271",
      "29150273",
      "29150277"
    ],
    "routesMap": {
      "263-E": 23
    }
  },
  {
    "name": "Puttenahalli Yelahanka",
    "lat": 13.10991478,
    "lng": 77.58012906,
    "dailyTrips": 23,
    "routesCount": 7,
    "topRoutes": [
      "NITT-2",
      "BELGS-29",
      "VNS-15",
      "SHS-11",
      "BTP-24",
      "GITAM-1",
      "VCS-ORRCA-106 SNH-ORRCA Salarpuria Soft Zone"
    ],
    "boothCodes": [
      "29150140",
      "29150146",
      "29150152",
      "29150157",
      "29150158",
      "29150159",
      "29150141",
      "29150160",
      "29150161",
      "29150147",
      "29150139"
    ],
    "routesMap": {
      "SHS-11": 2,
      "BELGS-29": 4,
      "VNS-15": 4,
      "BTP-24": 2,
      "NITT-2": 8,
      "VCS-ORRCA-106 SNH-ORRCA Salarpuria Soft Zone": 1,
      "GITAM-1": 2
    }
  },
  {
    "name": "Kamadhenu Kshetra Vaddarahalli",
    "lat": 13.02534364,
    "lng": 77.44980756,
    "dailyTrips": 22,
    "routesCount": 6,
    "topRoutes": [
      "289-C",
      "245-MA",
      "245-AA",
      "KBS-MNKH",
      "D31G-KMS",
      "KDBC-MNKH"
    ],
    "boothCodes": [
      "29150343",
      "29150358",
      "29150334",
      "29150329",
      "29150333",
      "29150348"
    ],
    "routesMap": {
      "245-MA": 6,
      "245-AA": 4,
      "KBS-MNKH": 2,
      "289-C": 8,
      "D31G-KMS": 1,
      "KDBC-MNKH": 1
    }
  },
  {
    "name": "Kammasandrapalya",
    "lat": 13.02985109,
    "lng": 77.43901508,
    "dailyTrips": 22,
    "routesCount": 6,
    "topRoutes": [
      "289-C",
      "245-MA",
      "245-AA",
      "KBS-MNKH",
      "D31G-KMS",
      "KDBC-MNKH"
    ],
    "boothCodes": [
      "29150334"
    ],
    "routesMap": {
      "245-MA": 6,
      "245-AA": 4,
      "KBS-MNKH": 2,
      "289-C": 8,
      "D31G-KMS": 1,
      "KDBC-MNKH": 1
    }
  },
  {
    "name": "Kalpalya Aluru",
    "lat": 13.10165016,
    "lng": 77.47198334,
    "dailyTrips": 22,
    "routesCount": 3,
    "topRoutes": [
      "255-L",
      "502-HE",
      "KBS-MTH"
    ],
    "boothCodes": [
      "29150254",
      "29150268",
      "29150095",
      "29150062",
      "29150253"
    ],
    "routesMap": {
      "502-HE": 7,
      "255-L": 12,
      "KBS-MTH": 3
    }
  },
  {
    "name": "Haniyuru Gowdahalli",
    "lat": 13.21322394,
    "lng": 77.51452088,
    "dailyTrips": 22,
    "routesCount": 4,
    "topRoutes": [
      "285-RA",
      "253-L",
      "285-RA NES-HNYR",
      "285-RA PTMT-HNYR"
    ],
    "boothCodes": [
      "29150001",
      "29150007"
    ],
    "routesMap": {
      "253-L": 6,
      "285-RA": 13,
      "285-RA NES-HNYR": 2,
      "285-RA PTMT-HNYR": 1
    }
  },
  {
    "name": "Papabhovipalya",
    "lat": 13.06567278,
    "lng": 77.40413725,
    "dailyTrips": 21,
    "routesCount": 2,
    "topRoutes": [
      "258-A",
      "258-A KBS-MNH"
    ],
    "boothCodes": [
      "29150315",
      "29150314"
    ],
    "routesMap": {
      "258-A": 18,
      "258-A KBS-MNH": 3
    }
  },
  {
    "name": "Ganesha Circle Kammasandra",
    "lat": 13.02569838,
    "lng": 77.45497001,
    "dailyTrips": 21,
    "routesCount": 7,
    "topRoutes": [
      "289-C",
      "245-AA",
      "MNKH-KBS",
      "KBS-MNKH",
      "D31G-KMS",
      "245-M MNKH-MRTG",
      "KDBC-MNKH"
    ],
    "boothCodes": [
      "29150358",
      "29150329",
      "29150344",
      "29150348"
    ],
    "routesMap": {
      "245-AA": 4,
      "KBS-MNKH": 2,
      "MNKH-KBS": 4,
      "289-C": 8,
      "D31G-KMS": 1,
      "245-M MNKH-MRTG": 1,
      "KDBC-MNKH": 1
    }
  },
  {
    "name": "Veeraiah Enclave Arishinakunte",
    "lat": 13.07407596,
    "lng": 77.42321916,
    "dailyTrips": 21,
    "routesCount": 7,
    "topRoutes": [
      "256-B",
      "256 KBS-SVNC",
      "256-B YTTMC-GJDH",
      "256-MA VNC-TRHH",
      "258-X VNC-MTNT",
      "256 YTTMC-VNC",
      "255-AC VNC-VDH"
    ],
    "boothCodes": [
      "29150262",
      "29150263"
    ],
    "routesMap": {
      "258-X VNC-MTNT": 1,
      "256 KBS-SVNC": 3,
      "256-B YTTMC-GJDH": 2,
      "256 YTTMC-VNC": 1,
      "256-B": 11,
      "256-MA VNC-TRHH": 2,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "Thore Nagasandra",
    "lat": 13.11457117,
    "lng": 77.47467868,
    "dailyTrips": 21,
    "routesCount": 4,
    "topRoutes": [
      "253-D",
      "TNS-PSS",
      "KBS-TNS",
      "PSS-TRN"
    ],
    "boothCodes": [
      "29150090",
      "29150062"
    ],
    "routesMap": {
      "PSS-TRN": 1,
      "KBS-TNS": 2,
      "TNS-PSS": 5,
      "253-D": 13
    }
  },
  {
    "name": "Muniswamappa Layout",
    "lat": 13.04399563,
    "lng": 77.49057546,
    "dailyTrips": 21,
    "routesCount": 2,
    "topRoutes": [
      "502-HB",
      "256-C"
    ],
    "boothCodes": [
      "29150273",
      "29150277"
    ],
    "routesMap": {
      "256-C": 2,
      "502-HB": 19
    }
  },
  {
    "name": "Channasandra Haniyuru",
    "lat": 13.2006244,
    "lng": 77.50809321,
    "dailyTrips": 21,
    "routesCount": 4,
    "topRoutes": [
      "285-R",
      "285-R NES-CHL",
      "285-R PTMT-CHL",
      "285-R RJK-CHL"
    ],
    "boothCodes": [
      "29150001",
      "29150019",
      "29150016"
    ],
    "routesMap": {
      "285-R RJK-CHL": 1,
      "285-R": 16,
      "285-R NES-CHL": 2,
      "285-R PTMT-CHL": 2
    }
  },
  {
    "name": "Sasuveghatta",
    "lat": 13.08469563,
    "lng": 77.47534119,
    "dailyTrips": 20,
    "routesCount": 4,
    "topRoutes": [
      "250-SB",
      "KBS-SVG",
      "PSS-SVG",
      "SVG-ARC-PSS"
    ],
    "boothCodes": [
      "29150254",
      "29150279",
      "29150280",
      "29150299"
    ],
    "routesMap": {
      "KBS-SVG": 3,
      "PSS-SVG": 2,
      "250-SB": 14,
      "SVG-ARC-PSS": 1
    }
  },
  {
    "name": "Kempapura Soladevanahalli",
    "lat": 13.09469048,
    "lng": 77.49958796,
    "dailyTrips": 20,
    "routesCount": 3,
    "topRoutes": [
      "254-D",
      "254-E",
      "PSS-KMP"
    ],
    "boothCodes": [
      "29150251"
    ],
    "routesMap": {
      "PSS-KMP": 1,
      "254-D": 10,
      "254-E": 9
    }
  },
  {
    "name": "Agarawal EYE Hospital Yelahanka",
    "lat": 13.09441256,
    "lng": 77.58061185,
    "dailyTrips": 20,
    "routesCount": 5,
    "topRoutes": [
      "BMSIT-8",
      "BMSIT-8A",
      "YNTAEH-BMSITY",
      "401-B YNTAEH-YTTMC",
      "402 NES-YNTAEH"
    ],
    "boothCodes": [
      "29150218",
      "29150222",
      "29150179",
      "29150181",
      "29150219",
      "29150220",
      "29150221",
      "29150223",
      "29150224",
      "29150225",
      "29150226",
      "29150205",
      "29150213",
      "29150215",
      "29150216",
      "29150176",
      "29150177",
      "29150178",
      "29150180",
      "29150182",
      "29150185",
      "29150189",
      "29150214"
    ],
    "routesMap": {
      "BMSIT-8": 6,
      "BMSIT-8A": 6,
      "YNTAEH-BMSITY": 4,
      "401-B YNTAEH-YTTMC": 3,
      "402 NES-YNTAEH": 1
    }
  },
  {
    "name": "Harohalli Doddaballapura Road",
    "lat": 13.13060987,
    "lng": 77.58027255,
    "dailyTrips": 20,
    "routesCount": 3,
    "topRoutes": [
      "285-A",
      "YHK-NITT",
      "285-A KBS-NDH"
    ],
    "boothCodes": [
      "29150079",
      "29150077",
      "29150078",
      "29150082",
      "29150083"
    ],
    "routesMap": {
      "285-A": 12,
      "285-A KBS-NDH": 1,
      "YHK-NITT": 7
    }
  },
  {
    "name": "Gantaganahalli",
    "lat": 13.14409372,
    "lng": 77.589496,
    "dailyTrips": 20,
    "routesCount": 3,
    "topRoutes": [
      "285-A",
      "YHK-NITT",
      "285-A KBS-NDH"
    ],
    "boothCodes": [
      "29150043"
    ],
    "routesMap": {
      "285-A": 12,
      "285-A KBS-NDH": 1,
      "YHK-NITT": 7
    }
  },
  {
    "name": "Kumbarahalli Tarabanahalli",
    "lat": 13.10655534,
    "lng": 77.49023281,
    "dailyTrips": 19,
    "routesCount": 3,
    "topRoutes": [
      "254-D",
      "254-B",
      "254B KBH-DSP"
    ],
    "boothCodes": [
      "29150097",
      "29150249",
      "29150250",
      "29150252"
    ],
    "routesMap": {
      "254-D": 10,
      "254B KBH-DSP": 1,
      "254-B": 8
    }
  },
  {
    "name": "Kalathammanahalli",
    "lat": 13.10345767,
    "lng": 77.51686791,
    "dailyTrips": 19,
    "routesCount": 4,
    "topRoutes": [
      "254-C",
      "KBS-KTH",
      "KTH-KBS",
      "PSS-KTH"
    ],
    "boothCodes": [
      "29150100",
      "29150087",
      "29150247"
    ],
    "routesMap": {
      "PSS-KTH": 1,
      "KBS-KTH": 4,
      "KTH-KBS": 3,
      "254-C": 11
    }
  },
  {
    "name": "Arakere Byrapura",
    "lat": 13.20015497,
    "lng": 77.53796299,
    "dailyTrips": 19,
    "routesCount": 3,
    "topRoutes": [
      "285-RB",
      "253-LA",
      "253-LA PTML-HGV"
    ],
    "boothCodes": [
      "29150010"
    ],
    "routesMap": {
      "285-RB": 10,
      "253-LA": 8,
      "253-LA PTML-HGV": 1
    }
  },
  {
    "name": "Arathipalya",
    "lat": 13.03723832,
    "lng": 77.42592685,
    "dailyTrips": 18,
    "routesCount": 3,
    "topRoutes": [
      "245-H",
      "245-H NML-D35G",
      "245-H MRTG-NML"
    ],
    "boothCodes": [
      "29150335",
      "29150318",
      "29150313"
    ],
    "routesMap": {
      "245-H NML-D35G": 1,
      "245-H": 16,
      "245-H MRTG-NML": 1
    }
  },
  {
    "name": "Veerasagara",
    "lat": 13.10476523,
    "lng": 77.55415521,
    "dailyTrips": 18,
    "routesCount": 3,
    "topRoutes": [
      "271-E",
      "271-E KMT-VRS",
      "271-E BMT45-VRS"
    ],
    "boothCodes": [
      "29150106",
      "29150103",
      "29150105",
      "29150171",
      "29150227"
    ],
    "routesMap": {
      "271-E": 12,
      "271-E BMT45-VRS": 1,
      "271-E KMT-VRS": 5
    }
  },
  {
    "name": "Dodda Bettahalli",
    "lat": 13.09429665,
    "lng": 77.55425848,
    "dailyTrips": 18,
    "routesCount": 3,
    "topRoutes": [
      "271-E",
      "271-E KMT-VRS",
      "271-E BMT45-VRS"
    ],
    "boothCodes": [
      "29150235",
      "29150228",
      "29150232",
      "29150233",
      "29150234",
      "29150227",
      "29150229",
      "29150230",
      "29150231"
    ],
    "routesMap": {
      "271-E": 12,
      "271-E BMT45-VRS": 1,
      "271-E KMT-VRS": 5
    }
  },
  {
    "name": "BMSIT College Campous Yelahanka",
    "lat": 13.13331857,
    "lng": 77.56756157,
    "dailyTrips": 18,
    "routesCount": 11,
    "topRoutes": [
      "YHKOT-BMSIT",
      "YNTAEH-BMSITY",
      "BMSITY-RJK",
      "BCS-BMSITY",
      "SBS-RTN-BMSIT",
      "401A BMSIT-PSS",
      "KBS-HBL-BMSIT",
      "401 YTTMC-BMSIT"
    ],
    "boothCodes": [
      "29150044",
      "29150045",
      "29150079",
      "29150077"
    ],
    "routesMap": {
      "BCS-BMSITY": 1,
      "SBS-RTN-BMSIT": 1,
      "YHKOT-BMSIT": 4,
      "401A BMSIT-PSS": 1,
      "KBS-HBL-BMSIT": 1,
      "401 YTTMC-BMSIT": 1,
      "BMSIT-PTH-YHK": 1,
      "YNTAEH-BMSITY": 4,
      "BMSITY-RJK": 2,
      "401-BJ BMSITY-BGLR": 1,
      "285 YHKOT-BMSITY": 1
    }
  },
  {
    "name": "Sharavathi Hotel Yelahanka",
    "lat": 13.09772993,
    "lng": 77.58427961,
    "dailyTrips": 18,
    "routesCount": 5,
    "topRoutes": [
      "BMSIT-8",
      "BMSIT-8A",
      "VNS-15",
      "VCS-ORRCA-106 SNH-ORRCA Salarpuria Soft Zone",
      "VCS-ITPB-GM-17 YLK-5-ITPL"
    ],
    "boothCodes": [
      "29150145",
      "29150179",
      "29150181",
      "29150176",
      "29150177",
      "29150178",
      "29150180",
      "29150182",
      "29150186",
      "29150187",
      "29150188",
      "29150189"
    ],
    "routesMap": {
      "VNS-15": 4,
      "BMSIT-8": 6,
      "BMSIT-8A": 6,
      "VCS-ORRCA-106 SNH-ORRCA Salarpuria Soft Zone": 1,
      "VCS-ITPB-GM-17 YLK-5-ITPL": 1
    }
  },
  {
    "name": "Hunnigere Sondekoppa",
    "lat": 13.03259616,
    "lng": 77.39647352,
    "dailyTrips": 17,
    "routesCount": 2,
    "topRoutes": [
      "242-T",
      "258-Q"
    ],
    "boothCodes": [
      "29150336"
    ],
    "routesMap": {
      "242-T": 9,
      "258-Q": 8
    }
  },
  {
    "name": "Bethan Madhure Temple",
    "lat": 13.19008699,
    "lng": 77.48136999,
    "dailyTrips": 17,
    "routesCount": 3,
    "topRoutes": [
      "253-A",
      "253-A BMT45-LKPC-BYT",
      "D10G-RCH"
    ],
    "boothCodes": [
      "29150017",
      "29150018"
    ],
    "routesMap": {
      "253-A": 12,
      "D10G-RCH": 2,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "Malya Adhithi School",
    "lat": 13.10166369,
    "lng": 77.58297622,
    "dailyTrips": 17,
    "routesCount": 10,
    "topRoutes": [
      "YSTF-MADT",
      "KBS-YST-ADT",
      "PTH-MADT",
      "ADT-IAF",
      "ADT-BMH",
      "ADT-NMG",
      "MADT-ALS",
      "PTH-MADTL"
    ],
    "boothCodes": [
      "29150145",
      "29150146",
      "29150158",
      "29150181",
      "29150147",
      "29150177",
      "29150178",
      "29150180",
      "29150182",
      "29150186",
      "29150187",
      "29150189"
    ],
    "routesMap": {
      "PTH-MADT": 1,
      "ADT-IAF": 1,
      "KBS-YST-ADT": 4,
      "ADT-BMH": 1,
      "ADT-NMG": 1,
      "MADT-ALS": 1,
      "YSTF-MADT": 5,
      "PTH-MADTL": 1,
      "BMT11-MADT": 1,
      "MADT-BCP": 1
    }
  },
  {
    "name": "Depot-43 Gate Shivanapura",
    "lat": 13.06790669,
    "lng": 77.42657125,
    "dailyTrips": 16,
    "routesCount": 2,
    "topRoutes": [
      "VNC-D43",
      "D43-VNC"
    ],
    "boothCodes": [
      "29150318",
      "29150262",
      "29150263",
      "29150312"
    ],
    "routesMap": {
      "VNC-D43": 13,
      "D43-VNC": 3
    }
  },
  {
    "name": "Nitte International School",
    "lat": 13.14799,
    "lng": 77.55112231,
    "dailyTrips": 16,
    "routesCount": 2,
    "topRoutes": [
      "266-K",
      "YHKOT-MLPH"
    ],
    "boothCodes": [
      "29150037",
      "29150038",
      "29150044",
      "29150039"
    ],
    "routesMap": {
      "YHKOT-MLPH": 3,
      "266-K": 13
    }
  },
  {
    "name": "KG Srinivasapura Cross Nelamangala",
    "lat": 13.12902013,
    "lng": 77.40025923,
    "dailyTrips": 15,
    "routesCount": 5,
    "topRoutes": [
      "407-F",
      "CRISTAL-5",
      "507-C YPRS-KRPG",
      "HSG-NMG 407",
      "406 YLKOT-NMG"
    ],
    "boothCodes": [
      "29150093"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "CRISTAL-5": 3,
      "HSG-NMG 407": 1,
      "406 YLKOT-NMG": 1
    }
  },
  {
    "name": "Mylanahalli Gate Nelamangala",
    "lat": 13.1271035,
    "lng": 77.39841452,
    "dailyTrips": 15,
    "routesCount": 5,
    "topRoutes": [
      "407-F",
      "CRISTAL-5",
      "507-C YPRS-KRPG",
      "HSG-NMG 407",
      "406 YLKOT-NMG"
    ],
    "boothCodes": [
      "29150093"
    ],
    "routesMap": {
      "507-C YPRS-KRPG": 2,
      "407-F": 8,
      "CRISTAL-5": 3,
      "HSG-NMG 407": 1,
      "406 YLKOT-NMG": 1
    }
  },
  {
    "name": "Sadenahalli",
    "lat": 13.19469119,
    "lng": 77.57269804,
    "dailyTrips": 15,
    "routesCount": 2,
    "topRoutes": [
      "285-K",
      "285-K NES-SDH"
    ],
    "boothCodes": [
      "29150014",
      "29150015"
    ],
    "routesMap": {
      "285-K": 14,
      "285-K NES-SDH": 1
    }
  },
  {
    "name": "Kakkepalya Nelamangala",
    "lat": 13.06101918,
    "lng": 77.37999603,
    "dailyTrips": 14,
    "routesCount": 2,
    "topRoutes": [
      "258-U",
      "258-U NMG-GRNB"
    ],
    "boothCodes": [
      "29150316"
    ],
    "routesMap": {
      "258-U": 13,
      "258-U NMG-GRNB": 1
    }
  },
  {
    "name": "Kondappanahalli",
    "lat": 13.06383205,
    "lng": 77.38159731,
    "dailyTrips": 14,
    "routesCount": 2,
    "topRoutes": [
      "258-U",
      "258-U NMG-GRNB"
    ],
    "boothCodes": [
      "29150316"
    ],
    "routesMap": {
      "258-U": 13,
      "258-U NMG-GRNB": 1
    }
  },
  {
    "name": "Giddenahalli Kadabagere",
    "lat": 12.99274809,
    "lng": 77.41865337,
    "dailyTrips": 14,
    "routesCount": 3,
    "topRoutes": [
      "242-N",
      "D35G-GDH",
      "242-N MRTG-GDH"
    ],
    "boothCodes": [
      "29150360"
    ],
    "routesMap": {
      "D35G-GDH": 1,
      "242-N": 12,
      "242-N MRTG-GDH": 1
    }
  },
  {
    "name": "Mallaiahnapalya Channenahalli",
    "lat": 12.98569469,
    "lng": 77.4272465,
    "dailyTrips": 14,
    "routesCount": 3,
    "topRoutes": [
      "242-N",
      "D35G-GDH",
      "242-N MRTG-GDH"
    ],
    "boothCodes": [
      "29150360",
      "29150361",
      "29150362"
    ],
    "routesMap": {
      "D35G-GDH": 1,
      "242-N": 12,
      "242-N MRTG-GDH": 1
    }
  },
  {
    "name": "Lingadeeranahalli",
    "lat": 12.99895386,
    "lng": 77.47899569,
    "dailyTrips": 14,
    "routesCount": 2,
    "topRoutes": [
      "243-L",
      "243-L KMT-LDH"
    ],
    "boothCodes": [
      "29150356"
    ],
    "routesMap": {
      "243-L": 12,
      "243-L KMT-LDH": 2
    }
  },
  {
    "name": "Central Foods Seeds Production Farm",
    "lat": 13.17866029,
    "lng": 77.48945698,
    "dailyTrips": 14,
    "routesCount": 2,
    "topRoutes": [
      "253-A",
      "248-Q"
    ],
    "boothCodes": [
      "29150017"
    ],
    "routesMap": {
      "253-A": 12,
      "248-Q": 2
    }
  },
  {
    "name": "Junnasandra Madhure Temple",
    "lat": 13.19205665,
    "lng": 77.47719148,
    "dailyTrips": 14,
    "routesCount": 3,
    "topRoutes": [
      "285-RB",
      "CRISTAL-5",
      "406 YLKOT-NMG"
    ],
    "boothCodes": [
      "29150017",
      "29150018"
    ],
    "routesMap": {
      "285-RB": 10,
      "CRISTAL-5": 3,
      "406 YLKOT-NMG": 1
    }
  },
  {
    "name": "Kalenahalli",
    "lat": 13.14897316,
    "lng": 77.50502903,
    "dailyTrips": 14,
    "routesCount": 3,
    "topRoutes": [
      "266-J",
      "266-J BMT45-MTK",
      "266-J YTTMC-MTK"
    ],
    "boothCodes": [
      "29150057",
      "29150036"
    ],
    "routesMap": {
      "266-J": 12,
      "266-J BMT45-MTK": 1,
      "266-J YTTMC-MTK": 1
    }
  },
  {
    "name": "Mathkur Shivakote",
    "lat": 13.15524536,
    "lng": 77.50795658,
    "dailyTrips": 14,
    "routesCount": 4,
    "topRoutes": [
      "285-RC",
      "YHKOT-HSG",
      "253-LA PTML-HGV",
      "285-RC PTML-HGV"
    ],
    "boothCodes": [
      "29150036"
    ],
    "routesMap": {
      "285-RC": 9,
      "YHKOT-HSG": 3,
      "253-LA PTML-HGV": 1,
      "285-RC PTML-HGV": 1
    }
  },
  {
    "name": "Rainbow Layout Vaderahalli",
    "lat": 13.10122481,
    "lng": 77.53930449,
    "dailyTrips": 14,
    "routesCount": 3,
    "topRoutes": [
      "266-R",
      "RNBL-KBS",
      "266-R BMT45-RNBL"
    ],
    "boothCodes": [
      "29150106",
      "29150243",
      "29150244",
      "29150246"
    ],
    "routesMap": {
      "RNBL-KBS": 2,
      "266-R": 11,
      "266-R BMT45-RNBL": 1
    }
  },
  {
    "name": "Yelahanka 4th Phase",
    "lat": 13.10447199,
    "lng": 77.57000104,
    "dailyTrips": 14,
    "routesCount": 6,
    "topRoutes": [
      "NITT-1A",
      "BMSIT-1",
      "ITPL-8A",
      "BEMLA-7",
      "MTR-27",
      "VCS-TATA ELEXI-07 DBSA-TELX"
    ],
    "boothCodes": [
      "29150102",
      "29150103",
      "29150101",
      "29150104",
      "29150148",
      "29150149",
      "29150150",
      "29150152",
      "29150153",
      "29150154",
      "29150155",
      "29150156",
      "29150159",
      "29150164",
      "29150165",
      "29150166",
      "29150167"
    ],
    "routesMap": {
      "BEMLA-7": 2,
      "BMSIT-1": 3,
      "NITT-1A": 4,
      "ITPL-8A": 3,
      "MTR-27": 2,
      "VCS-TATA ELEXI-07 DBSA-TELX": 0
    }
  },
  {
    "name": "BSF Yelahanka",
    "lat": 13.12911967,
    "lng": 77.60492072,
    "dailyTrips": 14,
    "routesCount": 3,
    "topRoutes": [
      "281-A",
      "KMT-BSFY",
      "PTH-BSF"
    ],
    "boothCodes": [
      "29150108"
    ],
    "routesMap": {
      "PTH-BSF": 1,
      "281-A": 7,
      "KMT-BSFY": 6
    }
  },
  {
    "name": "Gejjagadahalli",
    "lat": 13.06532594,
    "lng": 77.43045375,
    "dailyTrips": 13,
    "routesCount": 2,
    "topRoutes": [
      "256-B",
      "256-B YTTMC-GJDH"
    ],
    "boothCodes": [
      "29150318",
      "29150262",
      "29150263",
      "29150312"
    ],
    "routesMap": {
      "256-B YTTMC-GJDH": 2,
      "256-B": 11
    }
  },
  {
    "name": "Thippennahalli",
    "lat": 13.02936311,
    "lng": 77.48360826,
    "dailyTrips": 13,
    "routesCount": 3,
    "topRoutes": [
      "243-G",
      "PSS-TPH",
      "TPH-D35G"
    ],
    "boothCodes": [
      "29150347"
    ],
    "routesMap": {
      "PSS-TPH": 2,
      "243-G": 10,
      "TPH-D35G": 1
    }
  },
  {
    "name": "Bilijaji",
    "lat": 13.12643312,
    "lng": 77.47343748,
    "dailyTrips": 13,
    "routesCount": 1,
    "topRoutes": [
      "253-D"
    ],
    "boothCodes": [
      "29150068",
      "29150062"
    ],
    "routesMap": {
      "253-D": 13
    }
  },
  {
    "name": "Kasaghattapura Siluvepura Road",
    "lat": 13.11062924,
    "lng": 77.50441432,
    "dailyTrips": 13,
    "routesCount": 2,
    "topRoutes": [
      "254-A",
      "254-A  DSP-KGT"
    ],
    "boothCodes": [
      "29150098",
      "29150100",
      "29150089",
      "29150099"
    ],
    "routesMap": {
      "254-A": 11,
      "254-A  DSP-KGT": 2
    }
  },
  {
    "name": "Muddanahalli",
    "lat": 13.15224218,
    "lng": 77.57730603,
    "dailyTrips": 13,
    "routesCount": 2,
    "topRoutes": [
      "285-A",
      "285-A KBS-NDH"
    ],
    "boothCodes": [
      "29150040",
      "29150042",
      "29150043"
    ],
    "routesMap": {
      "285-A": 12,
      "285-A KBS-NDH": 1
    }
  },
  {
    "name": "Nagadasanahalli",
    "lat": 13.15987128,
    "lng": 77.57783443,
    "dailyTrips": 13,
    "routesCount": 2,
    "topRoutes": [
      "285-A",
      "285-A KBS-NDH"
    ],
    "boothCodes": [
      "29150040",
      "29150042"
    ],
    "routesMap": {
      "285-A": 12,
      "285-A KBS-NDH": 1
    }
  },
  {
    "name": "Bommashettyhalli Nelamangala",
    "lat": 13.13079664,
    "lng": 77.41895445,
    "dailyTrips": 12,
    "routesCount": 2,
    "topRoutes": [
      "258-GA",
      "258-GA KBS-BMSH"
    ],
    "boothCodes": [
      "29150093",
      "29150072"
    ],
    "routesMap": {
      "258-GA KBS-BMSH": 2,
      "258-GA": 10
    }
  },
  {
    "name": "Bylakonenahalli",
    "lat": 13.01614463,
    "lng": 77.45644142,
    "dailyTrips": 12,
    "routesCount": 2,
    "topRoutes": [
      "240-E",
      "D35G-BKH"
    ],
    "boothCodes": [
      "29150358",
      "29150350",
      "29150348",
      "29150349"
    ],
    "routesMap": {
      "D35G-BKH": 1,
      "240-E": 11
    }
  },
  {
    "name": "Kondashettyhalli",
    "lat": 13.12655327,
    "lng": 77.51418292,
    "dailyTrips": 12,
    "routesCount": 2,
    "topRoutes": [
      "266-M",
      "266M BMT45-KDSH"
    ],
    "boothCodes": [
      "29150055",
      "29150051",
      "29150053"
    ],
    "routesMap": {
      "266-M": 11,
      "266M BMT45-KDSH": 1
    }
  },
  {
    "name": "VRL Gowdon Jakkur",
    "lat": 13.08657145,
    "lng": 77.60412813,
    "dailyTrips": 11,
    "routesCount": 1,
    "topRoutes": [
      "241-CD"
    ],
    "boothCodes": [
      "29150194",
      "29150193"
    ],
    "routesMap": {
      "241-CD": 11
    }
  },
  {
    "name": "NICE Road 2nd Stone",
    "lat": 13.03237273,
    "lng": 77.47574888,
    "dailyTrips": 10,
    "routesCount": 3,
    "topRoutes": [
      "NICE-7A",
      "NICE-7",
      "NICE-8"
    ],
    "boothCodes": [
      "29150329",
      "29150347"
    ],
    "routesMap": {
      "NICE-7": 3,
      "NICE-7A": 5,
      "NICE-8": 2
    }
  },
  {
    "name": "NICE Road 1st Stone",
    "lat": 13.04215281,
    "lng": 77.47549072,
    "dailyTrips": 10,
    "routesCount": 3,
    "topRoutes": [
      "NICE-7A",
      "NICE-7",
      "NICE-8"
    ],
    "boothCodes": [
      "29150328",
      "29150347",
      "29150325",
      "29150326"
    ],
    "routesMap": {
      "NICE-7": 3,
      "NICE-7A": 5,
      "NICE-8": 2
    }
  },
  {
    "name": "NICE Road 4th Stone",
    "lat": 13.00936769,
    "lng": 77.47512124,
    "dailyTrips": 10,
    "routesCount": 3,
    "topRoutes": [
      "NICE-7A",
      "NICE-7",
      "NICE-8"
    ],
    "boothCodes": [
      "29150356",
      "29150345",
      "29150349"
    ],
    "routesMap": {
      "NICE-7": 3,
      "NICE-7A": 5,
      "NICE-8": 2
    }
  },
  {
    "name": "NICE Road 3rd Stone",
    "lat": 13.02288104,
    "lng": 77.47560069,
    "dailyTrips": 10,
    "routesCount": 3,
    "topRoutes": [
      "NICE-7A",
      "NICE-7",
      "NICE-8"
    ],
    "boothCodes": [
      "29150345",
      "29150346",
      "29150347"
    ],
    "routesMap": {
      "NICE-7": 3,
      "NICE-7A": 5,
      "NICE-8": 2
    }
  },
  {
    "name": "NICE Road Juction Tumkur Road",
    "lat": 13.05348913,
    "lng": 77.47685462,
    "dailyTrips": 10,
    "routesCount": 3,
    "topRoutes": [
      "NICE-7A",
      "NICE-7",
      "NICE-8"
    ],
    "boothCodes": [
      "29150322",
      "29150324",
      "29150325",
      "29150271",
      "29150274",
      "29150321",
      "29150323",
      "29150326",
      "29150301",
      "29150302"
    ],
    "routesMap": {
      "NICE-7": 3,
      "NICE-7A": 5,
      "NICE-8": 2
    }
  },
  {
    "name": "Thammarasanahalli Hesarughatta",
    "lat": 13.12632863,
    "lng": 77.49752641,
    "dailyTrips": 10,
    "routesCount": 2,
    "topRoutes": [
      "253-W",
      "BTP-20G"
    ],
    "boothCodes": [
      "29150076",
      "29150056"
    ],
    "routesMap": {
      "253-W": 8,
      "BTP-20G": 2
    }
  },
  {
    "name": "Budumanahalli",
    "lat": 13.19091769,
    "lng": 77.52797828,
    "dailyTrips": 10,
    "routesCount": 1,
    "topRoutes": [
      "285-G"
    ],
    "boothCodes": [
      "29150021",
      "29150010"
    ],
    "routesMap": {
      "285-G": 10
    }
  },
  {
    "name": "Adde Vishwanathapura",
    "lat": 13.18668225,
    "lng": 77.55106866,
    "dailyTrips": 10,
    "routesCount": 1,
    "topRoutes": [
      "285-RB"
    ],
    "boothCodes": [
      "29150022",
      "29150023"
    ],
    "routesMap": {
      "285-RB": 10
    }
  },
  {
    "name": "Baleveeranahalli",
    "lat": 13.01860386,
    "lng": 77.39393994,
    "dailyTrips": 9,
    "routesCount": 2,
    "topRoutes": [
      "242-LA",
      "D35G-BVRH"
    ],
    "boothCodes": [
      "29150340"
    ],
    "routesMap": {
      "D35G-BVRH": 1,
      "242-LA": 8
    }
  },
  {
    "name": "Dasegowdrapalya Nelamangala",
    "lat": 13.02346983,
    "lng": 77.39425714,
    "dailyTrips": 9,
    "routesCount": 2,
    "topRoutes": [
      "242-LA",
      "D35G-BVRH"
    ],
    "boothCodes": [
      "29150340",
      "29150339",
      "29150336"
    ],
    "routesMap": {
      "D35G-BVRH": 1,
      "242-LA": 8
    }
  },
  {
    "name": "Agraharapalya Gate Thotagere",
    "lat": 13.1307457,
    "lng": 77.45348185,
    "dailyTrips": 9,
    "routesCount": 1,
    "topRoutes": [
      "253-P"
    ],
    "boothCodes": [
      "29150071",
      "29150074",
      "29150073",
      "29150068"
    ],
    "routesMap": {
      "253-P": 9
    }
  },
  {
    "name": "Hosahallipalya Thotagere",
    "lat": 13.1275276,
    "lng": 77.45409608,
    "dailyTrips": 9,
    "routesCount": 1,
    "topRoutes": [
      "253-P"
    ],
    "boothCodes": [
      "29150071",
      "29150074",
      "29150073",
      "29150068"
    ],
    "routesMap": {
      "253-P": 9
    }
  },
  {
    "name": "Sri Sai Packaging Company",
    "lat": 12.99761771,
    "lng": 77.46315189,
    "dailyTrips": 9,
    "routesCount": 5,
    "topRoutes": [
      "SSPC-2",
      "KBS-SSPC",
      "SSPC-1",
      "JHC-SSPCM",
      "KBS-SSPCM"
    ],
    "boothCodes": [
      "29150351",
      "29150352",
      "29150354",
      "29150357",
      "29150368",
      "29150369"
    ],
    "routesMap": {
      "KBS-SSPC": 2,
      "SSPC-2": 3,
      "JHC-SSPCM": 1,
      "KBS-SSPCM": 1,
      "SSPC-1": 2
    }
  },
  {
    "name": "Govindapura Thore Nagasandra",
    "lat": 13.11757569,
    "lng": 77.46133613,
    "dailyTrips": 9,
    "routesCount": 3,
    "topRoutes": [
      "255-H",
      "255-E BMT40C-NSP",
      "255H DSP-GDP"
    ],
    "boothCodes": [
      "29150094",
      "29150074",
      "29150095"
    ],
    "routesMap": {
      "255-H": 6,
      "255-E BMT40C-NSP": 2,
      "255H DSP-GDP": 1
    }
  },
  {
    "name": "Lakshmaiah Badavane",
    "lat": 12.98089997,
    "lng": 77.46431798,
    "dailyTrips": 9,
    "routesCount": 1,
    "topRoutes": [
      "241-E"
    ],
    "boothCodes": [
      "29150374"
    ],
    "routesMap": {
      "241-E": 9
    }
  },
  {
    "name": "Achyutha Nagara Gate Chikkabanavara",
    "lat": 13.08424692,
    "lng": 77.48644419,
    "dailyTrips": 9,
    "routesCount": 2,
    "topRoutes": [
      "V-KBS-AIT",
      "KBS-MTH"
    ],
    "boothCodes": [
      "29150254",
      "29150270",
      "29150299"
    ],
    "routesMap": {
      "V-KBS-AIT": 6,
      "KBS-MTH": 3
    }
  },
  {
    "name": "Sonnenahalli Byatha",
    "lat": 13.19771095,
    "lng": 77.50034407,
    "dailyTrips": 8,
    "routesCount": 2,
    "topRoutes": [
      "253-L",
      "D10G-RCH"
    ],
    "boothCodes": [
      "29150017",
      "29150016"
    ],
    "routesMap": {
      "253-L": 6,
      "D10G-RCH": 2
    }
  },
  {
    "name": "Hurali Chikkanahalli Hesaraghatta Road",
    "lat": 13.11594953,
    "lng": 77.48280539,
    "dailyTrips": 8,
    "routesCount": 3,
    "topRoutes": [
      "TNS-PSS",
      "DSNH-KBS",
      "248-BA HGV-D31G"
    ],
    "boothCodes": [
      "29150062",
      "29150097",
      "29150096"
    ],
    "routesMap": {
      "TNS-PSS": 5,
      "248-BA HGV-D31G": 1,
      "DSNH-KBS": 2
    }
  },
  {
    "name": "Tharabanahalli Hesaraghatta Road",
    "lat": 13.10530505,
    "lng": 77.47916154,
    "dailyTrips": 8,
    "routesCount": 3,
    "topRoutes": [
      "TNS-PSS",
      "DSNH-KBS",
      "248-BA HGV-D31G"
    ],
    "boothCodes": [
      "29150062",
      "29150097",
      "29150252",
      "29150253"
    ],
    "routesMap": {
      "TNS-PSS": 5,
      "248-BA HGV-D31G": 1,
      "DSNH-KBS": 2
    }
  },
  {
    "name": "Thirumalapura Hesaraghatta Road",
    "lat": 13.12543985,
    "lng": 77.48365604,
    "dailyTrips": 8,
    "routesCount": 3,
    "topRoutes": [
      "TNS-PSS",
      "DSNH-KBS",
      "248-BA HGV-D31G"
    ],
    "boothCodes": [
      "29150062",
      "29150075",
      "29150076"
    ],
    "routesMap": {
      "TNS-PSS": 5,
      "248-BA HGV-D31G": 1,
      "DSNH-KBS": 2
    }
  },
  {
    "name": "Karlapura",
    "lat": 13.2125163,
    "lng": 77.4956274,
    "dailyTrips": 8,
    "routesCount": 2,
    "topRoutes": [
      "251-M",
      "251-M KBS-KLPP"
    ],
    "boothCodes": [
      "29150008",
      "29150001",
      "29150007"
    ],
    "routesMap": {
      "251-M": 7,
      "251-M KBS-KLPP": 1
    }
  },
  {
    "name": "Lakshmipura Cross MS Palya",
    "lat": 13.09203718,
    "lng": 77.53399934,
    "dailyTrips": 8,
    "routesCount": 2,
    "topRoutes": [
      "407-C",
      "RNBL-KBS"
    ],
    "boothCodes": [
      "29150248",
      "29150243",
      "29150245",
      "29150246"
    ],
    "routesMap": {
      "407-C": 6,
      "RNBL-KBS": 2
    }
  },
  {
    "name": "Best County MS Palya",
    "lat": 13.08934858,
    "lng": 77.54470378,
    "dailyTrips": 8,
    "routesCount": 2,
    "topRoutes": [
      "407-C",
      "RNBL-KBS"
    ],
    "boothCodes": [
      "29150236",
      "29150237",
      "29150245",
      "29150234",
      "29150242"
    ],
    "routesMap": {
      "407-C": 6,
      "RNBL-KBS": 2
    }
  },
  {
    "name": "Kanshiramnagara",
    "lat": 13.09064177,
    "lng": 77.53892094,
    "dailyTrips": 8,
    "routesCount": 2,
    "topRoutes": [
      "407-C",
      "RNBL-KBS"
    ],
    "boothCodes": [
      "29150236",
      "29150237",
      "29150243",
      "29150245"
    ],
    "routesMap": {
      "407-C": 6,
      "RNBL-KBS": 2
    }
  },
  {
    "name": "Sambhram College MS Palya",
    "lat": 13.08827709,
    "lng": 77.54665024,
    "dailyTrips": 8,
    "routesCount": 2,
    "topRoutes": [
      "407-C",
      "RNBL-KBS"
    ],
    "boothCodes": [
      "29150236",
      "29150237",
      "29150234",
      "29150241",
      "29150242"
    ],
    "routesMap": {
      "407-C": 6,
      "RNBL-KBS": 2
    }
  },
  {
    "name": "Vinayakanagara Arsihinakunte",
    "lat": 13.06754482,
    "lng": 77.42233671,
    "dailyTrips": 7,
    "routesCount": 4,
    "topRoutes": [
      "D43-VNC",
      "256-MA VNC-TRHH",
      "258-X VNC-MTNT",
      "255-AC VNC-VDH"
    ],
    "boothCodes": [
      "29150318",
      "29150262",
      "29150263"
    ],
    "routesMap": {
      "258-X VNC-MTNT": 1,
      "D43-VNC": 3,
      "256-MA VNC-TRHH": 2,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "CS-Sri Sai Packaging Company",
    "lat": 12.99722439,
    "lng": 77.46297687,
    "dailyTrips": 7,
    "routesCount": 3,
    "topRoutes": [
      "SSPC-2",
      "KBS-SSPC",
      "SSPC-1"
    ],
    "boothCodes": [
      "29150351",
      "29150352",
      "29150354",
      "29150357",
      "29150368",
      "29150369"
    ],
    "routesMap": {
      "KBS-SSPC": 2,
      "SSPC-2": 3,
      "SSPC-1": 2
    }
  },
  {
    "name": "Kadirenahalli Madanayakanahalli",
    "lat": 13.04180274,
    "lng": 77.44848094,
    "dailyTrips": 7,
    "routesCount": 3,
    "topRoutes": [
      "245-AA",
      "KBS-MNKH",
      "KDBC-MNKH"
    ],
    "boothCodes": [
      "29150333",
      "29150320",
      "29150328"
    ],
    "routesMap": {
      "245-AA": 4,
      "KBS-MNKH": 2,
      "KDBC-MNKH": 1
    }
  },
  {
    "name": "Harokyatanahalli",
    "lat": 13.054273,
    "lng": 77.44734228,
    "dailyTrips": 7,
    "routesCount": 3,
    "topRoutes": [
      "257-A",
      "KBS-HRH",
      "257A DSP-HRH"
    ],
    "boothCodes": [
      "29150319",
      "29150320"
    ],
    "routesMap": {
      "257-A": 4,
      "KBS-HRH": 2,
      "257A DSP-HRH": 1
    }
  },
  {
    "name": "Marasandra Doddaballapura",
    "lat": 13.22273583,
    "lng": 77.54972305,
    "dailyTrips": 7,
    "routesCount": 2,
    "topRoutes": [
      "GITAM-YHK-HBL-KRP",
      "297-M"
    ],
    "boothCodes": [
      "29150005",
      "29150002",
      "29150004",
      "29150003"
    ],
    "routesMap": {
      "297-M": 2,
      "GITAM-YHK-HBL-KRP": 5
    }
  },
  {
    "name": "Hosahudya Doddaballapura",
    "lat": 13.23671839,
    "lng": 77.55101234,
    "dailyTrips": 7,
    "routesCount": 2,
    "topRoutes": [
      "GITAM-YHK-HBL-KRP",
      "297-M"
    ],
    "boothCodes": [
      "29150002",
      "29150003"
    ],
    "routesMap": {
      "297-M": 2,
      "GITAM-YHK-HBL-KRP": 5
    }
  },
  {
    "name": "Nitte Meenakshi College",
    "lat": 13.13126289,
    "lng": 77.58980244,
    "dailyTrips": 7,
    "routesCount": 1,
    "topRoutes": [
      "YHK-NITT"
    ],
    "boothCodes": [
      "29150082",
      "29150108",
      "29150043"
    ],
    "routesMap": {
      "YHK-NITT": 7
    }
  },
  {
    "name": "Gantaganahalli Junction",
    "lat": 13.14336496,
    "lng": 77.58862227,
    "dailyTrips": 7,
    "routesCount": 1,
    "topRoutes": [
      "YHK-NITT"
    ],
    "boothCodes": [
      "29150043"
    ],
    "routesMap": {
      "YHK-NITT": 7
    }
  },
  {
    "name": "Madavara Village",
    "lat": 13.05295871,
    "lng": 77.47231364,
    "dailyTrips": 6,
    "routesCount": 2,
    "topRoutes": [
      "257-B",
      "257B DSP-MKPL"
    ],
    "boothCodes": [
      "29150322",
      "29150324",
      "29150325",
      "29150321",
      "29150323",
      "29150326"
    ],
    "routesMap": {
      "257-B": 5,
      "257B DSP-MKPL": 1
    }
  },
  {
    "name": "Kurubarahalli Dodda Byalakere",
    "lat": 13.1267348,
    "lng": 77.51954131,
    "dailyTrips": 6,
    "routesCount": 1,
    "topRoutes": [
      "407-C"
    ],
    "boothCodes": [
      "29150055",
      "29150053"
    ],
    "routesMap": {
      "407-C": 6
    }
  },
  {
    "name": "Meda Agrahara MS Palya",
    "lat": 13.1012183,
    "lng": 77.53079248,
    "dailyTrips": 6,
    "routesCount": 1,
    "topRoutes": [
      "407-C"
    ],
    "boothCodes": [
      "29150248",
      "29150246"
    ],
    "routesMap": {
      "407-C": 6
    }
  },
  {
    "name": "Chokkanahalli Rajanukunte",
    "lat": 13.18306009,
    "lng": 77.53932059,
    "dailyTrips": 5,
    "routesCount": 3,
    "topRoutes": [
      "CRISTAL-5",
      "406 YLKOT-NMG",
      "253-LA PTML-HGV"
    ],
    "boothCodes": [
      "29150021",
      "29150010"
    ],
    "routesMap": {
      "CRISTAL-5": 3,
      "406 YLKOT-NMG": 1,
      "253-LA PTML-HGV": 1
    }
  },
  {
    "name": "Thimmabhovipalya Shivanapura",
    "lat": 13.05958234,
    "lng": 77.41923675,
    "dailyTrips": 4,
    "routesCount": 2,
    "topRoutes": [
      "256 KBS-SVNC",
      "256-K BMT43-SVP"
    ],
    "boothCodes": [
      "29150315",
      "29150318",
      "29150314"
    ],
    "routesMap": {
      "256 KBS-SVNC": 3,
      "256-K BMT43-SVP": 1
    }
  },
  {
    "name": "Sundaranagara Arsihinakunte",
    "lat": 13.07151683,
    "lng": 77.42286377,
    "dailyTrips": 4,
    "routesCount": 3,
    "topRoutes": [
      "256-MA VNC-TRHH",
      "258-X VNC-MTNT",
      "255-AC VNC-VDH"
    ],
    "boothCodes": [
      "29150318",
      "29150262",
      "29150263"
    ],
    "routesMap": {
      "258-X VNC-MTNT": 1,
      "256-MA VNC-TRHH": 2,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "Adarshanagara Arishinakunte",
    "lat": 13.0762066,
    "lng": 77.42370933,
    "dailyTrips": 4,
    "routesCount": 3,
    "topRoutes": [
      "256-MA VNC-TRHH",
      "258-X VNC-MTNT",
      "255-AC VNC-VDH"
    ],
    "boothCodes": [
      "29150263"
    ],
    "routesMap": {
      "258-X VNC-MTNT": 1,
      "256-MA VNC-TRHH": 2,
      "255-AC VNC-VDH": 1
    }
  },
  {
    "name": "Kebbepalya Gate",
    "lat": 13.09008465,
    "lng": 77.51395293,
    "dailyTrips": 4,
    "routesCount": 2,
    "topRoutes": [
      "253-A BMT45-LKPC-BYT",
      "BMT45-CKB-KDG"
    ],
    "boothCodes": [
      "29150247"
    ],
    "routesMap": {
      "BMT45-CKB-KDG": 1,
      "253-A BMT45-LKPC-BYT": 3
    }
  },
  {
    "name": "Lingarajapura Shivkote",
    "lat": 13.12683407,
    "lng": 77.53372818,
    "dailyTrips": 4,
    "routesCount": 3,
    "topRoutes": [
      "266-N KMT-MLPH",
      "KBS-MVL",
      "KMT-MVL"
    ],
    "boothCodes": [
      "29150053",
      "29150050",
      "29150037"
    ],
    "routesMap": {
      "KBS-MVL": 1,
      "KMT-MVL": 1,
      "266-N KMT-MLPH": 2
    }
  },
  {
    "name": "Amritha Ayurvedic Hospital",
    "lat": 13.12485154,
    "lng": 77.5472148,
    "dailyTrips": 4,
    "routesCount": 3,
    "topRoutes": [
      "266-N KMT-MLPH",
      "KBS-MVL",
      "KMT-MVL"
    ],
    "boothCodes": [
      "29150084",
      "29150085"
    ],
    "routesMap": {
      "KBS-MVL": 1,
      "KMT-MVL": 1,
      "266-N KMT-MLPH": 2
    }
  },
  {
    "name": "BMS College Campus Yelahanka",
    "lat": 13.13442608,
    "lng": 77.56904215,
    "dailyTrips": 4,
    "routesCount": 3,
    "topRoutes": [
      "D06G-BMSIT",
      "CS-BSWFO-BMSIT",
      "BMSIT-3"
    ],
    "boothCodes": [
      "29150044",
      "29150045",
      "29150079",
      "29150077",
      "29150082"
    ],
    "routesMap": {
      "CS-BSWFO-BMSIT": 1,
      "D06G-BMSIT": 2,
      "BMSIT-3": 1
    }
  },
  {
    "name": "Lakkenahalli Village Sondekoppa",
    "lat": 13.04358604,
    "lng": 77.39780188,
    "dailyTrips": 3,
    "routesCount": 2,
    "topRoutes": [
      "258- KMT-LKH",
      "374-M NMG-LKH"
    ],
    "boothCodes": [
      "29150316"
    ],
    "routesMap": {
      "258- KMT-LKH": 2,
      "374-M NMG-LKH": 1
    }
  },
  {
    "name": "Kempammadevinagara",
    "lat": 13.06492487,
    "lng": 77.42026538,
    "dailyTrips": 3,
    "routesCount": 1,
    "topRoutes": [
      "256 KBS-SVNC"
    ],
    "boothCodes": [
      "29150315",
      "29150318"
    ],
    "routesMap": {
      "256 KBS-SVNC": 3
    }
  },
  {
    "name": "Kenganahalli Cross",
    "lat": 13.04045238,
    "lng": 77.42691994,
    "dailyTrips": 3,
    "routesCount": 3,
    "topRoutes": [
      "245-H NML-D35G",
      "257-C ASK-RVT",
      "256-D KBS-RVT"
    ],
    "boothCodes": [
      "29150335",
      "29150318",
      "29150313"
    ],
    "routesMap": {
      "245-H NML-D35G": 1,
      "257-C ASK-RVT": 1,
      "256-D KBS-RVT": 1
    }
  },
  {
    "name": "Sheshadri Nagara Bagalagunte",
    "lat": 13.06396401,
    "lng": 77.48857051,
    "dailyTrips": 3,
    "routesCount": 1,
    "topRoutes": [
      "248-L"
    ],
    "boothCodes": [
      "29150295",
      "29150297",
      "29150298",
      "29150305",
      "29150306",
      "29150296"
    ],
    "routesMap": {
      "248-L": 3
    }
  },
  {
    "name": "Soladevanahalli Hesaragatta Road",
    "lat": 13.09197741,
    "lng": 77.48848066,
    "dailyTrips": 3,
    "routesCount": 2,
    "topRoutes": [
      "BTP-31",
      "248-N MRTG-SOLD"
    ],
    "boothCodes": [
      "29150269",
      "29150270",
      "29150249"
    ],
    "routesMap": {
      "BTP-31": 2,
      "248-N MRTG-SOLD": 1
    }
  },
  {
    "name": "New Age World School Yelahanka",
    "lat": 13.13996461,
    "lng": 77.53941705,
    "dailyTrips": 3,
    "routesCount": 1,
    "topRoutes": [
      "YHKOT-MLPH"
    ],
    "boothCodes": [
      "29150050",
      "29150037"
    ],
    "routesMap": {
      "YHKOT-MLPH": 3
    }
  },
  {
    "name": "Mid City Layout",
    "lat": 13.14514706,
    "lng": 77.54381928,
    "dailyTrips": 3,
    "routesCount": 1,
    "topRoutes": [
      "YHKOT-MLPH"
    ],
    "boothCodes": [
      "29150037"
    ],
    "routesMap": {
      "YHKOT-MLPH": 3
    }
  },
  {
    "name": "Police Traning Centre Devanahalli Road",
    "lat": 13.12357018,
    "lng": 77.60530829,
    "dailyTrips": 3,
    "routesCount": 1,
    "topRoutes": [
      "YTTMC-PTC"
    ],
    "boothCodes": [
      "29150108"
    ],
    "routesMap": {
      "YTTMC-PTC": 3
    }
  },
  {
    "name": "Shreya Residency",
    "lat": 13.10469403,
    "lng": 77.60011286,
    "dailyTrips": 3,
    "routesCount": 2,
    "topRoutes": [
      "VNS-22",
      "JKR-SRSRA"
    ],
    "boothCodes": [
      "29150108",
      "29150109",
      "29150123",
      "29150124",
      "29150127",
      "29150128",
      "29150173",
      "29150174",
      "29150196",
      "29150202",
      "29150107",
      "29150111",
      "29150113",
      "29150119",
      "29150175",
      "29150190",
      "29150191",
      "29150112"
    ],
    "routesMap": {
      "JKR-SRSRA": 1,
      "VNS-22": 2
    }
  },
  {
    "name": "Bettanagere Nelamangala",
    "lat": 13.11460338,
    "lng": 77.41066709,
    "dailyTrips": 2,
    "routesCount": 2,
    "topRoutes": [
      "258 KMT-BTG",
      "258C KBS-BGT"
    ],
    "boothCodes": [
      "29150093"
    ],
    "routesMap": {
      "258 KMT-BTG": 1,
      "258C KBS-BGT": 1
    }
  },
  {
    "name": "Devaninjayyanapalya",
    "lat": 13.01711971,
    "lng": 77.41453355,
    "dailyTrips": 2,
    "routesCount": 1,
    "topRoutes": [
      "245-R KBS-DJP"
    ],
    "boothCodes": [
      "29150342",
      "29150335"
    ],
    "routesMap": {
      "245-R KBS-DJP": 2
    }
  },
  {
    "name": "B Krishnappa Nagara",
    "lat": 12.997144,
    "lng": 77.40871578,
    "dailyTrips": 2,
    "routesCount": 1,
    "topRoutes": [
      "242-B KBS-BKPN"
    ],
    "boothCodes": [
      "29150360"
    ],
    "routesMap": {
      "242-B KBS-BKPN": 2
    }
  },
  {
    "name": "BEL Layout Marappanapalya",
    "lat": 13.0913904,
    "lng": 77.42346675,
    "dailyTrips": 2,
    "routesCount": 1,
    "topRoutes": [
      "NLM-BEL LT"
    ],
    "boothCodes": [
      "29150256",
      "29150258",
      "29150259"
    ],
    "routesMap": {
      "NLM-BEL LT": 2
    }
  },
  {
    "name": "Raghavendra Layout Kadabagere",
    "lat": 12.99388245,
    "lng": 77.43866252,
    "dailyTrips": 2,
    "routesCount": 2,
    "topRoutes": [
      "KTH-D35G",
      "245-H NML-D35G"
    ],
    "boothCodes": [
      "29150362",
      "29150363",
      "29150364"
    ],
    "routesMap": {
      "KTH-D35G": 1,
      "245-H NML-D35G": 1
    }
  },
  {
    "name": "CS-Tredent Automobiles Makali",
    "lat": 13.07048021,
    "lng": 77.45306879,
    "dailyTrips": 2,
    "routesCount": 1,
    "topRoutes": [
      "TAPL-1"
    ],
    "boothCodes": [
      "29150260",
      "29150266",
      "29150284",
      "29150285",
      "29150286",
      "29150311"
    ],
    "routesMap": {
      "TAPL-1": 2
    }
  },
  {
    "name": "Tredent Automobiles Makali",
    "lat": 13.07006742,
    "lng": 77.45287031,
    "dailyTrips": 2,
    "routesCount": 2,
    "topRoutes": [
      "JHC-TAPL",
      "TAPL-NMG"
    ],
    "boothCodes": [
      "29150260",
      "29150266",
      "29150284",
      "29150285",
      "29150286",
      "29150311"
    ],
    "routesMap": {
      "JHC-TAPL": 1,
      "TAPL-NMG": 1
    }
  },
  {
    "name": "Hanumanthegowdanapalya Makali",
    "lat": 13.07122354,
    "lng": 77.4616009,
    "dailyTrips": 2,
    "routesCount": 1,
    "topRoutes": [
      "258-CB YTTMC-HGP"
    ],
    "boothCodes": [
      "29150266",
      "29150286",
      "29150265",
      "29150287",
      "29150291",
      "29150311",
      "29150280"
    ],
    "routesMap": {
      "258-CB YTTMC-HGP": 2
    }
  },
  {
    "name": "Shree Chakra Nagara",
    "lat": 13.00884861,
    "lng": 77.47624643,
    "dailyTrips": 2,
    "routesCount": 2,
    "topRoutes": [
      "248-BA CLO-HGV",
      "BMT09-SCN"
    ],
    "boothCodes": [
      "29150356",
      "29150345",
      "29150349"
    ],
    "routesMap": {
      "248-BA CLO-HGV": 1,
      "BMT09-SCN": 1
    }
  },
  {
    "name": "Kuduregere Katte",
    "lat": 13.06831689,
    "lng": 77.46684395,
    "dailyTrips": 2,
    "routesCount": 1,
    "topRoutes": [
      "258-CB YTTMC-HGP"
    ],
    "boothCodes": [
      "29150281",
      "29150287",
      "29150289",
      "29150291",
      "29150292",
      "29150311"
    ],
    "routesMap": {
      "258-CB YTTMC-HGP": 2
    }
  },
  {
    "name": "Vaderahalli MS Palya",
    "lat": 13.09605743,
    "lng": 77.53738202,
    "dailyTrips": 2,
    "routesCount": 1,
    "topRoutes": [
      "RNBL-KBS"
    ],
    "boothCodes": [
      "29150248",
      "29150243",
      "29150244",
      "29150245",
      "29150246"
    ],
    "routesMap": {
      "RNBL-KBS": 2
    }
  },
  {
    "name": "Adithyanagara MS Palya",
    "lat": 13.08597318,
    "lng": 77.55071461,
    "dailyTrips": 2,
    "routesCount": 2,
    "topRoutes": [
      "SJHS-2",
      "SVG-1"
    ],
    "boothCodes": [
      "29150236",
      "29150237",
      "29150233",
      "29150234",
      "29150241",
      "29150242"
    ],
    "routesMap": {
      "SVG-1": 0,
      "SJHS-2": 2
    }
  },
  {
    "name": "Heritage Estate Rajanukunte",
    "lat": 13.11822764,
    "lng": 77.57758297,
    "dailyTrips": 2,
    "routesCount": 2,
    "topRoutes": [
      "YHKOT-HRTAD",
      "BMT11-HAPT"
    ],
    "boothCodes": [
      "29150101",
      "29150046",
      "29150049",
      "29150080",
      "29150141",
      "29150142",
      "29150143",
      "29150081"
    ],
    "routesMap": {
      "YHKOT-HRTAD": 1,
      "BMT11-HAPT": 1
    }
  },
  {
    "name": "GKVK Layout",
    "lat": 13.08222152,
    "lng": 77.60335162,
    "dailyTrips": 2,
    "routesCount": 2,
    "topRoutes": [
      "286-H PTH-GKVKLT",
      "SBS-GKVKL"
    ],
    "boothCodes": [
      "29150194"
    ],
    "routesMap": {
      "286-H PTH-GKVKLT": 1,
      "SBS-GKVKL": 1
    }
  },
  {
    "name": "Brundavana Kammasandra",
    "lat": 13.02389687,
    "lng": 77.44933284,
    "dailyTrips": 1,
    "routesCount": 2,
    "topRoutes": [
      "245-M KHC-VTC",
      "245-M KBS-BDVN"
    ],
    "boothCodes": [
      "29150343",
      "29150358",
      "29150334",
      "29150329",
      "29150333"
    ],
    "routesMap": {
      "245-M KBS-BDVN": 0,
      "245-M KHC-VTC": 1
    }
  },
  {
    "name": "Gowdahalli Colony",
    "lat": 13.05022952,
    "lng": 77.43301861,
    "dailyTrips": 1,
    "routesCount": 1,
    "topRoutes": [
      "256-D KBS-RVT"
    ],
    "boothCodes": [
      "29150318",
      "29150313"
    ],
    "routesMap": {
      "256-D KBS-RVT": 1
    }
  },
  {
    "name": "Kongovi Pvt Ltd",
    "lat": 13.15427147,
    "lng": 77.43826032,
    "dailyTrips": 1,
    "routesCount": 1,
    "topRoutes": [
      "253-Q KBS-KGVK"
    ],
    "boothCodes": [
      "29150072",
      "29150071",
      "29150070"
    ],
    "routesMap": {
      "253-Q KBS-KGVK": 1
    }
  },
  {
    "name": "Ravuthanahalli Cross Bengaluru Mangalore Hwy",
    "lat": 13.07336614,
    "lng": 77.43898206,
    "dailyTrips": 1,
    "routesCount": 1,
    "topRoutes": [
      "256-D KBS-RVT"
    ],
    "boothCodes": [
      "29150262",
      "29150263",
      "29150260",
      "29150261"
    ],
    "routesMap": {
      "256-D KBS-RVT": 1
    }
  },
  {
    "name": "Kakkehalli",
    "lat": 13.21529461,
    "lng": 77.52799899,
    "dailyTrips": 1,
    "routesCount": 1,
    "topRoutes": [
      "285-CB PTML-KKH"
    ],
    "boothCodes": [
      "29150010"
    ],
    "routesMap": {
      "285-CB PTML-KKH": 1
    }
  },
  {
    "name": "Suradenapura Yelahanka",
    "lat": 13.20439657,
    "lng": 77.55906987,
    "dailyTrips": 1,
    "routesCount": 1,
    "topRoutes": [
      "NES-SDP"
    ],
    "boothCodes": [
      "29150005",
      "29150022",
      "29150006",
      "29150012",
      "29150013"
    ],
    "routesMap": {
      "NES-SDP": 1
    }
  },
  {
    "name": "Nagasandrapalya Sondekoppa",
    "lat": 13.00147977,
    "lng": 77.37739027,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150340"
    ],
    "routesMap": {}
  },
  {
    "name": "Karekalpalya Cross Mallapura",
    "lat": 13.06648569,
    "lng": 77.40347983,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150315",
      "29150314"
    ],
    "routesMap": {}
  },
  {
    "name": "Bhakthanapalya Nelamangala",
    "lat": 13.10129273,
    "lng": 77.41078041,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150093"
    ],
    "routesMap": {}
  },
  {
    "name": "Bommashettyhalli Cross Mattahalli",
    "lat": 13.12585714,
    "lng": 77.41666049,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150093",
      "29150072"
    ],
    "routesMap": {}
  },
  {
    "name": "Huskur Cross Mattahalli",
    "lat": 13.12047936,
    "lng": 77.42319167,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150093",
      "29150072",
      "29150092",
      "29150257"
    ],
    "routesMap": {}
  },
  {
    "name": "Nagaruru",
    "lat": 13.09114664,
    "lng": 77.43460245,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150258",
      "29150259"
    ],
    "routesMap": {}
  },
  {
    "name": "Aluru Makali",
    "lat": 13.08490176,
    "lng": 77.46560622,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150265",
      "29150267",
      "29150254",
      "29150268",
      "29150280"
    ],
    "routesMap": {}
  },
  {
    "name": "Honnasandra Mattahalli",
    "lat": 13.11712202,
    "lng": 77.44732819,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150094",
      "29150091"
    ],
    "routesMap": {}
  },
  {
    "name": "Siemens Bank Muthkuru",
    "lat": 13.14915848,
    "lng": 77.49674052,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150066",
      "29150057",
      "29150036"
    ],
    "routesMap": {}
  },
  {
    "name": "Kumbarahalli Cross Soldevanahalli",
    "lat": 13.09669211,
    "lng": 77.4939672,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150269",
      "29150249",
      "29150251"
    ],
    "routesMap": {}
  },
  {
    "name": "Madugirihalli Shivakote",
    "lat": 13.12790046,
    "lng": 77.50722393,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150076",
      "29150055",
      "29150052",
      "29150051"
    ],
    "routesMap": {}
  },
  {
    "name": "Karlapalya Kanasawadi",
    "lat": 13.20860208,
    "lng": 77.50087491,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150008",
      "29150016",
      "29150007"
    ],
    "routesMap": {}
  },
  {
    "name": "Harohalli Palya",
    "lat": 13.17113134,
    "lng": 77.51154933,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150036",
      "29150035"
    ],
    "routesMap": {}
  },
  {
    "name": "Harohallipalya Cross",
    "lat": 13.166649,
    "lng": 77.51675314,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150036",
      "29150032",
      "29150035"
    ],
    "routesMap": {}
  },
  {
    "name": "Hesaraghatta Work shop",
    "lat": 13.15628726,
    "lng": 77.49849334,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150036"
    ],
    "routesMap": {}
  },
  {
    "name": "Koli Farm Gate Hesaraghatta",
    "lat": 13.1718995,
    "lng": 77.50281103,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150036"
    ],
    "routesMap": {}
  },
  {
    "name": "Byrapura Village Arakere",
    "lat": 13.20105021,
    "lng": 77.52296381,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150019",
      "29150010",
      "29150011"
    ],
    "routesMap": {}
  },
  {
    "name": "Muthugadahalli Shivakote",
    "lat": 13.14117267,
    "lng": 77.52618648,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150050",
      "29150054"
    ],
    "routesMap": {}
  },
  {
    "name": "Amba Bhavaninagara Shyamarajapura",
    "lat": 13.09712462,
    "lng": 77.54599124,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150236",
      "29150106",
      "29150235",
      "29150243",
      "29150244",
      "29150234",
      "29150227"
    ],
    "routesMap": {}
  },
  {
    "name": "Kempanahalli",
    "lat": 13.1065316,
    "lng": 77.54886991,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150106",
      "29150105"
    ],
    "routesMap": {}
  },
  {
    "name": "Shamarajapura MS Palya",
    "lat": 13.1041896,
    "lng": 77.54662894,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150106",
      "29150235",
      "29150244",
      "29150105"
    ],
    "routesMap": {}
  },
  {
    "name": "Nellukunte Marasandra",
    "lat": 13.22212138,
    "lng": 77.54198021,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150005",
      "29150002",
      "29150004"
    ],
    "routesMap": {}
  },
  {
    "name": "Nagenahalli Yelahanka",
    "lat": 13.13111139,
    "lng": 77.57467747,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150045",
      "29150079",
      "29150077",
      "29150078",
      "29150082",
      "29150083"
    ],
    "routesMap": {}
  },
  {
    "name": "Depot46 Sadenahalli",
    "lat": 13.18748003,
    "lng": 77.56340213,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150023",
      "29150006",
      "29150028",
      "29150014"
    ],
    "routesMap": {}
  },
  {
    "name": "",
    "lat": 13.10038064,
    "lng": 77.58865078,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150145",
      "29150138",
      "29150147",
      "29150172",
      "29150177",
      "29150182",
      "29150186",
      "29150187",
      "29150188",
      "29150189",
      "29150199"
    ],
    "routesMap": {}
  },
  {
    "name": "Kenchanahalli Yelahanka",
    "lat": 13.11953178,
    "lng": 77.58437634,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150080",
      "29150141",
      "29150143",
      "29150083",
      "29150108",
      "29150081"
    ],
    "routesMap": {}
  },
  {
    "name": "T Agrahara Tharahunase",
    "lat": 13.18134954,
    "lng": 77.57890575,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150029"
    ],
    "routesMap": {}
  },
  {
    "name": "Sri Rakum School Bettenahalli",
    "lat": 13.19485137,
    "lng": 77.58925866,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150015"
    ],
    "routesMap": {}
  },
  {
    "name": "Surabhi Layout Yelahanka",
    "lat": 13.09608748,
    "lng": 77.60015443,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150194",
      "29150184",
      "29150196",
      "29150197",
      "29150200",
      "29150201",
      "29150190",
      "29150191",
      "29150192"
    ],
    "routesMap": {}
  },
  {
    "name": "Jnana Deepika Bhargavi English School",
    "lat": 13.08223393,
    "lng": 77.58808784,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150207",
      "29150209",
      "29150210",
      "29150211",
      "29150212"
    ],
    "routesMap": {}
  },
  {
    "name": "Judical Layout Jn of 14th Cross",
    "lat": 13.08346315,
    "lng": 77.58470894,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150207",
      "29150209",
      "29150210",
      "29150211",
      "29150212"
    ],
    "routesMap": {}
  },
  {
    "name": "IITGF",
    "lat": 13.10249834,
    "lng": 77.62880847,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150375",
      "29150376"
    ],
    "routesMap": {}
  },
  {
    "name": "Kogilu Agrahara Layout",
    "lat": 13.10265313,
    "lng": 77.62768731,
    "dailyTrips": 0,
    "routesCount": 1,
    "topRoutes": [
      "290E PTH-AJB"
    ],
    "boothCodes": [
      "29150375",
      "29150376"
    ],
    "routesMap": {
      "290E PTH-AJB": 0
    }
  },
  {
    "name": "Kogilu Layout",
    "lat": 13.10478286,
    "lng": 77.6297754,
    "dailyTrips": 0,
    "routesCount": 0,
    "topRoutes": [],
    "boothCodes": [
      "29150375",
      "29150376"
    ],
    "routesMap": {}
  }
];

// 4. Complete Official Routes List with Trips, Type, and Corridors (from ac150-stops.csv)
export const OFFICIAL_BMTC_ROUTES: BMTCRouteRecord[] = [
  {
    "route": "55-B",
    "trips": 10519,
    "type": "Ordinary Non-AC",
    "corridor": "Whitefield / ITPL ⇄ HAL ⇄ Majestic"
  },
  {
    "route": "401-MK",
    "trips": 6112,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-BR",
    "trips": 5848,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-K",
    "trips": 5429,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "289-A",
    "trips": 5141,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "356-CW-FLY",
    "trips": 4899,
    "type": "Ordinary Non-AC",
    "corridor": "Electronic City ⇄ Silk Board ⇄ Majestic"
  },
  {
    "route": "401-A",
    "trips": 4648,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "402-B",
    "trips": 4389,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "290-E",
    "trips": 4368,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "401-F",
    "trips": 4320,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-R",
    "trips": 4048,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-B",
    "trips": 3696,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
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
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-CB",
    "trips": 3150,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
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
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
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
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "V-500DA",
    "trips": 2755,
    "type": "Vajra Volvo AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "289-CA",
    "trips": 2716,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "289-F",
    "trips": 2716,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "401-AF",
    "trips": 2656,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
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
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "289-P",
    "trips": 2522,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
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
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "402-D",
    "trips": 2173,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "G-9",
    "trips": 2135,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-BC",
    "trips": 2128,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-BJ",
    "trips": 2106,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "G-11",
    "trips": 2100,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-B",
    "trips": 2052,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
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
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
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
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-MA",
    "trips": 1786,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "G-8",
    "trips": 1764,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "G-7",
    "trips": 1763,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-BA",
    "trips": 1760,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
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
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-Y",
    "trips": 1656,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
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
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-M",
    "trips": 1575,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "297-K",
    "trips": 1552,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-MY",
    "trips": 1552,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BC-8",
    "trips": 1548,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PHS-34",
    "trips": 1530,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401 NLO-YHK",
    "trips": 1520,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "258-X",
    "trips": 1512,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "401-MS",
    "trips": 1480,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-JB",
    "trips": 1472,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "280-A",
    "trips": 1456,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "251-B",
    "trips": 1440,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "280-F",
    "trips": 1428,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-AE",
    "trips": 1421,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-T",
    "trips": 1376,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "224-DA",
    "trips": 1358,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-D",
    "trips": 1335,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-N",
    "trips": 1295,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "507-D",
    "trips": 1269,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-L",
    "trips": 1261,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "255-L",
    "trips": 1248,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "281-C",
    "trips": 1242,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-M",
    "trips": 1242,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-285M",
    "trips": 1224,
    "type": "Vajra Volvo AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "284-B",
    "trips": 1224,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "404-E",
    "trips": 1220,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-9",
    "trips": 1216,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-C",
    "trips": 1208,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "280-K",
    "trips": 1176,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "295-G",
    "trips": 1173,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-A",
    "trips": 1170,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "401-A PSB-YKHOT",
    "trips": 1162,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "407-F",
    "trips": 1160,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-B",
    "trips": 1144,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "500-Y",
    "trips": 1144,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "258-G",
    "trips": 1134,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "243-L",
    "trips": 1128,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "291-D",
    "trips": 1122,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284-KA",
    "trips": 1122,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-MYH",
    "trips": 1116,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-MG",
    "trips": 1081,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "245-M",
    "trips": 1080,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "401-AR",
    "trips": 1079,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-PS",
    "trips": 1079,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-AM",
    "trips": 1078,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "258-B",
    "trips": 1071,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "289-D",
    "trips": 1067,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "242-RA",
    "trips": 1064,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "401-RH",
    "trips": 1020,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "CHAKRA-10",
    "trips": 1020,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-HA",
    "trips": 1017,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-AB",
    "trips": 1015,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "284-D",
    "trips": 1012,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-VF",
    "trips": 1008,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "245-H",
    "trips": 992,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "257-E",
    "trips": 986,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-A",
    "trips": 979,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "AS-7",
    "trips": 976,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "500-DG",
    "trips": 970,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "298-E",
    "trips": 970,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284-K",
    "trips": 969,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-N",
    "trips": 968,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YSTF-CSB",
    "trips": 968,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "283-A",
    "trips": 966,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-E",
    "trips": 966,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "300-F",
    "trips": 952,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "265-E",
    "trips": 948,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-LA",
    "trips": 946,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "253-G",
    "trips": 902,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-U",
    "trips": 897,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "282-B",
    "trips": 897,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "256-M",
    "trips": 873,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "500-AC",
    "trips": 873,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "289-H",
    "trips": 873,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "G-9A",
    "trips": 854,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-J",
    "trips": 850,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284-A",
    "trips": 828,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "297-A",
    "trips": 828,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-AN",
    "trips": 819,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-258C",
    "trips": 819,
    "type": "Vajra Volvo AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-VC",
    "trips": 819,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "362-C",
    "trips": 819,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-J",
    "trips": 815,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "258-WA",
    "trips": 814,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "507-C",
    "trips": 812,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-TB",
    "trips": 795,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-AB",
    "trips": 792,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "285-V",
    "trips": 792,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "258-F",
    "trips": 781,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "291-G",
    "trips": 780,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-335EN",
    "trips": 776,
    "type": "Vajra Volvo AC",
    "corridor": "Whitefield / ITPL ⇄ HAL ⇄ Majestic"
  },
  {
    "route": "402-C",
    "trips": 759,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "282-F",
    "trips": 759,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "283-E",
    "trips": 759,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-TA",
    "trips": 756,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "285-R",
    "trips": 752,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-MK",
    "trips": 752,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "278-A",
    "trips": 752,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "256-B",
    "trips": 748,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-TC",
    "trips": 744,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "JHC-YHK",
    "trips": 740,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-QA",
    "trips": 737,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "245-J",
    "trips": 728,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "285-K",
    "trips": 714,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "248-Y",
    "trips": 704,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-RA",
    "trips": 704,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "KIAS-8",
    "trips": 704,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-A",
    "trips": 702,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-YA",
    "trips": 693,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-P",
    "trips": 693,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-SA",
    "trips": 693,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "248-J",
    "trips": 690,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "281-G",
    "trips": 690,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-K CLO-YHKOT",
    "trips": 684,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "276-AB",
    "trips": 682,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-JE",
    "trips": 680,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "374-M",
    "trips": 676,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "240-F",
    "trips": 676,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHKOT-YTTMC",
    "trips": 664,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-GA",
    "trips": 650,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "KIAS-5",
    "trips": 640,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-P",
    "trips": 637,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "258-S",
    "trips": 630,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-MA",
    "trips": 630,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "240-R",
    "trips": 630,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241-CD",
    "trips": 627,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-MS",
    "trips": 621,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "299-E",
    "trips": 621,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-E",
    "trips": 616,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "402-M",
    "trips": 616,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "356-J",
    "trips": 616,
    "type": "Ordinary Non-AC",
    "corridor": "Electronic City ⇄ Silk Board ⇄ Majestic"
  },
  {
    "route": "500-DA",
    "trips": 616,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "YHK-NITT",
    "trips": 616,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-N",
    "trips": 615,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "242-Z",
    "trips": 612,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "KMT-HBL-YHKOT",
    "trips": 612,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-JC YTTMC-BKH",
    "trips": 609,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "263-R",
    "trips": 603,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-RA",
    "trips": 598,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-AA",
    "trips": 592,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-H",
    "trips": 588,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-J",
    "trips": 588,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-C",
    "trips": 588,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "250-LA",
    "trips": 582,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-A YHKOT-BKH",
    "trips": 582,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KBS-YSTF-PTH",
    "trips": 576,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-VB",
    "trips": 567,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-K",
    "trips": 567,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-SB",
    "trips": 567,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-KA",
    "trips": 567,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-E",
    "trips": 567,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "256-MA",
    "trips": 567,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "291-K",
    "trips": 567,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-H",
    "trips": 564,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "DVH-YHKOT",
    "trips": 564,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-K",
    "trips": 558,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "251-G",
    "trips": 558,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "380 KMT-KTO",
    "trips": 558,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "282-D",
    "trips": 552,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-ME",
    "trips": 552,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "283-B",
    "trips": 552,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-MH",
    "trips": 552,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-B",
    "trips": 552,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "298-A",
    "trips": 552,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-M",
    "trips": 552,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "YTTMC-PTC",
    "trips": 546,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-Q",
    "trips": 544,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "253-E",
    "trips": 540,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "252-C",
    "trips": 532,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YSTF-SBS",
    "trips": 528,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "280-E",
    "trips": 528,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-H",
    "trips": 522,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "263-K",
    "trips": 520,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-D",
    "trips": 520,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "MF-23",
    "trips": 518,
    "type": "Metro Feeder",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-6",
    "trips": 512,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHK-YTTMC-PSB",
    "trips": 510,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-L",
    "trips": 506,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "245-F",
    "trips": 504,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-V",
    "trips": 504,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-H",
    "trips": 504,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-DN",
    "trips": 504,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-R",
    "trips": 504,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "285-RC",
    "trips": 504,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "280-L",
    "trips": 504,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-D",
    "trips": 500,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-RB",
    "trips": 500,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "401-B YHKOT-MSP-HPN",
    "trips": 498,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "245-GA",
    "trips": 494,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "V-500DA BSK-YHK5",
    "trips": 492,
    "type": "Vajra Volvo AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "242-T",
    "trips": 486,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "297 YHKOT-BVP",
    "trips": 485,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-MA",
    "trips": 483,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-N",
    "trips": 480,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-X",
    "trips": 480,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "285-A",
    "trips": 480,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KIAS-7",
    "trips": 480,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-12",
    "trips": 480,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-8A",
    "trips": 480,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-G",
    "trips": 470,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "281-A",
    "trips": 469,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "374-MA",
    "trips": 468,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-D",
    "trips": 468,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "KBS-MGDRD-D35G",
    "trips": 468,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-FB",
    "trips": 468,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "313-T",
    "trips": 468,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-500DR",
    "trips": 468,
    "type": "Vajra Volvo AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "240-E",
    "trips": 462,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "215-C",
    "trips": 462,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-LA",
    "trips": 456,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "240-A",
    "trips": 456,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YTTMC-YHKOT",
    "trips": 456,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "K-6",
    "trips": 451,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-T",
    "trips": 444,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "250-DA",
    "trips": 437,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "256-K",
    "trips": 434,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-HA",
    "trips": 434,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-CA",
    "trips": 423,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "245-K",
    "trips": 416,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "245-Q",
    "trips": 416,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "YHKOT-TMK-KMT",
    "trips": 415,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "290-QA",
    "trips": 414,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "298-MG",
    "trips": 414,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-B",
    "trips": 414,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GITAM-YHK-HBL-KRP",
    "trips": 410,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-A",
    "trips": 408,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-YST-PTH",
    "trips": 408,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-TA",
    "trips": 407,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KMT-BSFY",
    "trips": 402,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284-G",
    "trips": 400,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "282-H",
    "trips": 399,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "281-F",
    "trips": 399,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "61-C",
    "trips": 392,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "402-A",
    "trips": 391,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-YSTF",
    "trips": 390,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHK-CKH",
    "trips": 388,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-U",
    "trips": 380,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "245-C",
    "trips": 380,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "245-MA",
    "trips": 378,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-J",
    "trips": 378,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "256-MB",
    "trips": 378,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VSD-NML",
    "trips": 378,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTN-YHKOT",
    "trips": 378,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-BB",
    "trips": 372,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "DVHGH-PTH",
    "trips": 372,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-A JHC-YHK",
    "trips": 370,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "320-C",
    "trips": 364,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "250-B",
    "trips": 364,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-R",
    "trips": 360,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-F",
    "trips": 360,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-Q",
    "trips": 360,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-ZD",
    "trips": 360,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "253-J",
    "trips": 360,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BSK-DPJN",
    "trips": 360,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255 YTTMC-MTH",
    "trips": 356,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "500-DY",
    "trips": 352,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "KIAS-7A",
    "trips": 352,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-P",
    "trips": 351,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "271-E",
    "trips": 348,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-D",
    "trips": 348,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "297-B",
    "trips": 345,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-5A",
    "trips": 344,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-K KBS-PTML",
    "trips": 343,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "242-J",
    "trips": 342,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-R",
    "trips": 342,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "253-H",
    "trips": 341,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-BA",
    "trips": 336,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-W",
    "trips": 336,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-K NES-PTML",
    "trips": 336,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "NITT-2",
    "trips": 336,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BYH-KBS",
    "trips": 335,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MNKH-KBS",
    "trips": 328,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHKOT-BMSIT",
    "trips": 328,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "296-K",
    "trips": 328,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-DA",
    "trips": 324,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-M",
    "trips": 324,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "248-Z",
    "trips": 324,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-HE",
    "trips": 324,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "240-C",
    "trips": 322,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "263-E",
    "trips": 322,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-KA",
    "trips": 321,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "242-H",
    "trips": 320,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "240-N",
    "trips": 320,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "240-M",
    "trips": 320,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-P",
    "trips": 320,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "KIAS-8D",
    "trips": 320,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-L",
    "trips": 318,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "245-AA",
    "trips": 316,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "JKLO-NML",
    "trips": 315,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-Y",
    "trips": 315,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-VG",
    "trips": 315,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-VA",
    "trips": 315,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "YHKOT-HSG",
    "trips": 315,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CHAKRA-10A",
    "trips": 312,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284-C",
    "trips": 312,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "336-B SNBS-KMP",
    "trips": 310,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YNTAEH-BMSITY",
    "trips": 308,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "291-L",
    "trips": 306,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-FA",
    "trips": 304,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "240-J",
    "trips": 304,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-K VJN-YHKOT",
    "trips": 304,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401-B DPJN-YHKOT",
    "trips": 302,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "500-A BSK-YSTF",
    "trips": 301,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "285-G",
    "trips": 300,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "ASK-GGP-KRP",
    "trips": 291,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YSTF-ITPL",
    "trips": 290,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-ZB",
    "trips": 288,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "298-Y",
    "trips": 288,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-4",
    "trips": 288,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-4A",
    "trips": 288,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-8EW",
    "trips": 288,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-JK",
    "trips": 287,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "507-C YPRS-KRPG",
    "trips": 286,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-CB YTTMC-DSP",
    "trips": 285,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "D10G-RCH",
    "trips": 282,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHKOT-MLPH",
    "trips": 282,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KRP-YHK-HBL-GITHM",
    "trips": 282,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CKH-YHK",
    "trips": 282,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-JA",
    "trips": 280,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "243-M",
    "trips": 280,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "240-K",
    "trips": 280,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-C",
    "trips": 280,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "283E PTML-THS",
    "trips": 280,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-F PTH-HSK",
    "trips": 279,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "BMH-PTH",
    "trips": 279,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401BJ PTH-YHK-BLR",
    "trips": 279,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "KBS-KIAS",
    "trips": 276,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-K",
    "trips": 276,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "297-F",
    "trips": 276,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "281-H",
    "trips": 276,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-E KBS-NSP",
    "trips": 273,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-D",
    "trips": 273,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-YST",
    "trips": 268,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CRPF-KBS",
    "trips": 267,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ACC B-56",
    "trips": 264,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-Y",
    "trips": 264,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "NML-KGR",
    "trips": 261,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-8C",
    "trips": 256,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "215-E",
    "trips": 253,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "362-K",
    "trips": 250,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-LA",
    "trips": 248,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KDG-CSB-D34",
    "trips": 245,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-F",
    "trips": 243,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-MA",
    "trips": 240,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-Y",
    "trips": 240,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "241-M",
    "trips": 240,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "240-MB",
    "trips": 240,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-ZC",
    "trips": 240,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "410-T",
    "trips": 240,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-SBS",
    "trips": 240,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "243-L KMT-LDH",
    "trips": 238,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "221-L",
    "trips": 234,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-K",
    "trips": 234,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SBS-PTH",
    "trips": 232,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "254-C",
    "trips": 231,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-AC",
    "trips": 228,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-MC",
    "trips": 228,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CRISTAL-5",
    "trips": 225,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285 PTH-YHKOT",
    "trips": 225,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KIAS-6A",
    "trips": 224,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-TA",
    "trips": 220,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "256 KBS-SVNC",
    "trips": 216,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-V",
    "trips": 216,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "238-H",
    "trips": 216,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241-G",
    "trips": 216,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-W",
    "trips": 216,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "NICE-7A",
    "trips": 215,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "378 KGR-ELCW",
    "trips": 214,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D10G-TNS-YHKOT",
    "trips": 213,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "327-B",
    "trips": 210,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMSIT-8",
    "trips": 210,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMSIT-8A",
    "trips": 210,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-C",
    "trips": 208,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-P",
    "trips": 208,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "297-M",
    "trips": 208,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-500DE",
    "trips": 208,
    "type": "Vajra Volvo AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "283-D",
    "trips": 207,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "254-A  DSP-KGT",
    "trips": 206,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "IAF-HMPN",
    "trips": 206,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-B",
    "trips": 204,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "60-L VTTMC-EASTEND",
    "trips": 204,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401 YHKOT-MSP",
    "trips": 204,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "YRSTN-YHK",
    "trips": 204,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-M KBS-PTH",
    "trips": 203,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "215-HB",
    "trips": 198,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241-H",
    "trips": 196,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-A",
    "trips": 196,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-A KBS-MNH",
    "trips": 195,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "500-DG NML-JKLOA",
    "trips": 194,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "500-DG NMG-KRPRS",
    "trips": 194,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "ASK-NGS",
    "trips": 194,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHKOT-BDL",
    "trips": 194,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "282-C YHK-BLR",
    "trips": 194,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289 YHKOT-ARS",
    "trips": 194,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "298Y YHKOT-YLR",
    "trips": 194,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHK-KDGC",
    "trips": 194,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "250-SA",
    "trips": 192,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-NMS",
    "trips": 192,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "NITT-1A",
    "trips": 192,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-5B",
    "trips": 192,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-8B",
    "trips": 192,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-14",
    "trips": 192,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YTTMC-MSP-CHRS",
    "trips": 190,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YTTMC-YLK-BMES",
    "trips": 190,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YTTMC-NML-KNW",
    "trips": 189,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-BN KVN-NML",
    "trips": 189,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-VD",
    "trips": 189,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "285-CC",
    "trips": 188,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "HNS-YLKOT",
    "trips": 188,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-N YTTMC-ASK",
    "trips": 186,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "253-HC",
    "trips": 186,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285V YHK-SNH",
    "trips": 186,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "43-E SNBS-SVN",
    "trips": 186,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298M PTH-DVHOB",
    "trips": 186,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289CA PTH-HNH",
    "trips": 186,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "298 PTH-DVH",
    "trips": 186,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-N DPJN-YHK",
    "trips": 185,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "500-DG DSP-KRPRS",
    "trips": 184,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "401-B YNTAEH-YTTMC",
    "trips": 183,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401 BMT45-JSNL",
    "trips": 182,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "401 BMT45-YHKOT",
    "trips": 181,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "SGH-KBS",
    "trips": 180,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-J",
    "trips": 180,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YTTMC-OASIS",
    "trips": 178,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KMT-HGV",
    "trips": 175,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BELGS-29",
    "trips": 172,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-C KBS-DSP",
    "trips": 171,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "234-E GOODSHED",
    "trips": 171,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-ADT",
    "trips": 170,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "500-C",
    "trips": 168,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "250-SB",
    "trips": 168,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "502-K",
    "trips": 168,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-D",
    "trips": 168,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-KTNH",
    "trips": 164,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-G KMT-KNW",
    "trips": 164,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-K PTML-NES",
    "trips": 160,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "258-CB YTTMC-ADK",
    "trips": 159,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "KBS-MNKH",
    "trips": 158,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "250-V",
    "trips": 156,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "250-J",
    "trips": 156,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-G",
    "trips": 156,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "TNS-PSS",
    "trips": 155,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BTP-26B",
    "trips": 155,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-L YSTF-MVJ",
    "trips": 154,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "215-Y",
    "trips": 154,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-215H",
    "trips": 154,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "215-W",
    "trips": 154,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MNH-HBL",
    "trips": 152,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VRP-YHKOT",
    "trips": 152,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YSTF-MADT",
    "trips": 150,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "JTS-PSS",
    "trips": 148,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285MA PTML-CVB",
    "trips": 148,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "ADT-BMH",
    "trips": 148,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "NICE-7",
    "trips": 147,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "251-M",
    "trips": 147,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-SGH",
    "trips": 145,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "271-E KMT-VRS",
    "trips": 145,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-500DA YSTF-ELCW",
    "trips": 145,
    "type": "Vajra Volvo AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "KDG-PTH",
    "trips": 145,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-B D31G-TVK",
    "trips": 144,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-VA",
    "trips": 144,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "D35G-MGDRD-KBS",
    "trips": 144,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VBN-TVK",
    "trips": 144,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "250-AD",
    "trips": 144,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-CA NES-JKBH",
    "trips": 144,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "248-D",
    "trips": 144,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ITPL-8A",
    "trips": 144,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-DVHGH",
    "trips": 144,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-MGH",
    "trips": 144,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-LA YSTF-HSK",
    "trips": 143,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "250-E",
    "trips": 143,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "215-HA",
    "trips": 143,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-CB YBS-SDKP",
    "trips": 142,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "290 KBS-YLKOT",
    "trips": 142,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "280-F YSTF-HSK",
    "trips": 141,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "263-G",
    "trips": 140,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241-CB",
    "trips": 140,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-K BMT46-KDYH",
    "trips": 140,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KBS-YST-ADT",
    "trips": 140,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VNS-15",
    "trips": 140,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MBS-6",
    "trips": 138,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-PD",
    "trips": 138,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KMT-VSNP",
    "trips": 138,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "297-B KBS-DGH",
    "trips": 138,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "297 STP-AFSY",
    "trips": 138,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298 KMT-BYNH",
    "trips": 138,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "374-N",
    "trips": 136,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258- KMT-LKH",
    "trips": 136,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "256-B YTTMC-GJDH",
    "trips": 136,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-B",
    "trips": 135,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMT45-YST-DSH",
    "trips": 133,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MEBP-26",
    "trips": 132,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-500BM",
    "trips": 132,
    "type": "Vajra Volvo AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "258-GA KBS-BMSH",
    "trips": 130,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "241-B",
    "trips": 130,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-A",
    "trips": 130,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298-P",
    "trips": 128,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BEMLA-7",
    "trips": 128,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "283-D PTML-KDGC",
    "trips": 128,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "TR-4 JJN-PLG",
    "trips": 128,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-M KBS-HLK",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-D KMT-TBS",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-M KBS-YMH",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-MA YTTMC-JKH",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-SD YTTMC-BNH",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-T YTTMC-PRSH",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-V KBS-GRH",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-MC YTTMC-KBH",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-C KBS-GDP",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-G KBS-HSHA",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258X MTNT-NMGRS",
    "trips": 126,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258 KMT-ASK",
    "trips": 124,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-C KBS-ASK",
    "trips": 124,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258 JHC-ASK",
    "trips": 124,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "253-A BMT45-LKPC-BYT",
    "trips": 123,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMES-5A",
    "trips": 123,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "254-A",
    "trips": 121,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "410-FC BSK-TVK",
    "trips": 120,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KMT-VDH-CFLS",
    "trips": 120,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "334-E",
    "trips": 120,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-E",
    "trips": 117,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YSTF-YTTMC",
    "trips": 116,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D13G-ISRO",
    "trips": 116,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284-H",
    "trips": 115,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-TA KBS-MTK",
    "trips": 114,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "240-A KBS-MCH",
    "trips": 114,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258 KMT-DSP",
    "trips": 114,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "253-L",
    "trips": 114,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "12F-5",
    "trips": 112,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KMT-NGM",
    "trips": 111,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "297-B PTML-DGH",
    "trips": 111,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "250-DT",
    "trips": 110,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-M",
    "trips": 110,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401 PTMTL-YTTMC",
    "trips": 110,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "CS-JDV-ACC B6",
    "trips": 110,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MBS2 PTH-MRHSPG",
    "trips": 109,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-M KHC-VDHTC",
    "trips": 108,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "D35G-SBS",
    "trips": 108,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SBS-KBS-D35G",
    "trips": 108,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-B BSN-TVK",
    "trips": 108,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "D35G-KGR",
    "trips": 108,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-VRP-KBS",
    "trips": 108,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "500-DE",
    "trips": 108,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "CRHS-6",
    "trips": 108,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-BJ BMSITY-BGLR",
    "trips": 108,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "PTH-SBSH",
    "trips": 108,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-X VNC-MTNT",
    "trips": 106,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "502-HE",
    "trips": 105,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "250-LA ADGH-MHC",
    "trips": 105,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276-A",
    "trips": 105,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "398-H",
    "trips": 104,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "NICE-8",
    "trips": 104,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-SBS1",
    "trips": 104,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "406 YLKOT-NMG",
    "trips": 103,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-MC PTML-DBP",
    "trips": 102,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "V-HBL-YHKOT",
    "trips": 102,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D10G-YHKOT",
    "trips": 102,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-R KBS-DJP",
    "trips": 100,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "254-D",
    "trips": 100,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D11-PTN",
    "trips": 99,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-HRH",
    "trips": 98,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-C KBS-DTMKR",
    "trips": 98,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-K KMT-PMTL",
    "trips": 98,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "356-CD HSR BC-DTG",
    "trips": 98,
    "type": "Ordinary Non-AC",
    "corridor": "Electronic City ⇄ Silk Board ⇄ Majestic"
  },
  {
    "route": "500-DG NMG-HBLB",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "502-C ASK-KRPGH",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ASK-DBKL",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "410-K NMG-BSK",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "502-FA NMG-SMH",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHK-MLH",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "297-G",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHKOT-DVH",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YLKOT-TRPT-KNDC",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-L YHKOT-CKHL",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "297 YHK-HGH",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHKOT-DVH-BMW",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298 YHKOT-BYNH",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "64 DPN-SBS",
    "trips": 97,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401 YSTF-YTTMC",
    "trips": 96,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "MBS-9",
    "trips": 96,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-6K",
    "trips": 96,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-M HBL-DBP",
    "trips": 94,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-M KBS-GITAM",
    "trips": 94,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "298Y PTH-YHS",
    "trips": 94,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADT-IAF",
    "trips": 94,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADT-NMG",
    "trips": 94,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289-F MDR-YHOT",
    "trips": 94,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "BTP-26",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "RJP- PTH",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-MNH",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GDH-PTH",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-KLP",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-KIAS",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-BDL",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KLP-PTH",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-KNDC",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "297-G PTH-DCH",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "297F PTH-BVP",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "289 PTH-BKHL",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "282-A PTH-HSH",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298 PTH-IAF",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298PD PTH-NLR",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "HNH-PTH",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-CHK",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-HNS",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-NGH",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-IAF",
    "trips": 93,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "502-C DSP-GGP-KRP",
    "trips": 92,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "502-L DSP-KTP",
    "trips": 92,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-R NES-CHL",
    "trips": 92,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "YNALL-DBP",
    "trips": 92,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-E JHC-NSP",
    "trips": 91,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-BSF",
    "trips": 91,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-E BMT40C-NSP",
    "trips": 90,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "240-F KMT-MDH",
    "trips": 90,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "272-B",
    "trips": 90,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-RA NES-HNYR",
    "trips": 90,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "BMSIT-PTH-YHK",
    "trips": 90,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-A YTTMC-HKV",
    "trips": 89,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-D JHC-HSK",
    "trips": 89,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-B HPN-YTTMC",
    "trips": 89,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "407-E YLKOT-LGNH",
    "trips": 89,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-Y D31G-PLH",
    "trips": 88,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-C YTTMC-PLH",
    "trips": 88,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-335EK",
    "trips": 88,
    "type": "Vajra Volvo AC",
    "corridor": "Whitefield / ITPL ⇄ HAL ⇄ Majestic"
  },
  {
    "route": "399-A",
    "trips": 88,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-RB YHK-MTR",
    "trips": 88,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "YSTF-JBS",
    "trips": 88,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YSTF-BEMLF",
    "trips": 88,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "356J YSTF-AGS-ATB",
    "trips": 88,
    "type": "Ordinary Non-AC",
    "corridor": "Electronic City ⇄ Silk Board ⇄ Majestic"
  },
  {
    "route": "500-A BSK-HBLB-PTH",
    "trips": 87,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "BELGS-26",
    "trips": 87,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHKOT-VRP",
    "trips": 86,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-J KBS-HNS",
    "trips": 85,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-J YTTMC-HNS",
    "trips": 85,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-A ADK-HSK",
    "trips": 84,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "263-B",
    "trips": 84,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "NLM-F2",
    "trips": 84,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-H KBS-KLH",
    "trips": 84,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "YHK-KNR",
    "trips": 84,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YLKOT-BMES",
    "trips": 84,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHK-MSP-VTTMC",
    "trips": 83,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MADT-BCP",
    "trips": 83,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-B KBS-BKPN",
    "trips": 82,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "245-M MNKH-MRTG",
    "trips": 82,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "YTTMC-SDP",
    "trips": 82,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BSK-MNH",
    "trips": 82,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285 YHKOT-BMSITY",
    "trips": 82,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "GPO-CVB-YSTF",
    "trips": 82,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-TGV",
    "trips": 81,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-KDG",
    "trips": 81,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-CSB",
    "trips": 81,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH- BPS",
    "trips": 81,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-BSK",
    "trips": 81,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "500D PTH-MRH SPG",
    "trips": 81,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "CFLS-KMT",
    "trips": 80,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-JA KMT-GNK",
    "trips": 80,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "401 YTTMC-BMSIT",
    "trips": 80,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "503-A",
    "trips": 80,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-KNR",
    "trips": 80,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-CKH",
    "trips": 80,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "JPT-D35G",
    "trips": 78,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-JB THDL-KBS",
    "trips": 78,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "502-V",
    "trips": 77,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SDNIBK-YSTF",
    "trips": 77,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YHKOT-HRTAD",
    "trips": 77,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D34G-KBS",
    "trips": 77,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GITAM-1",
    "trips": 76,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-KCH",
    "trips": 74,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284 PTH-KVRYHK",
    "trips": 74,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-KVRYHK",
    "trips": 74,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "250SA KDG-ASK",
    "trips": 73,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "377-B",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D04-SGH",
    "trips": 72,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "335-P D35G-KDG",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "Whitefield / ITPL ⇄ HAL ⇄ Majestic"
  },
  {
    "route": "242 D35G-SJT-KBS",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "265-A KBS-D35G",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-E",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "410-FC TVK-DPN",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-MGDT",
    "trips": 72,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "12F-3",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276-E",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BYH-PTH",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298ME PTH-DVHGH",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMT11-YSTF",
    "trips": 72,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258 JHC-TVK",
    "trips": 71,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258 YTTMC-TVK",
    "trips": 71,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-F KMT-SVP",
    "trips": 71,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "285M PTMTL-JLO",
    "trips": 70,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KNR-PTH",
    "trips": 70,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-JLO",
    "trips": 69,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-BDL",
    "trips": 69,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-ISNH",
    "trips": 69,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KRPRS-HMRH",
    "trips": 69,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "298M KBS-VTHM",
    "trips": 69,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VNS-YHK-TRT",
    "trips": 69,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-B KBS-NGR",
    "trips": 68,
    "type": "Ordinary Non-AC",
    "corridor": "Whitefield / ITPL ⇄ HAL ⇄ Majestic"
  },
  {
    "route": "258-CB YTTMC-HGP",
    "trips": 68,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "D06G-BMSIT",
    "trips": 68,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CVB-JDLO",
    "trips": 68,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VNS-22",
    "trips": 68,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D31G-KMS",
    "trips": 67,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-MCH",
    "trips": 66,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-KBS-AIT",
    "trips": 66,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-PSS",
    "trips": 66,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "288-E",
    "trips": 66,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MTR-27",
    "trips": 66,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-500DA CSB-BGC",
    "trips": 66,
    "type": "Vajra Volvo AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "263 KMT-KMS",
    "trips": 65,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258 KMT-BTG",
    "trips": 64,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258C KBS-BGT",
    "trips": 64,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "399-F",
    "trips": 64,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "256 YTTMC-VNC",
    "trips": 64,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "254B KBH-DSP",
    "trips": 64,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-KTH",
    "trips": 64,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-W",
    "trips": 64,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KIAS-5G",
    "trips": 64,
    "type": "Airport Vayu Vajra AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "256-D KBS-RVT",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "G-8 MGRM-ISM",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-CB BELF-YTTMC-NMG",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-E YTTMC-MLH",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-E JHC-MLH",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-K KBS-YHG",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-P YTTMC-KGN",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-S YTTMC-RDH",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-SA KBS-VKP",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-SB KBS-ISVH",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-SB YTTMC-ISVH",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-SD KBS-BNH",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-Y KBS-MBWD",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-Y KBS-MBWDC-MBWD",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-D KBS-TBS",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258 KHC-SWK-NML",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-CB YTTMC-GDP",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258- VSD-MLC-NMG",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-CB PSB-NMG",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-VG YTTMC-PLN",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-H YTTMC-VDH",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-VD YTTMC-BDM",
    "trips": 63,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "245-H MRTG-NML",
    "trips": 62,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-CB YTTMC-ASK",
    "trips": 62,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-N VSD-ASK",
    "trips": 62,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258C NGS-ASK",
    "trips": 62,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "PSS-MLHP",
    "trips": 62,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-CKM",
    "trips": 62,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-SSPC",
    "trips": 62,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-B YTTMC-DBH",
    "trips": 62,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "VSD-YST5",
    "trips": 61,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D10G-YSTF",
    "trips": 61,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "227-J KMT-TVK",
    "trips": 61,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241-P",
    "trips": 60,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-M KHC-VTC",
    "trips": 59,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "401A BMSIT-PSS",
    "trips": 59,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "KBS-ADTS",
    "trips": 59,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "280K PTH-MTH",
    "trips": 59,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-H YTTMC-ALR",
    "trips": 58,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "RNBL-KBS",
    "trips": 58,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-M HBL-SGH",
    "trips": 58,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "SBS-NES-PTH",
    "trips": 58,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "G-8 MGRM-DSP",
    "trips": 57,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-CC KBS-DSP",
    "trips": 57,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "BMSIT-1",
    "trips": 57,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMSIT-5",
    "trips": 57,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "297-H",
    "trips": 57,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-J MRTG-KTH",
    "trips": 56,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "KBS-DSNH",
    "trips": 56,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "254-B",
    "trips": 56,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "400-V",
    "trips": 56,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MADT-ALS",
    "trips": 56,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ITPL-9A",
    "trips": 56,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ITI-01",
    "trips": 56,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "JKR-SRSRA",
    "trips": 56,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255H DSP-GDP",
    "trips": 55,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241-C",
    "trips": 55,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D34G-JBS-KMT",
    "trips": 55,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-KLD",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-MTH",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-Q",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VCS-MEBP-76 MNH-MEBP",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-VRP-TDL",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VRP-YTTMC",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BCS-BMSITY",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VCS-ORRCA-106 SNH-ORRCA Salarpuria Soft Zone",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-SRP",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-MRHB",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-DSHL",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "501C KGR-HBLB-PTH",
    "trips": 54,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-AC VNC-VDH",
    "trips": 53,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258 JHC-ADK",
    "trips": 53,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "JHC-TAPL",
    "trips": 53,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CLO-AVH",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VNC-D43",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CHAKRA-10 BMT10-HNRJ",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-R PTMT-CHL",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KBS-MVL",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401 YHKPS-YTTMC",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "KHC-JLO",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-DSKN",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-YHK-KRPH",
    "trips": 52,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "500AA-YHK-CSB",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "284-K KMT-AGS-JSNL",
    "trips": 52,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KDBC-MNKH",
    "trips": 51,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-JPT",
    "trips": 51,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "240-D",
    "trips": 51,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KMT-MVL",
    "trips": 51,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "269-B",
    "trips": 51,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GKVK-YHKOT",
    "trips": 51,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-CSB-YLK",
    "trips": 51,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-D YTTMC-KDG",
    "trips": 50,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-K NES-SDH",
    "trips": 50,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KDH-PTH",
    "trips": 50,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-TC KMT-SNDKP",
    "trips": 49,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "285-P KBS-BTH",
    "trips": 49,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "284 KBS-KVRYHK",
    "trips": 49,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "255-J  DSP-HNS",
    "trips": 48,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-319KH",
    "trips": 48,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BEMLA-10",
    "trips": 48,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-JC NES-JTH",
    "trips": 48,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-P NES-BTH",
    "trips": 48,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "276-N",
    "trips": 48,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BELF-NES-DBP",
    "trips": 47,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285M KBS-KRC-DBP",
    "trips": 47,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-M KBS-APEL",
    "trips": 47,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-CC NES-CTMK",
    "trips": 46,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-MF NES-KDH",
    "trips": 46,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-MG NES-BMGL",
    "trips": 46,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "NES-SDP",
    "trips": 46,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SGH-YHK-HBL-CSB",
    "trips": 46,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BTP-24",
    "trips": 46,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADITHI-04",
    "trips": 46,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-L NES-BYTH",
    "trips": 45,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KTH-KBS",
    "trips": 45,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "DSNH-KBS",
    "trips": 44,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-R",
    "trips": 44,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMT30-YST",
    "trips": 44,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D34G-JBS",
    "trips": 44,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D34G-KMT",
    "trips": 44,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADT-9",
    "trips": 44,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "HMV-ADTH",
    "trips": 44,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VCS-ITPB-GM-17 YLK-5-ITPL",
    "trips": 43,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276-G",
    "trips": 42,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "G-7 D31G-JTS",
    "trips": 41,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257B DSP-MKPL",
    "trips": 41,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-SDP",
    "trips": 41,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-H PTML-KLH",
    "trips": 41,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "242-N MRTG-GDH",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-ZD D31G-KLR",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-ZC CFLS-KBS",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-ZC KMT-BMH-KGH",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "240-MB KMT-MGD",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-V D31G-CKH",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "248-BA CLO-CKB",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "240-K MRTG-BSKR",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "240-MB MRTG-MGD",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241-M MRTG-SVND",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-E KBS-CNH",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-F MRTG-YLG",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-H MRTG-MDP",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-P SMH-HLH",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-Q MRTG-GNGH",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-Y MRTG-AMP",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "243-M MRTG-SPH",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-C BMT45-KKL",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "272-E",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-A KBS-NDH",
    "trips": 40,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "266 BEL-HIDF",
    "trips": 39,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-L PTML-HGV",
    "trips": 39,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-TMH",
    "trips": 39,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-L",
    "trips": 39,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-J MRTG-DMH",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-R MRTG-JGH",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "242-U MRTG-LKP",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "293-H",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D-31G-KDG",
    "trips": 38,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "361-B CPR-CHD",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-TNS",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "502-HB",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-X NES-DBR",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "313-A",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BWTC-201",
    "trips": 38,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "TPH-D35G",
    "trips": 37,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-RGH",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-E YTTMC-RGHL",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "TVK-VSD",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-TGP",
    "trips": 36,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GKH-D35G",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-STH",
    "trips": 36,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-V KMT-D35G",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "321-A",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-319HK",
    "trips": 36,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-W KMT-DBGL",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "KMT-SGHG",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-B MRTG-SGHG",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "D35G-SMH",
    "trips": 36,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-B CVB-D35G",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "D35G-BDH",
    "trips": 36,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-SWTK-SBS",
    "trips": 36,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-HRH-TGP",
    "trips": 36,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SGHG-SKT-JHC",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-YBS",
    "trips": 36,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SSPC-2",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241-E",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253 KMT-HSG",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-C PTML-DTMKR",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "306-L",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-276",
    "trips": 36,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-E NES-KKLV",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "CAPGPS-9",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ITPL-08",
    "trips": 36,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "HSG-NMG 407",
    "trips": 35,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-RC PTML-HGV",
    "trips": 35,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "D35G-TVK-NML",
    "trips": 34,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-LA PTML-HGV",
    "trips": 34,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-W PTML-DBR",
    "trips": 34,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-CA PTML-JKBH",
    "trips": 34,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-RA PTMT-HNYR",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "323-H",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VCS-ORRCA-206 JWSR-ORRCA",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-HBL-BMSIT",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-VSD-NGV",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284-B PTH-YST",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284 PTH-YST",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GTG-D34G-KMT",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VSD-KMT-JSD-RLO",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ANJP10B-JSD-BSK",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADT-1",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADT-13",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADT-8",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MADT-2",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADT-3",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADT-5",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADT-14",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CS-ADT-BLC",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADITI-10",
    "trips": 33,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "377-A",
    "trips": 32,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-KTH",
    "trips": 32,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "334-EA",
    "trips": 32,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258 ADK-NMG",
    "trips": 32,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "271 KBS-BMT45",
    "trips": 32,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADTS-16",
    "trips": 32,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GITAM-2",
    "trips": 32,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-VDHTC",
    "trips": 30,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-J CKB-JPLK",
    "trips": 30,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258 DSP-NMG",
    "trips": 30,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "503-A VRP-KRPGH",
    "trips": 30,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D45-BSK",
    "trips": 30,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-Q KBS-KGVK",
    "trips": 29,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-BHL",
    "trips": 29,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-CB PTML-KKH",
    "trips": 29,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "HALLCA-PTH",
    "trips": 29,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SBS-JKR-ALSG-PTH",
    "trips": 29,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284 SBS-MKC-PTH",
    "trips": 29,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-BTH",
    "trips": 28,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "HSK-KDG",
    "trips": 28,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "360-Q",
    "trips": 28,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D31G-KCH",
    "trips": 28,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "271-G",
    "trips": 28,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-J PTML-JLG",
    "trips": 28,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "285-JE PTML-DYVH",
    "trips": 28,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "CAPGR-11",
    "trips": 28,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "286-H PTH-GKVKLT",
    "trips": 28,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VCS-JFWTC-22 YHK-JFWTC",
    "trips": 28,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "245-H NML-D35G",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "304-VA",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-H DSP-ALR",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257E DSP-ALR",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YTTMC-VRP",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-NDRD",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-SDNIBK",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-VNSHBL",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-M PTH-HBLP",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "287-K PTH-DSHL",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "287G PTH-CBL",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "288C PTH-KDG",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-SVN",
    "trips": 27,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293-K",
    "trips": 26,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-BKH",
    "trips": 26,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YTTMC-MTK",
    "trips": 26,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-JKRA",
    "trips": 26,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ALS-SBDFD",
    "trips": 26,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "JHC-SSPCM",
    "trips": 25,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-SSPCM",
    "trips": 25,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "271-E BMT45-VRS",
    "trips": 25,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "256-MA VNC-TRHH",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "NLM-BEL LT",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293-P",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293-D",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-KBS-KTMN",
    "trips": 24,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "328-H HSK-ATB",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "328-C",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SSPC-1",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "TAPL-1",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-F",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "JEAFS-KCBC",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266 KMT-BMT45",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276 KBS-GMC-BMT45",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMSIT-3",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SBS-RTN-BMSIT",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMSITY-RJK",
    "trips": 24,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "402 NES-YNTAEH",
    "trips": 23,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "402-B SHS-YST",
    "trips": 23,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284-D VSD- YST",
    "trips": 23,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-MADT",
    "trips": 23,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-MADTL",
    "trips": 23,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293-F",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293-J",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "TAPL-NMG",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-BA HGV-D31G",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PTH-MSP-PTCA",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401AM PTH-PSS",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "D34-JNMS",
    "trips": 22,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-WA NMG-JTS",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "ANJP10B-JSD-KBS",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SHS-11",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADITI-1",
    "trips": 22,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-BVRH",
    "trips": 21,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-TB D35G-KVH",
    "trips": 21,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "D43-VNC",
    "trips": 21,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D40C-NGR",
    "trips": 21,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BTP-35",
    "trips": 21,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-SVG",
    "trips": 21,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YTTMC-DBLK",
    "trips": 21,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "251-M KBS-KLPP",
    "trips": 21,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276-AB BMT45-DBH",
    "trips": 21,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293-E",
    "trips": 20,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D40-DSP",
    "trips": 20,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BTP-29",
    "trips": 20,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285-R RJK-CHL",
    "trips": 20,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "266-N KMT-MLPH",
    "trips": 20,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276 BMT45-VRP-KBS",
    "trips": 20,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276 BMT45-VRP-KMT",
    "trips": 20,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-MTK",
    "trips": 19,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-C ASK-RVT",
    "trips": 19,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-TRN",
    "trips": 19,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ITPL -8F",
    "trips": 19,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257A DSP-HRH",
    "trips": 18,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "500-DE VRP-KLNB",
    "trips": 18,
    "type": "Ordinary Non-AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "BMT30-YSTF",
    "trips": 18,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-SKP",
    "trips": 17,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SBS-SVR-HSKGH",
    "trips": 16,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-500BH",
    "trips": 16,
    "type": "Vajra Volvo AC",
    "corridor": "Hebbal ⇄ Silk Board (Outer Ring Road)"
  },
  {
    "route": "248 KMT-JHC-KDG",
    "trips": 16,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-KTH",
    "trips": 16,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BTP-20G",
    "trips": 16,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BTP-25",
    "trips": 16,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KTH-D35G",
    "trips": 15,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VPS-19",
    "trips": 15,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "257-G ASK-AKMV",
    "trips": 15,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241 D35G-KMT",
    "trips": 15,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-BA CLO-HGV",
    "trips": 15,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-J BMT45-MTK",
    "trips": 15,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-J YTTMC-MTK",
    "trips": 15,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276-E BMT45-VRP-SBS",
    "trips": 15,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-KDB",
    "trips": 14,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMT45-CKB-KDG",
    "trips": 14,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-SVG",
    "trips": 14,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D31G-VRP",
    "trips": 14,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMT45-MTK 266A",
    "trips": 13,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "284-E",
    "trips": 13,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "296-M",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-TVK",
    "trips": 12,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SRYN-HSK",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BSPB-KBS",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MDR-KDGB",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "326-E HSK-KBS",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "326-E KBS-HSK",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMT40-ADK",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BELGS-18",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BTP-31",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "253-J SNBS-HSG",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KONGOVI-4",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KONGOVI-5",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SJHS-2",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VRP-SMA",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VRP-BEL",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-K BMT45-KGR",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "BMT46-PTML",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMT11-MADT",
    "trips": 12,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-F ASK-SVP",
    "trips": 11,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "JINDAL-1",
    "trips": 11,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "YTTMC-D34G",
    "trips": 11,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-BRGM-HBL",
    "trips": 11,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ADITI Aditional",
    "trips": 11,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "290-RA",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "VPS-13",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VPS-16",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ITPL-JPTS",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "256-MB DSP-MTG",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-R DSP-HNS",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-VC DSP-YLG",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-VG DSP-BNV",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-YA DSP-HCP",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "G-8 DSP-ISM",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-H DSP-VDH",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "D43-ASK NML",
    "trips": 10,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "243-G",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BEMLB-10",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266M BMT45-KDSH",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276-B BMT-45-VPP",
    "trips": 10,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-C ASK-NMG",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "MEBP-76",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "NICE-6",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-KBS-GOLT",
    "trips": 9,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CSB-SDP",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KANGOVI-1",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KANGOVI-2",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KANGOVI-3",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KANGOVI-7",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KANGOVI-6",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "254-E",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "276 YNRS-VRP",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CS-VRP-BMTC",
    "trips": 9,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "374-M NMG-TVK",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-GDH",
    "trips": 8,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "242-X D35G-DDR",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "SGHG-TVK",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D10G-BGLR-DVH",
    "trips": 8,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SRN-HSK",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BSK-HSK",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "304-V MDR-CKT",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-TNF-HOD-ITPL-KDG-HSK",
    "trips": 8,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-KDBC",
    "trips": 8,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "399-A SVP-HSK",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "HBL-ACIT",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "RTNPS-ANJM",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KRP-MRS",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MRS-KBS",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-MRS",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-VRP-CSB",
    "trips": 8,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285N PTML-THS",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "BMT11-HAPT",
    "trips": 8,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-SLP",
    "trips": 7,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "502-V D31G-VRP",
    "trips": 7,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-U NMG-GRNB",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "256-K BMT43-SVP",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SBS-HNS",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KLN-BGL",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MTR-38",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "248-N MRTG-SOLD",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BELGS-17",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BEL-VRP",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "AIT-KHDS-SBS",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SNBS-VRP",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BELF-VRP",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VRP-HBLB-BTP",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-VRP-CPR",
    "trips": 6,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KMT-MGH-GLH",
    "trips": 6,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "374-M NMG-LKH",
    "trips": 5,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-KKP",
    "trips": 5,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D31G-NGHN",
    "trips": 5,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D31G-KCP",
    "trips": 5,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241 MRTG-KCP",
    "trips": 5,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "241-CB MRTG-YKH",
    "trips": 5,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D45 To YNRS",
    "trips": 5,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401RC VRP-BEML5TH",
    "trips": 5,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "MB-9 BMT45-ISROL",
    "trips": 5,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MBS-6 BMT45-CVRN",
    "trips": 5,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "V-VRP-BSK",
    "trips": 5,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CS-BSWFO-BMSIT",
    "trips": 5,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D10G-BGL-BDG",
    "trips": 4,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293S BMT48-BGLR",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293J BMT48-MRS",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293 D48-RZP",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293-S KBS-HNS",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "98-F VSDLO-VSD",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-AMP",
    "trips": 4,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D35G-GNK",
    "trips": 4,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "JGH-D35G",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "606 DVG-HSK",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "HBL-ITPL-NBWSC",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "NBWSC-KDG",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BSPB-BEML",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GNH-D35G",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MDR-KMG-DGN",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KDG-AVH-RMP",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "328-HV",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "326-C MDR-KDGB",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "12F-3 MDR-WFTTMC",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "334-E HSK-HALM",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MDR-CNS",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "319 BMT24G-KSH",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "HSK-SRN",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-DSP",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMT43-ASK",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SVG-ARC-PSS",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "256-C",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-ANMSP",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "501-BH BSK-BMT45",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "272-E BMT45-SBS",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "266-R BMT45-RNBL",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "306-L BMT41G-MRS",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "ITPL-2J",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BMT45-VRPB",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VCS-ORRCA-109 VRP-ORRCA",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "10-J D16G-KBS",
    "trips": 4,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "304-VA TNF-SVP",
    "trips": 3,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-Y ASK-MBWD",
    "trips": 3,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "BMT09-SCN",
    "trips": 3,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SDH-CKB",
    "trips": 3,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "KBS-SDP",
    "trips": 3,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VNH-VRP",
    "trips": 3,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "CS-VRP- SNBS",
    "trips": 3,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-B RPCLO-VRP",
    "trips": 3,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "V-CSB-VRP",
    "trips": 3,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-M NLO-CLO",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "KLN-VDC",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "G-11 SNBS-BLR",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293D BMT48-SGH",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293F BMT48-HNS",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "D48-DNH",
    "trips": 2,
    "type": "Depot Feeder Service",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "293G-BMT-48-BDG",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "HALM-SBS-BMES",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SVM-SBS-BMES",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "BELGS-22",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-TPH",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "TND-MSP",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VCS-BTP-104 BTP-VRP",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-K YTTMC-VRP-BMT45",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "GKVK-KGR",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GKVK-ANP",
    "trips": 2,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "PSS-KMP",
    "trips": 1,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SBS-GKVKL",
    "trips": 1,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "176 GKVK-HPN",
    "trips": 1,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "GKVK-SMH",
    "trips": 1,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285 BPS-NES",
    "trips": 1,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "245-M KBS-BDVN",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "328-H",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "401-A NMG-YHKOT",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "502-C NMG-KRPGH",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "258-M KMT-GVS",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "258-M KMT-MCH",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Nelamangala / Magadi Road ⇄ Peenya ⇄ Majestic"
  },
  {
    "route": "V-GOLT-KDG",
    "trips": 0,
    "type": "Vajra Volvo AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SVG-1",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MEBP-21B",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "285M SBS-DBP",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "401-B PTH-VRP-TDL",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Yelahanka ⇄ Yeshwanthpur ⇄ Kengeri (Ring Road)"
  },
  {
    "route": "VDS-VRP",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VCS-TATA ELEXI-07 DBSA-TELX",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "290-EA",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290-E SBS-PTH",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290-E PTH-RKH",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290E PTH-AJB",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "ADITI-4",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "MALYAADT-11",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "290-EB YHK-KGR",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290-EB KGR-YHK",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290-EB",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290-EY",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290-EN",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290-EN KLNB-YHKOT",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290-E STJHS-YLKOT",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290E YHKOT-RKH",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290EY KMT-YHKOT",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "290-E ITCF-YHKOT",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  },
  {
    "route": "KMT-BYH",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "SBS-ALS",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "VCS-ORRCA-012 BGC-ORRCA",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "City Arterial Corridor"
  },
  {
    "route": "290-F",
    "trips": 0,
    "type": "Ordinary Non-AC",
    "corridor": "Doddaballapur / Yelahanka ⇄ Hebbal ⇄ Majestic"
  }
];

// Helper Lookup Utilities
export function getOfficialStopByName(name: string): BMTCStopRecord | undefined {
  const q = name.toLowerCase().trim();
  return OFFICIAL_BMTC_STOPS.find(s => s.name.toLowerCase().trim() === q || s.name.toLowerCase().includes(q));
}

export function getRoutesPassingThroughStop(stopName: string): { route: string; trips: number }[] {
  const stop = getOfficialStopByName(stopName);
  if (!stop || !stop.routesMap) return [];
  return Object.entries(stop.routesMap)
    .map(([route, trips]) => ({ route, trips }))
    .sort((a, b) => b.trips - a.trips);
}

export function getStopsForRoute(routeCode: string): BMTCStopRecord[] {
  const clean = routeCode.trim().toUpperCase();
  return OFFICIAL_BMTC_STOPS.filter(s => {
    if (!s.routesMap) return false;
    return Object.keys(s.routesMap).some(r => r.toUpperCase() === clean || r.toUpperCase().includes(clean));
  });
}

export function getFleetStatsForDivision(divisionName: string, year: string = "2019-20"): BMTCFleetDivisionRecord | undefined {
  const divClean = divisionName.toLowerCase().trim();
  return BMTC_DIVISIONAL_FLEET_DATA.find(r => 
    r.division.toLowerCase().includes(divClean) && r.year === year
  );
}
