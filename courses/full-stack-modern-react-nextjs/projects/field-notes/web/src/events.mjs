export function mergeEvents(current, incoming) {
 const byId = new Map(current.map(event => [event.eventId, event]));
 for (const event of incoming) if (event?.eventId && event.note?.id) byId.set(event.eventId, event);
 return [...byId.values()].sort((a,b)=>(a.sequence||0)-(b.sequence||0));
}
