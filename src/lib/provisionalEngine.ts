export interface ProvisionalTicket {
  id: string;
  route: string;
  issuedAt: number;
  expiresAt: number;
  status: "ACTIVE" | "EXPIRED" | "RESOLVED";
  originalFare: number;
}

export function generateProvisionalPass(route: string, fare: number): ProvisionalTicket {
  const now = Math.floor(Date.now() / 1000);
  const oneHourFromNow = now + 3600;

  return {
    id: `PROV_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    route: route,
    issuedAt: now,
    expiresAt: oneHourFromNow,
    status: "ACTIVE",
    originalFare: fare
  };
}

export function checkProvisionalStatus(ticket: ProvisionalTicket): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now < ticket.expiresAt && ticket.status === "ACTIVE";
}