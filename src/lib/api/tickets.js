const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// export const getTickets = async(ticketId) => {
//     const res = await fetch(`${baseUrl}/api/tickets?ticketId=${ticketId}`)
//     return res.json();
// }

export const getTickets = async (ticketId) => {
  const url = ticketId
    ? `${baseUrl}/api/tickets?ticketId=${ticketId}`
    : `${baseUrl}/api/tickets`;

  const res = await fetch(url);

  return res.json();
};