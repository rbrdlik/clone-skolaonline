import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./context/AuthContext";
import { api } from "./services/api";
import { mockSubjectsWithGrades } from "./data/grades";

export default function SubjectDetail() {
  const { subjectId, subjectName: paramSubjectName } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState(paramSubjectName || "Neznámý předmět");
  
  useEffect(() => {
    loadGrades();
  }, [subjectId, user?._id]);

  const loadGrades = async () => {
    setLoading(true);
    try {
      if (user?._id && subjectId) {
        const data = await api.getGradesBySubject(user._id, subjectId);
        // Backend vrací pole: { _id, value, weight, description, subject, teacher, date }
        const transformed = data.map((grade) => ({
          _id: grade._id || `grade-${grade.date}`,
          value: grade.value,
          name: grade.description || "Známka",
          teacher: grade.teacher || "Neznámý učitel",
          date: new Date(grade.date).toLocaleDateString('cs-CZ'),
          weight: grade.weight,
        }));
        setGrades(transformed);
        if (data.length > 0) {
          setSubjectName(data[0].subject || paramSubjectName || "Neznámý předmět");
        }
      } else {
        // Fallback na mock data
        const subjectData = mockSubjectsWithGrades[subjectId] || mockSubjectsWithGrades["cj-1"];
        setSubjectName(subjectData.subject);
        setGrades(subjectData.grades || []);
      }
    } catch (error) {
      console.error("Error loading grades:", error);
      // Fallback na mock data
      const subjectData = mockSubjectsWithGrades[subjectId] || mockSubjectsWithGrades["cj-1"];
      setSubjectName(subjectData.subject);
      setGrades(subjectData.grades || []);
    } finally {
      setLoading(false);
    }
  };

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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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

