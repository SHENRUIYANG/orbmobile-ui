/**
 * Variant & Layout persistence — AsyncStorage-based storage for RN.
 * Mirrors orbcafe-ui CVariantManager + CLayoutManager localStorage logic.
 *
 * Storage keys:
 *   orbcafe.variants.{appId}.{tableKey}  → VariantMetadata[]
 *   orbcafe.layouts.{appId}.{tableKey}   → LayoutMetadata[]
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { VariantMetadata, LayoutMetadata } from './types';

/* ── Helpers ───────────────────────────────────────────────────────── */

const variantKey = (appId: string, tableKey: string) =>
  `orbcafe.variants.${appId}.${tableKey}`;

const layoutKey = (appId: string, tableKey: string) =>
  `orbcafe.layouts.${appId}.${tableKey}`;

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

/* ── Variant CRUD ──────────────────────────────────────────────────── */

export async function loadVariants(appId: string, tableKey: string): Promise<VariantMetadata[]> {
  try {
    const raw = await AsyncStorage.getItem(variantKey(appId, tableKey));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveVariant(
  appId: string,
  tableKey: string,
  variant: Omit<VariantMetadata, 'id' | 'createdAt'> & { id?: string },
): Promise<VariantMetadata> {
  const list = await loadVariants(appId, tableKey);
  const now = new Date().toISOString();

  if (variant.id) {
    // Update existing
    const idx = list.findIndex((v) => v.id === variant.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...variant, createdAt: list[idx].createdAt };
    }
  } else {
    // Create new
    const newVariant: VariantMetadata = {
      ...variant,
      id: uuid(),
      createdAt: now,
    };
    list.push(newVariant);
  }

  // Handle isDefault — only one default allowed
  if (variant.isDefault) {
    const targetId = variant.id ?? list[list.length - 1].id;
    list.forEach((v) => {
      v.isDefault = v.id === targetId;
    });
  }

  await AsyncStorage.setItem(variantKey(appId, tableKey), JSON.stringify(list));
  return variant.id ? list.find((v) => v.id === variant.id)! : list[list.length - 1];
}

export async function deleteVariant(appId: string, tableKey: string, variantId: string): Promise<void> {
  const list = await loadVariants(appId, tableKey);
  const filtered = list.filter((v) => v.id !== variantId);
  await AsyncStorage.setItem(variantKey(appId, tableKey), JSON.stringify(filtered));
}

export async function setDefaultVariant(appId: string, tableKey: string, variantId: string): Promise<void> {
  const list = await loadVariants(appId, tableKey);
  list.forEach((v) => {
    v.isDefault = v.id === variantId;
  });
  await AsyncStorage.setItem(variantKey(appId, tableKey), JSON.stringify(list));
}

/* ── Layout CRUD ───────────────────────────────────────────────────── */

export async function loadLayouts(appId: string, tableKey: string): Promise<LayoutMetadata[]> {
  try {
    const raw = await AsyncStorage.getItem(layoutKey(appId, tableKey));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveLayout(
  appId: string,
  tableKey: string,
  layout: Omit<LayoutMetadata, 'id' | 'createdAt'> & { id?: string },
): Promise<LayoutMetadata> {
  const list = await loadLayouts(appId, tableKey);
  const now = new Date().toISOString();

  if (layout.id) {
    const idx = list.findIndex((l) => l.id === layout.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...layout, createdAt: list[idx].createdAt };
    }
  } else {
    const newLayout: LayoutMetadata = {
      ...layout,
      id: uuid(),
      createdAt: now,
    };
    list.push(newLayout);
  }

  if (layout.isDefault) {
    const targetId = layout.id ?? list[list.length - 1].id;
    list.forEach((l) => {
      l.isDefault = l.id === targetId;
    });
  }

  await AsyncStorage.setItem(layoutKey(appId, tableKey), JSON.stringify(list));
  return layout.id ? list.find((l) => l.id === layout.id)! : list[list.length - 1];
}

export async function deleteLayout(appId: string, tableKey: string, layoutId: string): Promise<void> {
  const list = await loadLayouts(appId, tableKey);
  const filtered = list.filter((l) => l.id !== layoutId);
  await AsyncStorage.setItem(layoutKey(appId, tableKey), JSON.stringify(filtered));
}

export async function setDefaultLayout(appId: string, tableKey: string, layoutId: string): Promise<void> {
  const list = await loadLayouts(appId, tableKey);
  list.forEach((l) => {
    l.isDefault = l.id === layoutId;
  });
  await AsyncStorage.setItem(layoutKey(appId, tableKey), JSON.stringify(list));
}
