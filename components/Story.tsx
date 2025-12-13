import { styles } from "@/styles/feed.styles";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
 
type StoryProps = {
id: string;
username: string;
avatar: string;
hasStory: boolean;
};
 
export function Story({ 
  story, 
  onPress,
  onAddStory 
}: { 
  story: StoryProps; 
  onPress?: () => void;
  onAddStory?: () => void;
}) {
  const isCurrentUser = story.username === "You";

  return (
    <TouchableOpacity style={styles.storyWrapper} onPress={onPress}>
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
        
        {isCurrentUser && (
          <TouchableOpacity 
            style={styles.addStoryButton} 
            onPress={onAddStory}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <View style={styles.addStoryButtonBackground} />
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.storyUsername}>{story.username}</Text>
    </TouchableOpacity>
  );
}