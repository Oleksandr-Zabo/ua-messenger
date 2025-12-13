import { Modal, View, Image, TouchableOpacity, Text, StatusBar, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import { styles } from "@/styles/story.styles";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";

interface StoryViewerProps {
  userId: Id<"users">;
  onClose: () => void;
}

export function StoryViewer({ userId, onClose }: StoryViewerProps) {
  const stories = useQuery(api.stories.getStoriesByUser, { userId });
  const user = useQuery(api.users.getUserProfile, { id: userId });
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!stories) return;

    progress.setValue(0);
    
    Animated.timing(progress, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start(({ finished }) => {
      if (finished) {
        if (currentIndex < stories.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          onClose();
        }
      }
    });

    return () => {
      progress.stopAnimation();
    };
  }, [currentIndex, stories, onClose]);

  if (!stories || !user) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentStory = stories[currentIndex];

  if (!currentStory) return null;

  return (
    <Modal animationType="fade" transparent={true} visible={true} onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        <Image
          source={{ uri: currentStory.imageUrl }}
          style={styles.image}
        />

        <View style={styles.controls}>
          <TouchableOpacity style={styles.touchArea} onPress={handlePrev} />
          <TouchableOpacity style={styles.touchArea} onPress={handleNext} />
        </View>

        <View style={styles.indicators}>
          {stories.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index < currentIndex ? styles.activeIndicator : null,
              ]}
            >
              {index === currentIndex && (
                <Animated.View
                  style={[
                    styles.activeIndicator,
                    {
                      height: "100%",
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <View style={styles.header}>
            <View style={styles.userInfo}>
                <Image source={{ uri: user.image }} style={styles.userAvatar} />
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(currentStory._creationTime, { addSuffix: true, locale: uk })}
                </Text>
            </View>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


  
