
import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    width: width,
    height: height,
    resizeMode: "cover",
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    zIndex: 1,
  },
  touchArea: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    zIndex: 10,
    paddingTop: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  userName: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  timeAgo: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginLeft: 8,
  },
  closeButton: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)", // Background for closing button
    borderRadius: 20,
  },
  indicators: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 40 : 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    gap: 4,
    zIndex: 10,
  },
  indicator: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 1,
    overflow: "hidden",
  },
  activeIndicator: {
    backgroundColor: "white",
  },
});