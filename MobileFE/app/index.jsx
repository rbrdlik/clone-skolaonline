import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";



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

        {/* Month selector */}
        <View style={styles.monthRow}>
          <TouchableOpacity><Text style={styles.arrow}>‹</Text></TouchableOpacity>
          <Text style={styles.monthText}>Prosinec 2025</Text>
          <TouchableOpacity><Text style={styles.arrow}>›</Text></TouchableOpacity>
        </View>

        {/* Days row */}
        <View style={styles.daysRow}>
          {renderDay("Po", 12)}
          {renderDay("Út", 13)}
          {renderDay("St", 14)}
          {renderDay("Čt", 15)}
          {renderDay("Pá", 16)}
        </View>



      </ScrollView>

      {/* Bottom Navbar */}
      <View style={styles.navWrapper}>
        <View style={styles.navBar}>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.icon}>💬</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navCenter}>
          <Text style={styles.centerIcon}>📅</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.icon}>⭐</Text>
        </TouchableOpacity>

        </View>
      </View>

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

   navWrapper: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center"
  },

  navBar: {
    width: "70%",
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 35,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8
  },

  navItem: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },

  icon: {
    fontSize: 20
  },

  navCenter: {
    width: "30%",
    height: "60%",
    borderRadius: 32,
    backgroundColor: "#4C8DEF",
    justifyContent: "center",
    alignItems: "center",
     
  },

  centerIcon: {
    fontSize: 28,
    color: "#fff"
    
  },
  
});
