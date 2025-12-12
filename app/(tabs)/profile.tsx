import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/profile.style";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { NoPostsFound } from "@/components/NotPostsFound";
import { Image } from "expo-image";
import { ModalPreviewPost } from "@/components/ModalPreviewPost";
import { ModalEditProfile } from "@/components/ModalEditProfile";

export default function ProfileScreen() {
  const { signOut, userId } = useAuth();

  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : 'skip');
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Doc<'posts'> | null>(null);
  const [editedProfile, setEditedProfile] = useState<{
    fullname: string;
    bio?: string;
  }>({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio,
  });

  const posts = useQuery(api.posts.getPostsByUser, {});

  const updateProfile = useMutation(api.users.updateProfile);

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile);
    setIsEditModalVisible(false);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser?.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Profile Info and Posts */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={currentUser?.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser?.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser?.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser?.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

          </View>
          <Text style={styles.name}>{currentUser?.fullname}</Text>
          {currentUser?.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
        {posts?.length === 0 && <NoPostsFound />}
        <FlatList
          data={posts}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.gridItem} onPress={() => setSelectedPost(item)}>
              <Image
                source={item.imageUrl}
                style={styles.gridImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          )
          }
        />
        <ModalPreviewPost post={selectedPost} setSelectedPost={setSelectedPost} />
        {/* Edit Profile Modal */}
        {isEditModalVisible && (
          <ModalEditProfile
            isEditModalVisible={isEditModalVisible}
            setIsEditModalVisible={setIsEditModalVisible}
            editedProfile={editedProfile}
            setEditedProfile={setEditedProfile}
            handleSaveProfile={handleSaveProfile}
          />
        )}
      </ScrollView>
    </View>
  );
}