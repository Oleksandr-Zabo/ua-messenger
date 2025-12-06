import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { Loader } from "./Loader";
import { Comment } from "./Comment";

interface CommentsModalProps {
  postId: Id<'posts'>;
  visible: boolean;
  onClose: () => void;
  onCommentsAdd: () => void;
}

export function CommentsModal({ postId, visible, onClose, onCommentsAdd }: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");

  const comments = useQuery(api.comments.getComments, { postId });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try{
      await addComment({content: newComment, postId});
      setNewComment("");
      onCommentsAdd();
    } 
    catch (error) {
      console.error("Error adding comment ): ", error);
    }
   };

  const addComment = useMutation(api.comments.addComment);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}>

        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Comments List */}
        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Comment comment={item} />}
            contentContainerStyle={styles.commentsList}
            ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: COLORS.white, fontSize: 25 }}>No comments </Text></View>}
          />
        )}

        {/* Input */}
        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.grey}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Text
              style={[
                styles.postButton,
                !newComment.trim() && styles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}