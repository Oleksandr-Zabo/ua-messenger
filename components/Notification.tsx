import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/notifications.style";
import { TouchableOpacity, View, Text } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";

interface NotificationProps {
  notification: {
    type: "like" | "comment" | "follow";
    sender: {
      _id: Id<"users">;
      username: string;
      image: string;
    };
    post: {
      imageUrl: string;
    } | null;
    comment: string | undefined;
    _creationTime: number;
  };
}

export function Notification({notification}: NotificationProps) {
    const getIcon = () => {
        switch (notification.type) {
            case "like":
                return { name: "heart", color: "#FF3B30" };
            case "comment":
                return { name: "chatbubble", color: "#34C759" };
            case "follow":
                return { name: "person-add", color: "#5856D6" };
            default:
                return { name: "notifications", color: COLORS.primary };
        }
    };

    const getActionText = () => {
        switch (notification.type) {
            case "like":
                return "вподобав ваш пост";
            case "comment":
                return `прокоментував: "${notification.comment}"`;
            case "follow":
                return "почав стежити за вами";
            default:
                return "нова дія";
        }
    };

    const { name, color } = getIcon();

    return (
        <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
                <Link href={`/(tabs)/notifications`} asChild>
                    <TouchableOpacity style={styles.avatarContainer}>
                        <Image
                            source={notification.sender.image}
                            style={styles.avatar}
                            contentFit="cover"
                            transition={200}
                        />
                        <View style={styles.iconBadge}>
                            <Ionicons name={name as any} size={12} color={color} />
                        </View>
                    </TouchableOpacity>
                </Link>
                
                <View style={styles.notificationInfo}>
                    <Link href={`/(tabs)/notifications`} asChild>
                        <TouchableOpacity>
                            <Text style={styles.username}>{notification.sender.username}</Text>
                        </TouchableOpacity>
                    </Link>
                    <Text style={styles.action} numberOfLines={2}>
                        {getActionText()}
                    </Text>
                    <Text style={styles.timeAgo}>
                        {formatDistanceToNow(notification._creationTime, { addSuffix: true, locale: uk })}
                    </Text>
                </View>
            </View>
            
            {notification.post && (
                <Image
                    source={notification.post.imageUrl}
                    style={styles.postImage}
                    contentFit="cover"
                    transition={200}
                />
            )}
        </View>
    );
}