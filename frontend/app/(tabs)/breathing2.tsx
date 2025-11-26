import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Switch,
  TextInput,
  ScrollView,
} from "react-native";
import Svg, { Line, Polyline } from "react-native-svg";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");
const HEIGHT = 250;
const MAX_POINTS = 200;

type Phase = "Inhale" | "Hold Top" | "Exhale" | "Hold Bottom" | "Completed";

export default function BreathingOscilloscope() {
  const [data, setData] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Track if session has started
  const [phase, setPhase] = useState<Phase>("Inhale");
  const [manualMode, setManualMode] = useState(false);

  // Times (seconds)
  const [inhaleTime, setInhaleTime] = useState(4);
  const [holdTopTime, setHoldTopTime] = useState(4);
  const [exhaleTime, setExhaleTime] = useState(4);
  const [holdBottomTime, setHoldBottomTime] = useState(4);
  const [sessionMinutes, setSessionMinutes] = useState(5);

  // timers
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);

  const totalCycle = inhaleTime + holdTopTime + exhaleTime + holdBottomTime;

  async function playBeep() {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
      });
      await sound.playAsync();
    } catch {
      console.log("Beep skipped (no internet or audio blocked).");
    }
  }

  function vibrate() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  // 🚀 Start breathing logic
  useEffect(() => {
    if (!running) return;

    if (startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
    }

    const start = startTimeRef.current;
    const end = start + sessionMinutes * 60 * 1000 + totalPausedTimeRef.current;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      if (now >= end) {
        stopSession();
        setPhase("Completed");
        return;
      }

      const elapsed = ((now - start - totalPausedTimeRef.current) / 1000) % totalCycle;
      let value = 0;
      let newPhase: Phase = "Inhale";

      if (elapsed < inhaleTime) {
        const t = elapsed / inhaleTime;
        value = Math.sin((t * Math.PI) / 2);
        newPhase = "Inhale";
      } else if (elapsed < inhaleTime + holdTopTime) {
        value = 1;
        newPhase = "Hold Top";
      } else if (elapsed < inhaleTime + holdTopTime + exhaleTime) {
        const t = (elapsed - inhaleTime - holdTopTime) / exhaleTime;
        value = Math.cos((t * Math.PI) / 2);
        newPhase = "Exhale";
      } else {
        value = 0;
        newPhase = "Hold Bottom";
      }

      setPhase((prev) => {
        if (prev !== newPhase) {
          vibrate();
          playBeep();
        }
        return newPhase;
      });

      setData((prev) => [...prev, value].slice(-MAX_POINTS));
    }, 100);

    return stopSession;
  }, [running, inhaleTime, holdTopTime, exhaleTime, holdBottomTime, sessionMinutes]);

  function stopSession() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    pausedTimeRef.current = Date.now();
  }

  function reset() {
    stopSession();
    setPhase("Inhale");
    setData([]);
    setRunning(false);
    setHasStarted(false); // Reset started state
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
    totalPausedTimeRef.current = 0;
  }

  // GRAPH — Center scrolling
  const dx = width / MAX_POINTS;
  const centerX = width / 2;
  const scaleY = (v: number) => HEIGHT / 2 - v * (HEIGHT / 2 - 20);
  const points = data
    .map((y, i) => {
      const x = centerX + (i - data.length + 1) * dx;
      return `${x},${scaleY(y)}`;
    })
    .join(" ");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0F2027" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Breathing Oscilloscope</Text>
        <Text style={styles.phase}>Phase: {phase}</Text>

        {/* Oscilloscope */}
        <Svg width={width} height={HEIGHT} style={styles.chart}>
          <Line x1="0" y1={HEIGHT / 2} x2={width} y2={HEIGHT / 2} stroke="#555" />
          <Line x1={centerX} y1="0" x2={centerX} y2={HEIGHT} stroke="yellow" strokeDasharray="4" />
          <Polyline points={points} stroke="lime" strokeWidth="2" fill="none" />
        </Svg>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Stat label="Inhale" value={`${inhaleTime}s`} color="lime" />
          <Stat label="Hold" value={`${holdTopTime + holdBottomTime}s`} color="cyan" />
          <Stat label="Exhale" value={`${exhaleTime}s`} color="red" />
        </View>

        {/* Manual Toggle */}
        <Row label="Manual Mode" right={<Switch value={manualMode} onValueChange={setManualMode} />} />

        {/* Controls */}
        {manualMode ? (
          <>
            <Input label="Inhale" value={inhaleTime} setValue={setInhaleTime} />
            <Input label="Hold Top" value={holdTopTime} setValue={setHoldTopTime} />
            <Input label="Exhale" value={exhaleTime} setValue={setExhaleTime} />
            <Input label="Hold Bottom" value={holdBottomTime} setValue={setHoldBottomTime} />
            <Input label="Session (min)" value={sessionMinutes} setValue={setSessionMinutes} />
          </>
        ) : (
          <>
            <SliderRow label="Inhale" value={inhaleTime} setValue={setInhaleTime} />
            <SliderRow label="Hold Top" value={holdTopTime} setValue={setHoldTopTime} />
            <SliderRow label="Exhale" value={exhaleTime} setValue={setExhaleTime} />
            <SliderRow label="Hold Bottom" value={holdBottomTime} setValue={setHoldBottomTime} />
            <SliderRow label="Minutes" min={1} max={60} value={sessionMinutes} setValue={setSessionMinutes} />
          </>
        )}

        {/* Buttons */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <Pressable 
            style={[styles.btn, { flex: 1, backgroundColor: running ? "#E53935" : "#4CAF50" }]}
            onPress={() => {
              if (running) {
                stopSession();
                setRunning(false);
              } else {
                // Only reset timers if first time starting
                if (!hasStarted) {
                  startTimeRef.current = 0;
                  pausedTimeRef.current = 0;
                  totalPausedTimeRef.current = 0;
                } else if (pausedTimeRef.current > 0) {
                  // Calculate total paused time when resuming
                  totalPausedTimeRef.current += Date.now() - pausedTimeRef.current;
                  pausedTimeRef.current = 0;
                }
                setHasStarted(true);
                setRunning(true);
              }
            }}
          >
            <Text style={styles.btnTxt}>
              {running ? "Pause" : (hasStarted ? "Continue" : "Start")}
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.btn, { flex: 1, backgroundColor: "#808080" }]} 
            onPress={reset}
          >
            <Text style={styles.btnTxt}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

/* UI Helpers */
const Stat = ({ label, value, color }: any) => (
  <View style={[styles.statCard, { borderColor: color }]}>
    <Text style={{ color }}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Row = ({ label, right }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {right}
  </View>
);

const SliderRow = ({ label, value, setValue, min = 1, max = 10 }: any) => (
  <View style={styles.sliderBox}>
    <Text style={styles.label}>{label}: {value}s</Text>
    <Slider minimumValue={min} maximumValue={max} step={1} value={value} onValueChange={setValue} />
  </View>
);

const Input = ({ label, value, setValue }: any) => (
  <View style={styles.sliderBox}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} keyboardType="numeric"
      value={String(value)} onChangeText={(t) => setValue(Number(t) || 0)} />
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingTop: 20 },
  title: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  phase: { fontSize: 16, color: "#fff", marginBottom: 10 },
  chart: { backgroundColor: "#00243a", borderRadius: 10, marginBottom: 15 },
  statsRow: { flexDirection: "row", width: "100%", justifyContent: "space-evenly", marginVertical: 15 },
  statCard: { borderWidth: 1.5, padding: 10, borderRadius: 10, alignItems: "center", minWidth: 90 },
  value: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  row: { width: "90%", flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  label: { color: "#fff" },
  sliderBox: { width: "90%", marginVertical: 6 },
  input: { backgroundColor: "#fff", borderRadius: 6, padding: 6, textAlign: "center" },
  btn: { width: "80%", padding: 14, borderRadius: 20, marginTop: 10, alignItems: "center" },
  btnTxt: { color: "#fff", fontWeight: "bold" },
});
