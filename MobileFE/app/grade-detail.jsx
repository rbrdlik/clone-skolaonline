import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import { api } from "./services/api";

// Mock data - fallback
const mockGradeData = {
  _id: "grade-1",
  subject: "Český jazyk a literatura",
  name: "Maturitní opakování",
  value: "4",
  date: "12.12.2025",
  type: "Známka",
  weight: 0.0,
  description: "",
};

export default function GradeDetail() {
  const { gradeId, subjectName } = useLocalSearchParams();
  const [grade, setGrade] = useState(mockGradeData);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadGrade();
  }, [gradeId]);

  const loadGrade = async () => {
    setLoading(true);
    try {
      if (gradeId) {
        const data = await api.getGradeById(gradeId);
        // Backend vrací: { _id, value, weight, description, subject, subjectShort, teacher, class, date }
        const date = new Date(data.date);
        setGrade({
          _id: data._id,
          subject: data.subject || subjectName || "Neznámý předmět",
          name: data.description || "Známka",
          value: data.value,
          date: date.toLocaleDateString('cs-CZ'),
          type: "Známka",
          weight: data.weight || 0,
          description: data.description || "",
          teacher: data.teacher || "",
        });
      }
    } catch (error) {
      console.error("Error loading grade:", error);
      // Použijeme mock data při chybě
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4C8DEF" />
      </View>
    );
  }

  const displaySubject = subjectName || grade.subject;

  return (
    <View style={styles.container}>
      <Header title={displaySubject} showBack />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Grade header */}
        <View style={styles.gradeHeader}>
          <View style={styles.gradeValueBox}>
            <Text style={styles.gradeValue}>{grade.value}</Text>
          </View>
          <Text style={styles.gradeName}>{grade.name}</Text>
        </View>

        {/* Grade details */}
        <View style={styles.section}>
          <DetailRow label="Datum hodnocení" value={grade.date} />
          <DetailRow label="Druh hodnocení" value={grade.type} />
          <DetailRow label="Váha" value={grade.weight.toString()} />
          {grade.teacher && <DetailRow label="Učitel" value={grade.teacher} />}
        </View>

        {/* Description */}
        {grade.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popis</Text>
            <View style={styles.verbalEvaluationBox}>
              <Text style={styles.verbalEvaluationText}>
                {grade.description}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
  gradeHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
  },
  gradeValueBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  gradeValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
  },
  gradeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  detailLabel: {
    fontSize: 15,
    color: "#666",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  verbalEvaluationBox: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  verbalEvaluationText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
});


