import { Text, View } from '@/components/Themed';
import { Stack, useRouter } from 'expo-router';
import { Check, ChevronLeft, Mail, Phone, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function AccountInfoScreen() {
    const router = useRouter();
    const [name, setName] = useState('Guillaume');
    const [lastName, setLastName] = useState('Rot');
    const [email, setEmail] = useState('guillaume@example.com');
    const [phone, setPhone] = useState('+33 6 00 00 00 00');

    const handleSave = () => {
        Alert.alert('Succès', 'Vos informations ont été mises à jour.');
        router.back();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Infos du compte',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                            <ChevronLeft size={24} color="#0066FF" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSave} style={{ marginRight: 15 }}>
                            <Check size={24} color="#0066FF" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarCircle}>
                        <User size={40} color="#0066FF" />
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.changePhotoText}>Modifier la photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Données personnelles</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Prénom</Text>
                        <View style={styles.inputWrapper}>
                            <User size={18} color="#94A3B8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Votre prénom"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nom</Text>
                        <View style={styles.inputWrapper}>
                            <User size={18} color="#94A3B8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Votre nom"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <Mail size={18} color="#94A3B8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Votre email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Téléphone</Text>
                        <View style={styles.inputWrapper}>
                            <Phone size={18} color="#94A3B8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Votre numéro"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: 'transparent',
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0EEFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    changePhotoText: {
        color: '#0066FF',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
    },
    saveButton: {
        backgroundColor: '#0066FF',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
