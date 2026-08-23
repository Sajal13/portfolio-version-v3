import type { Skill } from '@repo/types';
import type { PaletteColor } from './constants';

export type CategoryNode = {
  id: string;
  title: string;
  angle: number;
  x: number;
  y: number;
  color: PaletteColor;
  count: number;
};

export type ParentNode = {
  id: string;
  title: string;
  x: number;
  y: number;
  color: PaletteColor;
};

export type LeafNode = Skill & {
  angle: number;
  x: number;
  y: number;
  color: PaletteColor;
  hubParent: string | null;
};

export type Link = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: PaletteColor;
  key: string;
};

export type Layout = {
  categoryNodes: CategoryNode[];
  parentNodes: ParentNode[];
  leafNodes: LeafNode[];
  links: Link[];
};
