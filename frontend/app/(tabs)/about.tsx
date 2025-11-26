// app/(tabs)/about.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";

// Define the type for team members
type TeamMember = {
  name: string;
  role: string;
  image: any;
  bio: string;
};

export default function AboutScreen() {
  const [selectedMember, setSelectedMember] = useState < TeamMember | null > (null);

  const teamMembers: TeamMember[] = [
    {
      name: "Fran Biegenek, MS, LP, BCN",
      role: "Licensed Psychologist, Psychophysiologist, Board Certified in Neurofeedback as an Associate Fellow.",
      image: require("../assets/images/Hall.png"),
      bio: "Fran is a licensed psychologist with over 20 years of experience in neurofeedback therapy and psychophysiology.",
    },
    {
      name: "Guy Odishaw",
      role: "CTO, Psychophysiologist, Bioelectrical Medicine Practitioner, Co-founder of Bhakti Brain Health Clinic.",
      image: require("../assets/images/Guy.png"),
      bio: "Guy specializes in bioelectrical medicine and has been a driving force behind innovative wellness solutions.",
    },
    {
      name: "Adam Dowiak",
      role: "B.A. in Psychology with a minor in Public Health, University of Minnesota.",
      image: require("../assets/images/Hal.png"),
      bio: "Adam brings expertise in public health and psychology, focusing on community mental health programs.",
    },
    {
      name: "Brooke Jacobsen",
      role: "B.A. in Psychology & Criminology, M.A. in Psychology.",
      image: require("../assets/images/Brooke.png"),
      bio: "Brooke combines her background in criminology and psychology to provide unique insights into behavioral therapy.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Company Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/Screenshot_2025-08-04_at_9.53.07_AM-removebg.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.companyName}>Bhakti Brain Health Clinic</Text>
        <Text style={styles.companyDescription}>
          At Bhakti Brain Health Clinic, we are dedicated to improving brain
          health and overall wellness through evidence-based practices,
          innovative therapies, and compassionate care. Our team of
          professionals is here to guide you on your journey to a healthier,
          happier life.
        </Text>
      </View>

      {/* Team Section */}
      <Text style={styles.sectionTitle}>Meet Our Team</Text>
      <View style={styles.teamContainer}>
        {teamMembers.map((member, index) => (
          <TouchableOpacity
            style={styles.memberCard}
            key={index}
            onPress={() => setSelectedMember(member)}
          >
            <Image source={member.image} style={styles.memberImage} />
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
            <Text style={styles.readMore}>Tap to read more</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for Member Details */}
      <Modal
        visible={selectedMember !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMember(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMember && (
              <>
                <Image
                  source={selectedMember.image}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <Text style={styles.modalName}>{selectedMember.name}</Text>
                <Text style={styles.modalRole}>{selectedMember.role}</Text>
                <Text style={styles.modalBio}>{selectedMember.bio}</Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedMember(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", padding: 20 },
  logo: { width: 180, height: 80, marginBottom: 10 },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
  },
  companyDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  teamContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  memberCard: {
    width: "45%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  memberImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
  },
  memberRole: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
    marginVertical: 5,
  },
  readMore: {
    fontSize: 12,
    color: "#6B7757",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
    textAlign: "center",
  },
  modalRole: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7757",
    textAlign: "center",
    marginBottom: 10,
  },
  modalBio: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#6B7757",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
