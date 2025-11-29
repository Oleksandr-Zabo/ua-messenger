import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, TextInput } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image";
import { fetch } from 'expo/fetch'; import { File, Paths } from 'expo-file-system';

import { styles } from "@/styles/create.styles";


export default function CreateScreen() {
  const router = useRouter();
  const user = useUser();
  //console.log("Current user:", user);

  //Локальні стани компонента
  const [caption, setCaption] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  // Convex mutations
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    //Якщо користувач не скасував вибір
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleShare = async () => {
    // перевірка наявності зображення
    if (!selectedImage) return;

    try {
      // встановити стан завантаження
      setIsSharing(true);

      // отримуємо URL для завантаження від Convex
      const uploadURL = await generateUploadUrl();

      // створюємо File об'єкт з локального URI
      const file = new File(selectedImage);
      // Завантажуємо файл на сервер
      const uploadResult = await fetch(uploadURL, {
        method: 'POST',
        headers: {
          "Content-Type": "image/jpeg",
        },
        body: file,
      }
      );

      // Перевіряємо успішність завантаження
      if (!uploadResult.ok) throw new Error("Upload failed ");
      // Отримуємо storageId з відповіді
      const { storageId } = await uploadResult.json();

      // Створюємо пост у базі даних Convex
      await createPost({ storageId, caption });

      // Скидаємо форму
      setCaption("");
      setSelectedImage(null);

      router.push("/(tabs)");

    } catch (error) {
      console.error("Error sharing post ): ", error);
    }
    finally {
      setIsSharing(false);
    }
  };

  if (!selectedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={{ width: 28 }} />
        </View>

        <TouchableOpacity style={styles.emptyImageContainer}
          onPress={pickImage}
        >
          <Ionicons name="image-outline" size={48} color={COLORS.grey} />
          <Text style={styles.emptyImageText}>Tap to select an image</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.contentContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(null);
              setCaption("");
            }}
            disabled={isSharing}
          >
            <Ionicons
              name="close-outline"
              size={28}
              color={isSharing ? COLORS.grey : COLORS.white}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>New Post</Text>

          <TouchableOpacity
            style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
            disabled={isSharing || !selectedImage}
           onPress={handleShare}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentOffset={{ x: 0, y: 100 }}
        >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>
            {/* IMAGE SECTION */}
            <View style={styles.imageSection}>
              <Image
                source={selectedImage}
                style={styles.previewImage}
                contentFit="cover"
                transition={200}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
              >
                <Ionicons name="image-outline" size={20} color={COLORS.white} />
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* INPUT SECTION */}
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image
                  source={user?.user?.imageUrl}
                  style={styles.userAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={COLORS.grey}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );

}
