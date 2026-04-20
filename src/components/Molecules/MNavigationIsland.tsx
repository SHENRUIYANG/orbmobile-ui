import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND_COLORS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '../../config';

export interface MNavigationIslandLeafItem<RouteName extends string = string> {
  kind: 'item';
  route: RouteName;
  glyph: string;
  title: string;
  subtitle: string;
}

export interface MNavigationIslandGroupItem<RouteName extends string = string> {
  kind: 'group';
  id: string;
  glyph: string;
  title: string;
  subtitle: string;
  children: MNavigationIslandLeafItem<RouteName>[];
}

export type MNavigationIslandItem<RouteName extends string = string> =
  | MNavigationIslandLeafItem<RouteName>
  | MNavigationIslandGroupItem<RouteName>;

export interface MNavigationIslandProps<RouteName extends string = string> {
  currentRoute: RouteName;
  onNavigate: (route: RouteName) => void;
  items: MNavigationIslandItem<RouteName>[];
  userName: string;
  userInitials?: string;
}

const itemMatchesQuery = <RouteName extends string>(item: MNavigationIslandLeafItem<RouteName>, query: string) => {
  return item.title.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query);
};

const groupMatchesQuery = <RouteName extends string>(group: MNavigationIslandGroupItem<RouteName>, query: string) => {
  return group.title.toLowerCase().includes(query) || group.subtitle.toLowerCase().includes(query);
};

export function MNavigationIsland<RouteName extends string = string>({
  currentRoute,
  onNavigate,
  items,
  userName,
  userInitials,
}: MNavigationIslandProps<RouteName>) {
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    const containingGroup = items.find(
      (item): item is MNavigationIslandGroupItem<RouteName> => item.kind === 'group' && item.children.some((child) => child.route === currentRoute),
    );

    if (containingGroup) {
      setExpandedGroups((current) => (current.includes(containingGroup.id) ? current : [...current, containingGroup.id]));
    }
  }, [currentRoute, items]);

  const resolvedInitials = userInitials ?? userName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');

  const activeLeaf = useMemo(() => {
    const topLevelLeaf = items.find((item) => item.kind === 'item' && item.route === currentRoute);
    if (topLevelLeaf?.kind === 'item') return topLevelLeaf;

    for (const node of items) {
      if (node.kind === 'group') {
        const child = node.children.find((item) => item.route === currentRoute);
        if (child) return child;
      }
    }

    return null;
  }, [currentRoute, items]);

  const visibleItems = useMemo<MNavigationIslandItem<RouteName>[]>(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.reduce<MNavigationIslandItem<RouteName>[]>((result, node) => {
      if (node.kind === 'item') {
        if (itemMatchesQuery(node, query)) {
          result.push(node);
        }
        return result;
      }

      const parentMatches = groupMatchesQuery(node, query);
      const matchingChildren = parentMatches ? node.children : node.children.filter((child) => itemMatchesQuery(child, query));

      if (!parentMatches && matchingChildren.length === 0) {
        return result;
      }

      result.push({ ...node, children: matchingChildren });
      return result;
    }, []);
  }, [items, search]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((current) => (current.includes(groupId) ? current.filter((item) => item !== groupId) : [...current, groupId]));
  };

  const handleNavigate = (route: RouteName) => {
    onNavigate(route);
    setExpanded(false);
  };

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      {expanded ? <Pressable style={styles.backdrop} onPress={() => setExpanded(false)} /> : null}

      <View
        pointerEvents="box-none"
        style={[
          styles.anchor,
          {
            top: Math.max(insets.top + SPACING.md, 28),
            right: Math.max(insets.right + SPACING.xl, SPACING.xl),
          },
        ]}
      >
        <Pressable style={styles.nameButton} onPress={() => setExpanded((current) => !current)}>
          <Text style={styles.nameButtonText}>{userName}</Text>
        </Pressable>

        {expanded ? (
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <View style={styles.profileRow}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>{resolvedInitials}</Text>
                </View>
                <View style={styles.profileCopy}>
                  <Text style={styles.panelTitle}>{userName}</Text>
                  <Text style={styles.panelSubtitle}>Current: {activeLeaf?.title ?? 'Dashboard'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.searchWrap}>
              <Text style={styles.searchIcon}>Q</Text>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search menu..."
                placeholderTextColor={BRAND_COLORS.textMuted}
                style={styles.searchInput}
              />
            </View>

            <View style={styles.panelList}>
              {visibleItems.map((node) => {
                if (node.kind === 'item') {
                  const active = node.route === currentRoute;
                  return (
                    <Pressable key={node.route} style={[styles.panelItem, active && styles.panelItemActive]} onPress={() => handleNavigate(node.route)}>
                      <View style={[styles.panelItemMarker, active && styles.panelItemMarkerActive]} />
                      <View style={[styles.panelGlyph, active && styles.panelGlyphActive]}>
                        <Text style={[styles.panelGlyphText, active && styles.panelGlyphTextActive]}>{node.glyph}</Text>
                      </View>
                      <View style={styles.panelCopy}>
                        <Text style={[styles.panelItemTitle, active && styles.panelItemTitleActive]}>{node.title}</Text>
                        <Text style={styles.panelItemSubtitle}>{node.subtitle}</Text>
                      </View>
                    </Pressable>
                  );
                }

                const groupOpen = search.trim() ? true : expandedGroups.includes(node.id);
                const groupActive = node.children.some((child) => child.route === currentRoute);

                return (
                  <View key={node.id} style={styles.groupWrap}>
                    <Pressable style={[styles.panelItem, groupActive && styles.panelItemActive]} onPress={() => toggleGroup(node.id)}>
                      <View style={[styles.panelItemMarker, groupActive && styles.panelItemMarkerActive]} />
                      <View style={[styles.panelGlyph, groupActive && styles.panelGlyphActive]}>
                        <Text style={[styles.panelGlyphText, groupActive && styles.panelGlyphTextActive]}>{node.glyph}</Text>
                      </View>
                      <View style={styles.panelCopy}>
                        <Text style={[styles.panelItemTitle, groupActive && styles.panelItemTitleActive]}>{node.title}</Text>
                        <Text style={styles.panelItemSubtitle}>{node.subtitle}</Text>
                      </View>
                      <Text style={styles.groupChevron}>{groupOpen ? '−' : '+'}</Text>
                    </Pressable>

                    {groupOpen ? (
                      <View style={styles.childList}>
                        {node.children.map((child) => {
                          const active = child.route === currentRoute;
                          return (
                            <Pressable key={child.route} style={[styles.childItem, active && styles.childItemActive]} onPress={() => handleNavigate(child.route)}>
                              <View style={styles.childIndent} />
                              <View style={[styles.childGlyph, active && styles.childGlyphActive]}>
                                <Text style={[styles.childGlyphText, active && styles.childGlyphTextActive]}>{child.glyph}</Text>
                              </View>
                              <View style={styles.panelCopy}>
                                <Text style={[styles.childTitle, active && styles.childTitleActive]}>{child.title}</Text>
                                <Text style={styles.panelItemSubtitle}>{child.subtitle}</Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 20, 32, 0.08)',
  },
  anchor: {
    position: 'absolute',
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  nameButton: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  nameButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: BRAND_COLORS.textPrimary,
  },
  panel: {
    width: 308,
    maxHeight: 620,
    borderRadius: 30,
    padding: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.985)',
    borderWidth: 1,
    borderColor: '#E4ECF7',
    gap: SPACING.md,
    ...SHADOWS.lg,
  },
  panelHeader: {
    gap: SPACING.sm,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FF',
  },
  profileAvatarText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: BRAND_COLORS.primary,
  },
  profileCopy: {
    flex: 1,
    gap: 2,
  },
  panelTitle: {
    fontSize: FONT_SIZE.lg,
    color: BRAND_COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
  },
  panelSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textSecondary,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3DCE9',
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textMuted,
    fontWeight: FONT_WEIGHT.bold,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textPrimary,
  },
  panelList: {
    gap: 6,
  },
  groupWrap: {
    gap: 4,
  },
  panelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderRadius: 18,
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
  },
  panelItemActive: {
    backgroundColor: '#F6FAFF',
  },
  panelItemMarker: {
    width: 4,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  panelItemMarkerActive: {
    backgroundColor: BRAND_COLORS.primary,
  },
  panelGlyph: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4FB',
  },
  panelGlyphActive: {
    backgroundColor: '#EAF2FF',
  },
  panelGlyphText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: BRAND_COLORS.textSecondary,
  },
  panelGlyphTextActive: {
    color: BRAND_COLORS.primary,
  },
  panelCopy: {
    flex: 1,
    gap: 2,
  },
  panelItemTitle: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  panelItemTitleActive: {
    color: BRAND_COLORS.primary,
  },
  panelItemSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: BRAND_COLORS.textMuted,
  },
  groupChevron: {
    width: 24,
    textAlign: 'center',
    fontSize: FONT_SIZE.lg,
    color: BRAND_COLORS.textMuted,
    fontWeight: FONT_WEIGHT.medium,
  },
  childList: {
    marginLeft: 16,
    gap: 4,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderRadius: 16,
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingLeft: SPACING.sm,
  },
  childItemActive: {
    backgroundColor: '#F6FAFF',
  },
  childIndent: {
    width: 12,
    height: 1,
    backgroundColor: '#D7E4FB',
  },
  childGlyph: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6FB',
  },
  childGlyphActive: {
    backgroundColor: '#EAF2FF',
  },
  childGlyphText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: BRAND_COLORS.textSecondary,
  },
  childGlyphTextActive: {
    color: BRAND_COLORS.primary,
  },
  childTitle: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  childTitleActive: {
    color: BRAND_COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
