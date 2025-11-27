import { Link } from "expo-router/build/link/Link";
import { Text, View, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/profile.tsx to edit this screen.</Text>
      <Link style={styles.link} href="/">Home</Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
    link: {
    marginVertical: 20,
    color: 'blue',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },

});