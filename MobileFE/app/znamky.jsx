import { View, Text, StyleSheet, ScrollView, TouchableOpacity, PanResponder } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { api } from "./services/api";
import { useRouter } from "expo-router";
import Header from "./components/Header";
import { Ionicons } from "@expo/vector-icons";
import { getSubjectsWithAverages } from "./data/grades";

const getAverageColor = (average) => {
  if (average >= 1.0 && average < 1.5) {
    return "#C8E6C9";
  } else if (average >= 1.5 && average < 2.5) {
    return "#C8E6C9";
  } else if (average >= 2.5 && average < 3.5) {
    return "#FFE5B4";
  } else if (average >= 3.5 && average < 4.5) {
    return "#FFE5B4";
  } else {
    return "#FFCDD2";
  }
};

export default function Znamky() {
  const { user } = useAuth();
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);

  useEffect(() => {
    loadGrades();
  }, [selectedSemester]);

  const loadGrades = async () => {
    setLoading(true);
    try {
      if (user?.studentId) {
        const data = await api.getGrades(user.studentId, selectedSemester);
        setSubjects(data.subjects || []);
      } else {
        const subjectsWithAverages = getSubjectsWithAverages();
        setSubjects(subjectsWithAverages);
      }
    } catch (error) {
      console.error("Error loading grades:", error);
      const subjectsWithAverages = getSubjectsWithAverages();
      setSubjects(subjectsWithAverages);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectPress = (subjectId) => {
    router.push({
      pathname: "/subject-detail",
      params: { subjectId }
    });
  };

  const swipePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderGrant: (evt) => {
      swipeStartX.current = evt.nativeEvent.pageX;
      swipeStartY.current = evt.nativeEvent.pageY;
    },
    onPanResponderMove: () => {},
    onPanResponderRelease: (evt, gestureState) => {
      const deltaX = evt.nativeEvent.pageX - swipeStartX.current;
      const deltaY = Math.abs(evt.nativeEvent.pageY - swipeStartY.current);
      
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
        if (deltaX < 0) {
          router.push("/messages");
        } else {
          router.push("/rozvrh");
        }
      }
    },
  });

  return (
    <View style={styles.container}>
      <Header title="Hodnocení v předmětu" showProfile={true} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        {...swipePanResponder.panHandlers}
      >
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="share-outline" size={16} color="#666" />
            <Text style={styles.filterText}>{selectedSemester}. pololetí</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.subjectsListContainer}>
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.subjectId}
              subject={subject.subject}
              average={subject.average}
              gradeCount={subject.gradeCount}
              color={getAverageColor(subject.average)}
              onPress={() => handleSubjectPress(subject.subjectId)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SubjectCard({ subject, average, gradeCount, color, onPress }) {
  const displayAverage = (average != null && !isNaN(average)) ? average : 0;
  const displayCount = gradeCount || 0;
  
  return (
    <TouchableOpacity style={styles.subjectCard} onPress={onPress}>
      <View style={[styles.averageBox, { backgroundColor: color }]}>
        <Text style={styles.averageText}>{displayAverage.toFixed(2)}</Text>
      </View>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{subject || "Neznámý předmět"}</Text>
        <Text style={styles.gradeCountText}>Průměr z {displayCount} známek</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  subjectsListContainer: {
    paddingHorizontal: 20,
  },
  subjectCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  averageBox: {
    width: 65,
    height: 65,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  averageText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  gradeCountText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});
