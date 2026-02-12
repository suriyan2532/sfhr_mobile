import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Text, Card, ActivityIndicator, Avatar, List } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';

const ProfileScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userInfo?.id) {
            const response = await api.get(`/employees?userId=${userInfo.id}`);
            // response.data is an array because findAll returns array
            if (response.data && response.data.length > 0) {
                setEmployee(response.data[0]);
            }
        }
      } catch (error) {
        console.log('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userInfo]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text>No employee profile found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={employee.firstName.substring(0,2).toUpperCase()} />
        <Title style={styles.name}>{employee.firstName} {employee.lastName}</Title>
        <Text style={styles.code}>{employee.employeeCode}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Personal Information" />
        <Card.Content>
            <List.Item
                title="Email"
                description={employee.email || 'N/A'}
                left={props => <List.Icon {...props} icon="email" />}
            />
            <List.Item
                title="Phone"
                description={employee.phone || 'N/A'}
                left={props => <List.Icon {...props} icon="phone" />}
            />
             <List.Item
                title="National ID"
                description={employee.nationalId || 'N/A'}
                left={props => <List.Icon {...props} icon="card-account-details" />}
            />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Work Information" />
        <Card.Content>
             <List.Item
                title="Status"
                description={employee.status}
                left={props => <List.Icon {...props} icon="briefcase" />}
            />
             <List.Item
                title="Hire Date"
                description={employee.hireDate ? format(new Date(employee.hireDate), 'dd MMM yyyy') : 'N/A'}
                left={props => <List.Icon {...props} icon="calendar" />}
            />
             {employee.Shift && (
                <List.Item
                    title="Shift"
                    description={`${employee.Shift.name} (${employee.Shift.startTime} - ${employee.Shift.endTime})`}
                    left={props => <List.Icon {...props} icon="clock-outline" />}
                />
             )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  name: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  code: {
    color: '#666',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
});

export default ProfileScreen;
