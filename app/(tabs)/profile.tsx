import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import {
    Activity,
    ChevronRight,
    LogOut,
    Share2,
    Shield,
    User,
    UserCircle2
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();

    const menuItems = [
        {
            id: 'account',
            title: 'Infos du compte',
            icon: User,
            route: '/profile/account-info',
            color: '#0066FF'
        },
        {
            id: 'connectivity',
            title: 'Connectivité',
            icon: Activity,
            route: '/profile/connectivity',
            color: '#059669'
        }
    ];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* User Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <UserCircle2 size={80} color="#0066FF" strokeWidth={1} />
                        </View>
                    </View>
                    <Text style={styles.userName}>Guillaume Rot</Text>
                    <Text style={styles.userRole}>Coureur Passionné</Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                index === 0 && styles.firstMenuItem,
                                index === menuItems.length - 1 && styles.lastMenuItem
                            ]}
                            onPress={() => item.route && router.push(item.route)}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                                    <item.icon size={20} color={item.color} />
                                </View>
                                <Text style={styles.menuItemTitle}>{item.title}</Text>
                            </View>
                            <ChevronRight size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Support Section */}
                <View style={styles.menuSection}>
                    <TouchableOpacity style={[styles.menuItem, styles.firstMenuItem]}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#F59E0B15' }]}>
                                <Share2 size={20} color="#F59E0B" />
                            </View>
                            <Text style={styles.menuItemTitle}>Partager l'application</Text>
                        </View>
                        <ChevronRight size={20} color="#94A3B8" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#64748B15' }]}>
                                <Shield size={20} color="#64748B" />
                            </View>
                            <Text style={styles.menuItemTitle}>Confidentialité</Text>
                        </View>
                        <ChevronRight size={20} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout')}>
                    <LogOut size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Déconnexion</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
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
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: 'transparent',
    },
    avatarContainer: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0EEFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        fontFamily: 'RobotoMediumItalic',
    },
    userRole: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
        fontWeight: '500',
    },
    menuSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    firstMenuItem: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    lastMenuItem: {
        borderBottomWidth: 0,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEE2E2',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 10,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 30,
    },
});
