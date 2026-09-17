import content from '../../content/menu.json';
import { normalizeMenu } from '../content/menu-content';

// Managed from /keystatic; deployed updates are published by Vercel from GitHub.
export const MENU = normalizeMenu(content.sections);
