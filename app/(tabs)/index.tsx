import { COLORS } from "@/constants/theme";
import { useAuth } from "@clerk/clerk-expo";
import { Text, View, TouchableOpacity, ScrollView, FlatList } from "react-native";
import {styles} from "@/styles/feed.styles";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Post } from "@/components/Post";
import { Loader } from "@/components/Loader";
import { NoPostsFound } from "@/components/NotPostsFound";
import { StoriesSection } from "@/components/Stories";

export default function IndexTab() {
  const {signOut} = useAuth();

  const posts = useQuery(api.posts.getFeedPosts, {});

  if(posts === undefined) return <Loader />;
  
  if(posts.length === 0) return <NoPostsFound />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ua-messenger</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* POSTS */}
      <FlatList 
        data={posts}
        keyExtractor={(item) => String(item._id)}
        showsVerticalScrollIndicator = {false}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem ={({item}) => <Post post={item} />}
        ListHeaderComponent={<StoriesSection /> }
      />

     </View>
  );
}
