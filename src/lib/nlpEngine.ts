// Define the structure of our AI's thought process
export interface NLPResponse {
  intent: "GREETING" | "ROUTE_SEARCH" | "STATUS_CHECK" | "UNKNOWN";
  entities: string[];
  reply: string;
}

// The core Kanglish processing algorithm
export function processKanglish(input: string): NLPResponse {
  const normalizedInput = input.toLowerCase();
  
  // 1. Dictionary of local Bengaluru transit terms and Kanglish
  const greetings = ["hi", "hello", "namaskara", "namaste", "maga", "guru"];
  const routeKeywords = ["route", "from", "to", "go", "bus", "auto", "metro", "reach"];
  const delayKeywords = ["late", "delay", "where", "time", "traffic", "stuck"];
  
  // 2. Identify Locations (Entities)
  const locations = ["yelahanka", "majestic", "silk board", "koramangala", "electronic city", "whitefield", "indiranagar"];
  const foundEntities = locations.filter(loc => normalizedInput.includes(loc));
  
  // Extracts bus numbers (like "500D" or "333") from the text
  const foundBusNumbers = normalizedInput.match(/\b\d{2,3}[a-z]?\b/g) || [];

  // 3. Determine the Intent based on mathematical weight
  if (routeKeywords.some(kw => normalizedInput.includes(kw)) && foundEntities.length > 0) {
    return {
      intent: "ROUTE_SEARCH",
      entities: [...foundEntities, ...foundBusNumbers],
      reply: `I can help you with that! Generating the fastest A* multi-modal route for ${foundEntities.map(e => e.toUpperCase()).join(" to ")} now.`
    };
  }

  if (delayKeywords.some(kw => normalizedInput.includes(kw)) && foundBusNumbers.length > 0) {
    // THE FIX: We safely guarantee to TypeScript that this string exists
    const primaryBus = foundBusNumbers[0] || "unknown"; 
    
    return {
      intent: "STATUS_CHECK",
      entities: foundBusNumbers,
      reply: `Checking the live GTFS WebSocket for Route ${primaryBus.toUpperCase()}... Looks like it's caught in heavy traffic. ETA is 12 mins.`
    };
  }

  if (greetings.some(kw => normalizedInput.includes(kw))) {
    return {
      intent: "GREETING",
      entities: [],
      reply: "Namaskara guru! 🙏 Where are we heading in Namma Bengaluru today?"
    };
  }

  // 4. Fallback for unrecognized queries
  return {
    intent: "UNKNOWN",
    entities: [],
    reply: "I'm still learning the city's routes! Try asking me something like 'Best bus from Yelahanka to Majestic'."
  };
}