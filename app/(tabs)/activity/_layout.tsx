import Feather from '@expo/vector-icons/Feather';
import { Stack } from 'expo-router';
import { Pressable } from 'react-native';


export default function ActivityStackLayout() {
    return (
        <Stack>
        <Stack.Screen name="index" options={{ title: 'Activities' }} />
        <Stack.Screen name="[id]" options={({ navigation }) => ({
          headerTitle: 'Details',
          headerBackVisible: false,   // remove default "< Activities"
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 12 }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather name="chevron-left" size={26} />
            </Pressable>
          ),
        })} />
        </Stack>
    );
}
