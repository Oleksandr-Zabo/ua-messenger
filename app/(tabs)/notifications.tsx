import { Link } from "expo-router/build/link/Link";
import { Text, View, StyleSheet } from "react-native";

export default function NotificationScreen() {
  return (
    <View
      style={styles.container}
    >
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