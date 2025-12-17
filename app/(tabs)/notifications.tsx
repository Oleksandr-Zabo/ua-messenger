import { FlatList, Text, View } from "react-native";
import { styles } from "@/styles/notifications.style";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Notification } from "@/components/Notification";
import { Id } from "@/convex/_generated/dataModel";
import { SwipeableNotification } from "@/components/SwipeableNotification";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function NotificationScreen() {
  const { isAuthenticated } = useConvexAuth();
  const deleteNotification = useMutation(api.notifications.deleteNotification);
  const notifications = useQuery(api.notifications.getNotifications, isAuthenticated ? {} : "skip");

  if (notifications === undefined) return <Loader />;
  if (notifications.length === 0) return <NoNotificationsFound />;

  const handleDeleteNotification = async (notificationId: Id<"notifications">) => {
    try {
      await deleteNotification({ notificationId });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <SwipeableNotification notification={item} onDelete={handleDeleteNotification} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </GestureHandlerRootView>
  );
}

function NoNotificationsFound() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons name="notifications-outline" size={75} color={COLORS.primary} />
      <Text style={{ fontSize: 25, color: COLORS.white }}>
        No notifications yet
      </Text>
    </View>
  );
}