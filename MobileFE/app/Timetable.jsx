import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import {Link} from "expo-router";


export default function Index() {
  return (
    
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" }}
              style={styles.avatar}
            />
            <Text style={styles.username}>Rozvrh hodin</Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.settingsIcon}><Image></Image></Text>
          </TouchableOpacity>
        </View>

        {/* Month selector - dodělat aktualní datum- funkční výběr datumu*/}
        <View style={styles.monthRow}>
          <TouchableOpacity><Text style={styles.arrow}>‹</Text></TouchableOpacity>
          <Text style={styles.monthText}>Prosinec 2025</Text>
          <TouchableOpacity><Text style={styles.arrow}>›</Text></TouchableOpacity>
        </View>

        {/* Days row - dodělat aktualní datum*/}
        <View style={styles.daysRow}>
          {renderDay("Po", 12)}
          {renderDay("Út", 13)}
          {renderDay("St", 14)}
          {renderDay("Čt", 15)}
          {renderDay("Pá", 16)}
        </View>



      </ScrollView>


    </View>
  );
}

function renderDay(label, num, active = false) {
  return (
    <View style={[styles.dayBox, active && styles.dayBoxActive]}>
      <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{label}</Text>
      <Text style={[styles.dayNum, active && styles.dayNumActive]}>{num}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  username: { fontSize: 22, fontWeight: "600" },
  settingsIcon: { fontSize: 24 },

  monthRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10
  },
  arrow: { fontSize: 28, paddingHorizontal: 20 },
  monthText: { fontSize: 20, fontWeight: "700" },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10
  },
  dayBox: {
    width: "19%",
    height: 70,
    borderRadius: 15,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center"
  },
  dayBoxActive: {
    backgroundColor: "#4C8DEF"
  },
  dayLabel: { fontSize: 14, color: "#333" },
  dayLabelActive: { color: "#fff" },
  dayNum: { fontSize: 18, marginTop: 3, color: "#444" },
  dayNumActive: { color: "#fff" },

  lesson: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    
  },
  dimmed: { opacity: 0.6 },

  lessonIdBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#ffffffaa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  lessonId: { fontSize: 20, fontWeight: "700" },

  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 18, fontWeight: "600" },
  bold: { fontWeight: "800" },
  lessonTeacher: { color: "#444" },
  lessonDetails: { marginTop: 3, color: "#555" },
  lessonTime: { marginTop: 5, color: "#777" },


  
});
