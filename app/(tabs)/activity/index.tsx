import ActivityCard from '@/components/ActivityCard';
import { useActivities } from '@/hooks/useActivities';
import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


// ------------- Constants & helpers --------------------//
const BASE_TYPES = ['Football', 'Basketball'] as const; // Add more base sport types as needed
type BaseType = (typeof BASE_TYPES)[number];
type TypeKey = BaseType | 'Others';

const ALL_TYPES: readonly TypeKey[] = [...BASE_TYPES, 'Others'] as const;

// Normalize function to handle case and whitespace
const normalize = (s: string) => s.trim().toLowerCase();
const BASE_SET = new Set(BASE_TYPES.map(normalize));
const isOtherType = (t: string) => !BASE_SET.has(normalize(t));

// ------------------- Screen ---------------------------//
export default function ActivityListScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading, error, refresh } = useActivities();

  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<TypeKey>>(new Set());

  // Handlers
  // Toggles the selected state of a type
  const toggleType = useCallback((t: TypeKey) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  }, []);

  // Sort newest → oldest
  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    return arr;
  }, [data]);

  // Type filter function
  // Returns true if the activity type matches any selected type or "Others"
  // If no types are selected, it matches all activities
  const typeMatches = useCallback((activityType: string) => {
    if (selectedTypes.size === 0) return true;
    const low = normalize(activityType);
    const someBaseSelected = [...selectedTypes].some(
      t => t !== 'Others' && low === normalize(t as string)
    );
    const matchesOthers = selectedTypes.has('Others') && isOtherType(low);
    return someBaseSelected || matchesOthers;
  }, [selectedTypes]);

  // Text + Type filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter(a => {
      const typeOk = typeMatches(a.type);
      const textOk =
        q.length === 0
          ? true
          : a.type.toLowerCase().includes(q) ||
            a.preview?.toLowerCase().includes(q) ||
            new Date(a.startTime).toLocaleString().toLowerCase().includes(q);
      return typeOk && textOk;
    });
  }, [sorted, query, typeMatches]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Could not load activities.</Text>
        <Text style={styles.errorSubtitle}>{String(error)}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}> 
      {/* Toolbar + filter icon*/}
      <View style={styles.toolbar}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#666" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search sport, notes, date…"
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        <Pressable
          onPress={() => setFiltersOpen(v => !v)}
          accessibilityLabel="Toggle filters"
          style={styles.iconBtn}
          android_ripple={{ color: '#333', borderless: false }}
        >
          <Feather name="filter" size={18} color="#fff" />
        </Pressable>
      </View>

      {/* Sport chips panel (when filter icon pressed) */}
      {(filtersOpen || selectedTypes.size > 0) && (
        <View style={styles.filtersContainer}>
          <View style={styles.chipsRow}>
            {ALL_TYPES.map(t => {
              const selected = selectedTypes.has(t);
              return (
                <Pressable
                  key={t}
                  onPress={() => toggleType(t)}
                  style={[
                    styles.chip,
                    { borderColor: selected ? '#111' : '#ddd', backgroundColor: selected ? '#111' : '#fff' },
                  ]}
                >
                  <Text style={[styles.chipText, { color: selected ? '#fff' : '#111' }]}>{t}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 22}]}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={{ opacity: 0.7 }}>No activities match your filter.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Link asChild href={{ pathname: '/activity/[id]', params: { id: item.id } }}>
            <Pressable>
              <ActivityCard activity={item} />
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

// ---------------- Styles ---------------- //
const styles = StyleSheet.create({
  screen: { flex: 1 },
  centered: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  errorTitle: {
    fontSize: 16,
    marginBottom: 12
  },
  errorSubtitle: { opacity: 0.7 },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchBox: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#E1EDED',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1 },
  iconBtn: {
    marginLeft: 8,
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1
  },
  chipText: { fontWeight: '600' },
  listContent: {
    padding: 16,
    gap: 12
  },
  empty: { padding: 24 },
});
