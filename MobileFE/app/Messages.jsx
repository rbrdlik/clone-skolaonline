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

function renderLesson({ subject, teacher, room, classInfo, time, color, bold, dimmed }) {
  return (
    <View style={[styles.lesson, { backgroundColor: color }, dimmed && styles.dimmed]}>
      <View style={styles.lessonIdBox}>
        
      </View>

      <View style={styles.lessonInfo}>
        <Text style={[styles.lessonTitle, bold && styles.bold]}>{subject}</Text>
        <Text style={styles.lessonTeacher}>{teacher}</Text>
        <Text style={styles.lessonDetails}>{room}  •  {classInfo}</Text>
        <Text style={styles.lessonTime}>🕒 {time}</Text>
      </View>
    </View>
  );
}

function renderNav(label, active = false) {
  return (
    <TouchableOpacity style={styles.navItem}>
      <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
    </TouchableOpacity>
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


  
});
