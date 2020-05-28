export function isAcyclicGraph(
  links: Array<{ sourceId: string; targetId: string }>
): boolean {
  while (links.length > 0) {
    const sourceToTargetsMap = links.reduce((acc, { sourceId, targetId }) => {
      acc[sourceId] = acc[sourceId] || [];
      acc[sourceId].push(targetId);
      return acc;
    }, {} as { [key: string]: string[] });
    const allNodes = Array.from(
      new Set(
        links
          .map((l) => [l.sourceId, l.targetId])
          .reduce((acc, cur) => acc.concat(cur), [])
      )
    );
    const nodesWithoutOutgoingLink = new Set(
      allNodes.filter(
        (n) => !(sourceToTargetsMap[n] && sourceToTargetsMap[n].length > 0)
      )
    );
    const newLinks = links.filter(
      (l) => !nodesWithoutOutgoingLink.has(l.targetId)
    );
    if (newLinks.length === links.length) {
      return false;
    }
    links = newLinks;
  }
  return true;
}
