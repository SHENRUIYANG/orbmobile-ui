import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MChip } from '../Atoms/MChip';
import { MSurface } from '../Atoms/MSurface';
import { MTypography } from '../Atoms/MTypography';
import {
  MStatusBadge,
  type MStatusBadgeStatus,
} from '../Molecules/MStatusBadge';
import {
  BRAND_COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from '../../config/foundations';

export interface MKanbanCardFact {
  label: string;
  value: string;
}

export interface MKanbanCardData {
  id: string;
  title: string;
  description?: string;
  status?: MStatusBadgeStatus;
  statusLabel?: string;
  tags?: string[];
  facts?: MKanbanCardFact[];
}

export interface MKanbanBucketData {
  id: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
  cardStatus?: MStatusBadgeStatus;
  cardStatusLabel?: string;
  limit?: number;
  cards: MKanbanCardData[];
}

export interface MKanbanCardMoveEvent {
  card: MKanbanCardData;
  fromBucket: MKanbanBucketData;
  toBucket: MKanbanBucketData;
  buckets: MKanbanBucketData[];
}

export interface MKanbanBoardProps {
  buckets: MKanbanBucketData[];
  title?: string;
  subtitle?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onCardPress?: (card: MKanbanCardData, bucket: MKanbanBucketData) => void;
  onBucketsChange?: (buckets: MKanbanBucketData[]) => void;
  onCardMove?: (event: MKanbanCardMoveEvent) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

interface BucketPickerState {
  cardId: string;
  fromBucketId: string;
}

const STATUS_LABELS: Record<MStatusBadgeStatus, string> = {
  success: 'Done',
  warning: 'At risk',
  error: 'Blocked',
  info: 'In progress',
  neutral: 'Planned',
};

export const MKanbanBoard: React.FC<MKanbanBoardProps> = ({
  buckets,
  title = 'Kanban Board',
  subtitle = 'Track work by stage with a touch-friendly native board.',
  emptyStateTitle = 'No buckets yet',
  emptyStateDescription = 'Pass bucket data into `MKanbanBoard` to render a board.',
  onCardPress,
  onBucketsChange,
  onCardMove,
  style,
  testID,
}) => {
  const [boardBuckets, setBoardBuckets] = useState(buckets);
  const [bucketPicker, setBucketPicker] = useState<BucketPickerState | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setBoardBuckets(buckets);
  }, [buckets]);

  const { width } = useWindowDimensions();
  const isWideLayout = width >= 768;
  const screenTopInset = isWideLayout ? SPACING.lg : SPACING.sm;
  const bucketWidth =
    width >= 1200 ? 360 : isWideLayout ? 320 : Math.max(272, width - 84);
  const bucketMaxHeight = isWideLayout ? 720 : 640;
  const headerTopInset = isWideLayout
    ? Math.max(insets.top, 24)
    : Math.max(insets.top - SPACING.md, 28);
  const headerRightInset = isWideLayout ? 80 : 72;
  const compactHeaderWidth = isWideLayout ? undefined : Math.max(180, width - 156);

  const activePickerBucket = bucketPicker
    ? boardBuckets.find((bucket) => bucket.id === bucketPicker.fromBucketId) ?? null
    : null;
  const activePickerCard = activePickerBucket && bucketPicker
    ? activePickerBucket.cards.find((card) => card.id === bucketPicker.cardId) ?? null
    : null;

  const moveCard = useCallback(
    (cardId: string, fromBucketId: string, toBucketId: string) => {
      if (fromBucketId === toBucketId) return;

      const fromBucket = boardBuckets.find((bucket) => bucket.id === fromBucketId);
      const toBucket = boardBuckets.find((bucket) => bucket.id === toBucketId);
      if (!fromBucket || !toBucket) return;

      const card = fromBucket.cards.find((item) => item.id === cardId);
      if (!card) return;

      const movedCard: MKanbanCardData = {
        ...card,
        status: toBucket.cardStatus ?? card.status,
        statusLabel: toBucket.cardStatusLabel ?? card.statusLabel,
      };

      const nextBuckets = boardBuckets.map((bucket) => {
        if (bucket.id === fromBucketId) {
          return {
            ...bucket,
            cards: bucket.cards.filter((item) => item.id !== cardId),
          };
        }

        if (bucket.id === toBucketId) {
          return {
            ...bucket,
            cards: [...bucket.cards, movedCard],
          };
        }

        return bucket;
      });

      const nextToBucket = nextBuckets.find((bucket) => bucket.id === toBucketId) ?? toBucket;

      setBoardBuckets(nextBuckets);
      setBucketPicker(null);
      onBucketsChange?.(nextBuckets);
      onCardMove?.({
        card: movedCard,
        fromBucket,
        toBucket: nextToBucket,
        buckets: nextBuckets,
      });
    },
    [boardBuckets, onBucketsChange, onCardMove],
  );

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: screenTopInset },
        style,
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.header,
          { paddingTop: headerTopInset, paddingRight: headerRightInset },
        ]}
      >
        <View
          style={[
            styles.headerCopy,
            compactHeaderWidth ? { maxWidth: compactHeaderWidth } : null,
          ]}
        >
          <MTypography variant="headline">{title}</MTypography>
          <MTypography>{subtitle}</MTypography>
        </View>
      </View>

      {boardBuckets.length === 0 ? (
        <MSurface style={styles.emptyState}>
          <MTypography variant="title">{emptyStateTitle}</MTypography>
          <MTypography>{emptyStateDescription}</MTypography>
        </MSurface>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.boardContent}
        >
          {boardBuckets.map((bucket, index) => {
            const cardCountLabel = bucket.limit
              ? `${bucket.cards.length}/${bucket.limit}`
              : `${bucket.cards.length}`;

            return (
              <View
                key={bucket.id}
                style={[
                  styles.bucketShell,
                  { width: bucketWidth },
                  index === boardBuckets.length - 1 ? null : styles.bucketSpacing,
                ]}
              >
                <MSurface style={[styles.bucket, { maxHeight: bucketMaxHeight }]}>
                  <View style={styles.bucketHeader}>
                    <View style={styles.bucketCopy}>
                      <View style={styles.bucketTitleRow}>
                        <View
                          style={[
                            styles.bucketAccent,
                            { backgroundColor: bucket.accentColor ?? BRAND_COLORS.accent },
                          ]}
                        />
                        <MTypography variant="title">{bucket.title}</MTypography>
                      </View>
                      {bucket.subtitle ? (
                        <MTypography style={styles.bucketSubtitle}>
                          {bucket.subtitle}
                        </MTypography>
                      ) : null}
                    </View>
                    <MChip label={cardCountLabel} variant="outlined" />
                  </View>

                  {bucket.cards.length === 0 ? (
                    <View style={styles.emptyBucket}>
                      <MTypography style={styles.emptyBucketText}>
                        No cards in this stage.
                      </MTypography>
                    </View>
                  ) : (
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator
                      style={styles.cardScroll}
                      contentContainerStyle={styles.cardStack}
                    >
                      {bucket.cards.map((card) => {
                        const status = card.status ?? bucket.cardStatus ?? 'neutral';
                        const statusLabel =
                          card.statusLabel ??
                          bucket.cardStatusLabel ??
                          STATUS_LABELS[status];

                        return (
                          <View key={card.id} style={styles.card}>
                            <Pressable
                              onPress={onCardPress ? () => onCardPress(card, bucket) : undefined}
                              disabled={!onCardPress}
                              style={({ pressed }) => [
                                styles.cardTapArea,
                                pressed && onCardPress ? styles.cardPressed : null,
                              ]}
                            >
                              <View style={styles.cardHeader}>
                                <MTypography variant="title" style={styles.cardTitle} numberOfLines={2}>
                                  {card.title}
                                </MTypography>
                                <MStatusBadge label={statusLabel} status={status} />
                              </View>

                              {card.description ? (
                                <MTypography style={styles.cardDescription} numberOfLines={3}>
                                  {card.description}
                                </MTypography>
                              ) : null}

                              {card.facts?.length ? (
                                <View style={styles.factsWrap}>
                                  {card.facts.map((fact) => (
                                    <View key={`${card.id}-${fact.label}`} style={styles.factTile}>
                                      <MTypography variant="caption" style={styles.factLabel}>
                                        {fact.label}
                                      </MTypography>
                                      <MTypography variant="body" style={styles.factValue}>
                                        {fact.value}
                                      </MTypography>
                                    </View>
                                  ))}
                                </View>
                              ) : null}

                              {card.tags?.length ? (
                                <View style={styles.tagRow}>
                                  {card.tags.map((tag) => (
                                    <MChip key={`${card.id}-${tag}`} label={tag} variant="filled" />
                                  ))}
                                </View>
                              ) : null}
                            </Pressable>

                            {boardBuckets.length > 1 ? (
                              <View style={styles.cardActions}>
                                <MTypography variant="caption" style={styles.moveHint}>
                                  Bucket
                                </MTypography>
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={() =>
                                    setBucketPicker({ cardId: card.id, fromBucketId: bucket.id })
                                  }
                                  style={styles.bucketSelector}
                                >
                                  <MTypography style={styles.bucketSelectorLabel}>
                                    {bucket.title}
                                  </MTypography>
                                  <MTypography variant="caption" style={styles.bucketSelectorAction}>
                                    Change
                                  </MTypography>
                                </TouchableOpacity>
                              </View>
                            ) : null}
                          </View>
                        );
                      })}
                    </ScrollView>
                  )}
                </MSurface>
              </View>
            );
          })}
        </ScrollView>
      )}

      <Modal
        visible={Boolean(bucketPicker && activePickerBucket && activePickerCard)}
        animationType="fade"
        transparent
        onRequestClose={() => setBucketPicker(null)}
      >
        <Pressable style={styles.modalScrim} onPress={() => setBucketPicker(null)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <MTypography variant="title">Select bucket</MTypography>
              {activePickerCard ? (
                <MTypography numberOfLines={2} style={styles.modalSubtitle}>
                  {activePickerCard.title}
                </MTypography>
              ) : null}
            </View>

            <View style={styles.modalOptions}>
              {boardBuckets.map((targetBucket) => {
                const selected = targetBucket.id === activePickerBucket?.id;

                return (
                  <TouchableOpacity
                    key={targetBucket.id}
                    activeOpacity={0.8}
                    disabled={selected || !bucketPicker}
                    onPress={() => {
                      if (!bucketPicker) return;
                      moveCard(bucketPicker.cardId, bucketPicker.fromBucketId, targetBucket.id);
                    }}
                    style={[
                      styles.modalOption,
                      selected ? styles.modalOptionSelected : null,
                    ]}
                  >
                    <View style={styles.modalOptionCopy}>
                      <View
                        style={[
                          styles.modalOptionAccent,
                          { backgroundColor: targetBucket.accentColor ?? BRAND_COLORS.accent },
                        ]}
                      />
                      <View style={styles.modalOptionText}>
                        <MTypography style={styles.modalOptionTitle}>
                          {targetBucket.title}
                        </MTypography>
                        {targetBucket.subtitle ? (
                          <MTypography variant="caption" style={styles.modalOptionSubtitle}>
                            {targetBucket.subtitle}
                          </MTypography>
                        ) : null}
                      </View>
                    </View>
                    <MTypography variant="caption" style={styles.modalOptionState}>
                      {selected ? 'Current' : 'Select'}
                    </MTypography>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
  },
  headerCopy: {
    gap: SPACING.xs,
    maxWidth: 420,
  },
  boardContent: {
    paddingLeft: 2,
    paddingRight: SPACING.lg,
  },
  bucketShell: {
    alignSelf: 'flex-start',
  },
  bucket: {
    flexShrink: 1,
    gap: SPACING.md,
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  bucketSpacing: {
    marginRight: SPACING.lg,
  },
  bucketHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  bucketCopy: {
    flex: 1,
    gap: SPACING.xs,
  },
  bucketTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bucketAccent: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
  },
  bucketSubtitle: {
    color: BRAND_COLORS.textMuted,
  },
  cardScroll: {
    flexGrow: 0,
  },
  cardStack: {
    gap: SPACING.sm,
    paddingBottom: 2,
  },
  card: {
    gap: SPACING.sm,
    borderRadius: RADIUS.xl,
    backgroundColor: BRAND_COLORS.surface,
    borderWidth: 1,
    borderColor: '#D7E3F2',
  },
  cardTapArea: {
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardHeader: {
    gap: SPACING.sm,
  },
  cardTitle: {
    color: BRAND_COLORS.textPrimary,
  },
  cardDescription: {
    color: BRAND_COLORS.textSecondary,
    lineHeight: 20,
  },
  factsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  factTile: {
    minWidth: 108,
    flexGrow: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F3F7FD',
    gap: 2,
  },
  factLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  factValue: {
    color: BRAND_COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  cardActions: {
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  moveHint: {
    color: BRAND_COLORS.textMuted,
  },
  bucketSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    backgroundColor: '#F8FBFF',
  },
  bucketSelectorLabel: {
    flex: 1,
    color: BRAND_COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  bucketSelectorAction: {
    color: BRAND_COLORS.accent,
    fontWeight: FONT_WEIGHT.semibold,
  },
  emptyState: {
    gap: SPACING.sm,
  },
  emptyBucket: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BRAND_COLORS.border,
    backgroundColor: BRAND_COLORS.surface,
  },
  emptyBucketText: {
    color: BRAND_COLORS.textMuted,
  },
  modalScrim: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: 'rgba(15, 23, 42, 0.32)',
  },
  modalCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 460,
    borderRadius: RADIUS.xxl,
    backgroundColor: BRAND_COLORS.surface,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  modalHeader: {
    gap: SPACING.xs,
  },
  modalSubtitle: {
    color: BRAND_COLORS.textSecondary,
  },
  modalOptions: {
    gap: SPACING.sm,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    backgroundColor: '#F8FBFF',
  },
  modalOptionSelected: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  modalOptionCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  modalOptionAccent: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
  },
  modalOptionText: {
    flex: 1,
    gap: 2,
  },
  modalOptionTitle: {
    color: BRAND_COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  modalOptionSubtitle: {
    color: BRAND_COLORS.textMuted,
  },
  modalOptionState: {
    color: BRAND_COLORS.accent,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
