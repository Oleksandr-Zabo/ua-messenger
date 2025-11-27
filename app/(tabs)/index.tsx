import { COLORS } from "@/constants/theme";
import { useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router/build/link/Link";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
export default function IndexTab() {
  const {signOut} = useAuth();
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Home Screen</Text>
      <TouchableOpacity style={styles.btn} onPress={() => signOut()}>
        <Text style={styles.btnText}>Вийти</Text>
      </TouchableOpacity>
     </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
    title: {
    color: 'blue',
    padding: 10,
    borderRadius: 5,
    fontSize: 24,
  },
  btn: {
    padding: 10,
    backgroundColor: COLORS.background,
    borderRadius: 5,
    marginVertical: 20,
  },
  btnText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600',
  },


});