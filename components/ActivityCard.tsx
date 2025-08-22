import type { Activity } from '@/lib/api/activities';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text, View } from 'react-native';


export default function ActivityCard({ activity }: { activity: Activity }) {
return (
  <View
    style={{
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <ActivityIcon type={activity.type} size={22} />
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{activity.type}</Text>
    </View>

    <View style={{ flexDirection: 'row', marginTop: 8, gap: 16 }}>
      <Text style={{ opacity: 0.7 }}>{new Date(activity.startTime).toLocaleString()}</Text>
      <Text style={{ opacity: 0.7 }}>• {formatMinutes(activity.durationMin)}</Text>
      <Text style={{ opacity: 0.7 }}>• {formatKm(activity.distanceKm)} km</Text>
    </View>

    {activity.preview && (
    <Text style={{ marginTop: 8, opacity: 0.85 }} numberOfLines={2}>
    {activity.preview}
    </Text>
    )}
  </View>
  );
}


function ActivityIcon({ type, size = 22, color }: { type: string; size?: number; color?: string }) {
    switch (type) {
      case 'Football':
        return <Ionicons name="football" size={size} color={color} />;
      case 'Basketball':
        return <Ionicons name="basketball" size={size} color={color} />;
      default:
        return <Ionicons name="body" size={size} color={color} />;
    }
  }


function formatMinutes(min: number) {
const h = Math.floor(min / 60);
const m = Math.round(min % 60);
return h > 0 ? `${h}h ${m}min` : `${m}min`;
}


function formatKm(km: number) {
return Number(km.toFixed(2));
}