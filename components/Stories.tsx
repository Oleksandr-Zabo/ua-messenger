import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { ScrollView, ActivityIndicator, View, Alert } from "react-native";
import { Story } from "./Story";
import * as ImagePicker from "expo-image-picker";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import { useState } from "react";
import { StoryViewer } from "./StoryViewer";
import { Id } from "@/convex/_generated/dataModel";

export const StoriesSection = () => {
  const stories = useQuery(api.users.getStoriesUsers);
  const generateUploadUrl = useMutation(api.stories.generateUploadUrl);
  const createStory = useMutation(api.stories.createStory);
  const [selectedStoryUser, setSelectedStoryUser] = useState<Id<"users"> | null>(null);

  const handleCreateStory = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uploadUrl = await generateUploadUrl();
        
        // Використовуємо File з expo-file-system для створення файлу
        const file = new File(result.assets[0].uri);

        const resultUpload = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": "image/jpeg" },
          body: file,
        });

        if (!resultUpload.ok) throw new Error("Upload failed");
        const { storageId } = await resultUpload.json();

        await createStory({ storageId });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create story");
      console.error(error);
    }
  };

  // Показати loader поки дані завантажуються
  if (stories === undefined) {
    return (
      <View style={styles.storiesContainer}>
        <ActivityIndicator size="small" color="#0095f6" />
      </View>
    );
  }

  // Якщо немає stories
  if (stories.length === 0) {
    return null;
  }

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesContainer}
      >
        {stories.map((story) => (
          <Story
            key={story.id}
            story={story}
            onPress={() => {
              if (story.username === "You" && !story.hasStory) {
                handleCreateStory();
              } else if (story.hasStory) {
                setSelectedStoryUser(story.id as Id<"users">);
              }
            }}
            onAddStory={() => {
              if (story.username === "You") {
                handleCreateStory();
              }
            }}
          />
        ))}
      </ScrollView>
      {selectedStoryUser && (
        <StoryViewer
          userId={selectedStoryUser}
          onClose={() => setSelectedStoryUser(null)}
        />
      )}
    </View>
  );
};