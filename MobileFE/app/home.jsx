import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";

export default function Home() {
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
            <Text style={styles.username}>Roman Brdlík</Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.settingsIcon}>⚙️</Text>
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
          {renderDay("St", 14, true)}
          {renderDay("Čt", 15)}
          {renderDay("Pá", 16)}
        </View>

        {/* Lessons */}
        {renderLesson({
          index: "0",
          subject: "Konzultace",
          teacher: "Lišková I.",
          room: "Učebna: 052",
          classInfo: "Třídy: 1A1, 1B1…",
          time: "7:05 - 7:50",
          color: "#EEF3FF"
        })}

        {renderLesson({
          index: "1",
          subject: "Český jazyk a literatura",
          teacher: "Svárovská V.",
          room: "Učebna: 052",
          classInfo: "Celá třída",
          time: "7:55 - 8:40",
          color: "#E9F9FF"
        })}

        {renderLesson({
          index: "2-3",
          subject: "Programování",
          teacher: "Pelíkán R.",
          room: "Učebna: 030",
          classInfo: "Skupina IT1",
          time: "8:45 - 10:35",
          color: "#FFD7D7",
          bold: true
        })}

        {renderLesson({
          index: "4",
          subject: "Matematika",
          teacher: "Lišková I.",
          room: "Učebna: 053",
          classInfo: "Celá třída",
          time: "10:40 - 11:25",
          color: "#F1F1F1"
        })}

        {renderLesson({
          index: "5",
          subject: "Anglický jazyk",
          teacher: "Švábová Š.",
          room: "Učebna: 060",
          classInfo: "Skupina ANJ2",
          time: "11:30 - 12:15",
          color: "#DDDDDD",
          dimmed: true
        })}

      </ScrollView>

      {/* Bottom Navbar */}
      <View style={styles.navbar}>
        {renderNav("Zprávy")}
        {renderNav("Absence")}
        {renderNav("Rozvrh", true)}
        {renderNav("Hodnocení")}
        {renderNav("Úkoly")}
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

function renderLesson({ index, subject, teacher, room, classInfo, time, color, bold, dimmed }) {
  return (
    <View style={[styles.lesson, { backgroundColor: color }, dimmed && styles.dimmed]}>
      <View style={styles.lessonIndexBox}>
        <Text style={styles.lessonIndex}>{index}</Text>
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
    width: 55,
    height: 70,
    borderRadius: 15,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center"
  },
  dayBoxActive: {
    backgroundColor: "#7d8aff"
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
    alignItems: "center"
  },
  dimmed: { opacity: 0.6 },

  lessonIndexBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#ffffffaa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  lessonIndex: { fontSize: 20, fontWeight: "700" },

  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 18, fontWeight: "600" },
  bold: { fontWeight: "800" },
  lessonTeacher: { color: "#444" },
  lessonDetails: { marginTop: 3, color: "#555" },
  lessonTime: { marginTop: 5, color: "#777" },

  navbar: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#e1e1e1"
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, color: "#888" },
  navTextActive: { color: "#000", fontWeight: "700" }
});
