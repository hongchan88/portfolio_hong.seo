import { stackImages } from '../data/data';

export const getStackImg = (stack: string) =>
  stackImages[stack] || { url: '#', desc: 'Unknown Stack' };
