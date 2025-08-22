import { useActivity } from '@/hooks/useActivity';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';


export default function ActivityDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: activity, loading, error } = useActivity(id);
  
    if (loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
  
    if (error || !activity) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text>Activity not found.</Text>
        </View>
      );
    }
  
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>{activity.type}</Text>
        <Text style={{ fontSize: 16, opacity: 0.8 }}>
          Start: {new Date(activity.startTime).toLocaleString()}
        </Text>
        <Text style={{ fontSize: 16, opacity: 0.8 }}>
          Duration: {formatMinutes(activity.durationMin)}
        </Text>
        <Text style={{ fontSize: 16, opacity: 0.8 }}>
          Distance: {formatKm(activity.distanceKm)} km
        </Text>
        {activity.preview ? (
          <Text style={{ marginTop: 16, lineHeight: 22 }}>{activity.preview}</Text>
        ) : null}
      </ScrollView>
    );
}  
  

function formatMinutes(min: number) {
const h = Math.floor(min / 60);
const m = Math.round(min % 60);
return h > 0 ? `${h}h ${m}m` : `${m}m`;
}


function formatKm(km: number) {
return Number(km.toFixed(2));
}