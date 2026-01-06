import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "./components/Header";
import { Ionicons } from "@expo/vector-icons";
import { mockSubjectsWithGrades } from "./data/grades";

export default function SubjectDetail() {
  const { subjectId } = useLocalSearchParams();
  const router = useRouter();
  
  // Načtení dat podle subjectId
  const subjectData = mockSubjectsWithGrades[subjectId] || mockSubjectsWithGrades["cj-1"];
  const subjectName = subjectData.subject;
  const grades = subjectData.grades || [];

  const handleGradePress = (gradeId) => {
    router.push({
      pathname: "/grade-detail",
      params: { gradeId, subjectName }
    });
  };

  return (
    <View style={styles.container}>
      <Header title={subjectName} showBack />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Grades List */}
        <View style={styles.gradesContainer}>
          {grades.map((grade) => (
            <TouchableOpacity
              key={grade._id}
              style={styles.gradeCard}
              onPress={() => handleGradePress(grade._id)}
            >
              <View style={styles.gradeValueBox}>
                <Text style={styles.gradeValue}>{grade.value}</Text>
              </View>
              <View style={styles.gradeInfo}>
                <Text style={styles.gradeName}>{grade.name}</Text>
                <Text style={styles.gradeTeacher}>Učitel {grade.teacher}</Text>
              </View>
              <View style={styles.gradeDateContainer}>
                <Text style={styles.gradeDate}>{grade.date}</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  gradesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  gradeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    padding: 15,
    alignItems: "center",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Android shadow
    elevation: 2,
  },
  gradeValueBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  gradeValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  gradeInfo: {
    flex: 1,
  },
  gradeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  gradeTeacher: {
    fontSize: 14,
    color: "#666",
  },
  gradeDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  gradeDate: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
});

