import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Placeholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Template ready for chat-driven customization.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0f0f0f' },
  text: { color: '#ffffff', fontSize: 16, textAlign: 'center' },
});
