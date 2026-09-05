import type { Skill } from '@repo/types';
import { CX, CY, R1, R2, R3, PALETTE } from './constants';
import { round } from './round';
import type { Layout } from './types';

// Groups skills by category, then by parent, and assigns each node
// an angle proportional to how many leaves it carries.
export const buildLayout = (skills: Skill[]): Layout => {
  const byCategory = new Map<string, Skill[]>();
  skills.forEach((s) => {
    if (!byCategory.has(s.category)) byCategory.set(s.category, []);
    byCategory.get(s.category)!.push(s);
  });

  const categoryNames = [...byCategory.keys()];
  const total = skills.length;
  const catGap = 0.05; // radians of breathing room between category sectors

  const layout: Layout = {
    categoryNodes: [],
    parentNodes: [],
    leafNodes: [],
    links: []
  };

  let angleCursor = -Math.PI / 2; // start pointing up, like the reference graph's hub

  categoryNames.forEach((catName, ci) => {
    const catSkills = byCategory.get(catName)!;
    const color = PALETTE[ci % PALETTE.length]!; // modulo guarantees a valid index
    const catSpan = (catSkills.length / total) * (Math.PI * 2) - catGap;
    const catStart = angleCursor;
    const catCenter = catStart + catSpan / 2;

    const catNode = {
      id: `cat-${catName}`,
      title: catName,
      angle: catCenter,
      x: round(CX + R1 * Math.cos(catCenter)),
      y: round(CY + R1 * Math.sin(catCenter)),
      color,
      count: catSkills.length
    };
    layout.categoryNodes.push(catNode);
    layout.links.push({
      x1: CX,
      y1: CY,
      x2: catNode.x,
      y2: catNode.y,
      color,
      key: `l-cat-${catName}`
    });

    // branches: real parents get grouped; parentless skills are their own branch
    const parentMap = new Map<string, Skill[]>();
    const soloBranches: Skill[] = [];
    catSkills.forEach((s) => {
      if (s.parent) {
        if (!parentMap.has(s.parent)) parentMap.set(s.parent, []);
        parentMap.get(s.parent)!.push(s);
      } else {
        soloBranches.push(s);
      }
    });

    const branches = [
      ...[...parentMap.entries()].map(([key, arr]) => ({
        type: 'parent' as const,
        key,
        arr
      })),
      ...soloBranches.map((s) => ({
        type: 'solo' as const,
        key: s.title,
        arr: [s]
      }))
    ];

    const branchGap = branches.length > 1 ? catSpan * 0.04 : 0;
    let branchCursor = catStart;

    branches.forEach((branch) => {
      const branchSpan =
        (branch.arr.length / catSkills.length) * catSpan - branchGap;
      const branchStart = branchCursor;
      const branchCenter = branchStart + branchSpan / 2;
      branchCursor += branchSpan + branchGap;

      if (branch.type === 'parent') {
        const px = round(CX + R2 * Math.cos(branchCenter));
        const py = round(CY + R2 * Math.sin(branchCenter));
        layout.parentNodes.push({
          id: `parent-${catName}-${branch.key}`,
          title: branch.key,
          x: px,
          y: py,
          color
        });
        layout.links.push({
          x1: catNode.x,
          y1: catNode.y,
          x2: px,
          y2: py,
          color,
          key: `l-parent-${catName}-${branch.key}`
        });

        const leafGap = branch.arr.length > 1 ? branchSpan * 0.15 : 0;
        const leafStep =
          branch.arr.length > 0
            ? (branchSpan - leafGap) / branch.arr.length
            : 0;
        branch.arr.forEach((s, li) => {
          const leafAngle = branchStart + leafGap / 2 + leafStep * (li + 0.5);
          const lx = round(CX + R3 * Math.cos(leafAngle));
          const ly = round(CY + R3 * Math.sin(leafAngle));
          layout.leafNodes.push({
            ...s,
            angle: leafAngle,
            x: lx,
            y: ly,
            color,
            hubParent: branch.key
          });
          layout.links.push({
            x1: px,
            y1: py,
            x2: lx,
            y2: ly,
            color,
            key: `l-leaf-${s.id}`
          });
        });
      } else {
        const s = branch.arr[0];
        if (!s) return;

        const lx = round(CX + R2 * Math.cos(branchCenter));
        const ly = round(CY + R2 * Math.sin(branchCenter));
        layout.leafNodes.push({
          ...s,
          angle: branchCenter,
          x: lx,
          y: ly,
          color,
          hubParent: null
        });
        layout.links.push({
          x1: catNode.x,
          y1: catNode.y,
          x2: lx,
          y2: ly,
          color,
          key: `l-leaf-${s.id}`
        });
      }
    });

    angleCursor = catStart + catSpan + catGap;
  });

  return layout;
};
