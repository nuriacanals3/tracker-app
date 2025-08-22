import ActivityCard from '@/components/ActivityCard';
import { useActivities } from '@/hooks/useActivities';
import { Link } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';



export default function HomeScreen() {
  // State to manage connection status
  // TEMP: this will be replaced with actual connection logic later
  const [connected, setConnected] = useState(false);
  const deviceName = connected ? 'Tracker' : null;

  const { data, loading, error, refresh } = useActivities();

  // Latest activity
  const last = useMemo(() => {
    if (!data || data.length === 0) return null;
    const sorted = [...data].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    return sorted[0];
  }, [data]);

  const handlePrimaryPress = useCallback(() => {
    // TEMP: toggle to see the UI change; later this will call connect/sync
    setConnected((v) => !v);
  }, []);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={{ backgroundColor: 'white' }} />
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            onPress={handlePrimaryPress}
            style={({ pressed }) => [styles.statusPill, connected ? styles.statusOn : styles.statusOff, pressed && { opacity: 0.8 }]}
          >
            <View style={[styles.statusDot, connected ? styles.dotOn : styles.dotOff]} />
            <Text style={styles.statusText}>{connected ? `${deviceName ? ` ${deviceName}` : ''}` : 'Disconnected'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Welcome Back!</Text>
        {/* Widgets */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Last Activity</Text>

          {last ? (
            <Link
              asChild
              href={{ pathname: '/activity/[id]', params: { id: last.id } }}
            >
              <Pressable>
                <ActivityCard activity={last} />
              </Pressable>
            </Link>
          ) : (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.06)',
              }}
            >
              <Text style={{ fontWeight: '600', marginBottom: 6 }}>No activity yet</Text>
              <Text style={{ opacity: 0.7 }}>
                Start a session to see your latest activity summary here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },

  /* Header bar */
  headerBar: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures spacing between left and right sections
    position: 'relative', // Allows absolute positioning for the title
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerRight: {
    marginLeft: 'auto', // Pushes the status to the far right
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
  statusOn: {
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderColor: 'rgba(34,197,94,0.35)',
  },
  statusOff: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderColor: 'rgba(239,68,68,0.35)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  dotOn: { backgroundColor: '#22c55e' },
  dotOff: { backgroundColor: '#ef4444' },
  statusText: {
    fontSize: 12,
  },

  /* Body */
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  header: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  }
});
