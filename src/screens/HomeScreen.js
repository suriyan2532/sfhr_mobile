import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Button, Text, Card, Title, Paragraph, ActivityIndicator, DataTable } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { logout, userInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [leaveSummary, setLeaveSummary] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
        setLoading(true);
        const [attRes, leaveRes] = await Promise.all([
            api.get('/attendance/today'),
            api.get('/leaves/summary')
        ]);
        setAttendance(attRes.data); 
        setLeaveSummary(leaveRes.data);
    } catch (error) {
        console.log('Error fetching data', error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleCheckIn = async () => {
    try {
        setLoading(true);
        await api.post('/attendance/check-in');
        Alert.alert('Success', 'Checked In Successfully');
        fetchData();
    } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Check-in failed');
        setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
        setLoading(true);
        await api.post('/attendance/check-out');
        Alert.alert('Success', 'Checked Out Successfully');
        fetchData();
    } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Check-out failed');
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
            <Title onPress={() => navigation.navigate('Profile')}>Welcome, {userInfo?.username}</Title>
            <Paragraph onPress={() => navigation.navigate('Profile')} style={{fontSize: 12, color: 'blue'}}>View Profile</Paragraph>
        </View>
        <Button onPress={logout} icon="logout">Logout</Button>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.card}>
            <Card.Content>
                <Title>Attendance Today</Title>
                <Paragraph>{format(new Date(), 'eeee, dd MMMM yyyy')}</Paragraph>
                
                {loading && !refreshing && <ActivityIndicator style={{ marginTop: 10 }} />}
                
                {!loading && (
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        <Text style={styles.statusValue}>{attendance ? attendance.status : 'Not Checked In'}</Text>
                        
                        {attendance?.checkIn && (
                            <Text>In: {format(new Date(attendance.checkIn), 'HH:mm')}</Text>
                        )}
                         {attendance?.checkOut && (
                            <Text>Out: {format(new Date(attendance.checkOut), 'HH:mm')}</Text>
                        )}
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <Button 
                        mode="contained" 
                        onPress={handleCheckIn}
                        disabled={loading || (attendance && !!attendance.checkIn)}
                        style={[styles.actionButton, { backgroundColor: '#4caf50' }]}
                    >
                        Check In
                    </Button>
                    <Button 
                        mode="contained" 
                        onPress={handleCheckOut}
                         disabled={loading || !attendance || !attendance.checkIn || !!attendance.checkOut}
                        style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                    >
                        Check Out
                    </Button>
                </View>
            </Card.Content>
        </Card>

        <Card style={styles.card}>
            <Card.Content>
                <Title>Leave Quotas</Title>
                {loading && !refreshing && <ActivityIndicator />}
                {!loading && leaveSummary && leaveSummary.quota && (
                    <DataTable>
                        <DataTable.Header>
                        <DataTable.Title>Type</DataTable.Title>
                        <DataTable.Title numeric>Total</DataTable.Title>
                        <DataTable.Title numeric>Used</DataTable.Title>
                        <DataTable.Title numeric>Left</DataTable.Title>
                        </DataTable.Header>

                        {leaveSummary.quota.map((item) => (
                        <DataTable.Row key={item.id}>
                            <DataTable.Cell>{item.name}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.total}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.used}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.remaining}</DataTable.Cell>
                        </DataTable.Row>
                        ))}
                    </DataTable>
                )}
                {!loading && leaveSummary && leaveSummary.quota && leaveSummary.quota.length === 0 && (
                    <Paragraph>No leave quotas found.</Paragraph>
                )}
                {/* <Button mode="outlined" style={{ marginTop: 10 }}>View Leave History</Button> */}
            </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    elevation: 2,
    marginTop: 0, 
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  statusContainer: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 5,
  },
  statusLabel: {
    fontWeight: 'bold',
  },
  statusValue: {
    fontSize: 18,
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 0.48,
  },
});

export default HomeScreen;
