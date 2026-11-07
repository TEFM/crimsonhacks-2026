export function filterBills(bills, topic, query) {
  const normalizedQuery = query.trim().toLowerCase();
  return bills.filter((bill) => {
    const matchesTopic = topic === 'All bills' || bill.topic === topic;
    const haystack = `${bill.id} ${bill.title} ${bill.sponsor} ${bill.topic}`.toLowerCase();
    return matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
}
