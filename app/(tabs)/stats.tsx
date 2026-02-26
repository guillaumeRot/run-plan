import { Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function StatsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Statistiques</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <Text style={styles.placeholder}>Vos statistiques d'entraînement apparaîtront ici.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    placeholder: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
