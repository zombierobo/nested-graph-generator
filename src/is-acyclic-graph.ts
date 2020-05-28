export function isAcyclicGraph(
  links: Array<{ sourceId: string; targetId: string }>
): boolean {
  while (links.length > 0) {
    const sourceToTargetsMap = links.reduce((acc, { sourceId, targetId }) => {
      acc[sourceId] = acc[sourceId] || [];
      acc[sourceId].push(targetId);
      return acc;
    }, {} as { [key: string]: string[] });
    const allNodes = Object.keys(
      links
        .map((l) => [l.sourceId, l.targetId])
        .reduce((acc, cur) => {
          cur.forEach((c) => (acc[c] = true));
          return acc;
        }, {} as { [key: string]: boolean })
    );
    const nodesWithoutOutgoingLink = allNodes
      .filter(
        (n) => !(sourceToTargetsMap[n] && sourceToTargetsMap[n].length > 0)
      )
      .reduce((acc, cur) => {
        acc[cur] = true;
        return acc;
      }, {} as { [key: string]: boolean });
    const newLinks = links.filter((l) => !nodesWithoutOutgoingLink[l.targetId]);
    if (newLinks.length === links.length) {
      return false;
    }
    links = newLinks;
  }
  return true;
}
